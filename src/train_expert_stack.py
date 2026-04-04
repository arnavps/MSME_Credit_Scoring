import pandas as pd
import numpy as np
import os
import joblib
import shap
import logging
from typing import Tuple

from sklearn.model_selection import train_test_split
from sklearn.ensemble import IsolationForest
from imblearn.over_sampling import SMOTE
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, f1_score

import lightgbm as lgb
import xgboost as xgb
from catboost import CatBoostClassifier

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ExpertStackTrainer:
    def __init__(self, v1_path="data/msme_synthetic_3000.csv", v2_path="data/msme_synthetic_3000_v2.csv", models_dir="models"):
        self.v1_path = v1_path
        self.v2_path = v2_path
        self.models_dir = models_dir
        os.makedirs(self.models_dir, exist_ok=True)
        
        logger.info(f"Loading Dual-Source Data: {v1_path} and {v2_path}")
        df1 = pd.read_csv(self.v1_path)
        df1['is_real_world_enriched'] = 0
        
        df2 = pd.read_csv(self.v2_path)
        df2['is_real_world_enriched'] = 1
        
        self.df = pd.concat([df1, df2], ignore_index=True)
        self.df_v2 = df2.copy() # Specifically for Isolation Forest
        
        # Clean NaNs
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        self.df[numeric_cols] = self.df[numeric_cols].fillna(0)
        self.df_v2[numeric_cols] = self.df_v2[numeric_cols].fillna(0)
        
        # Extract 'state' as an integer consistently (GSTIN first 2 digits)
        self.df['state_code'] = self.df['gstin'].str[:2].astype(int)
        self.df_v2['state_code'] = self.df_v2['gstin'].str[:2].astype(int)
        
        # Meta info
        self.target_def = 'is_default'
        self.target_fraud = 'is_fraud'
        self.ignore_cols = ['gstin', 'business_name', 'profile', 'is_default', 'is_fraud']
        
        # Audit markers
        self.v1_indices = self.df[self.df['is_real_world_enriched'] == 0].index
        self.v2_indices = self.df[self.df['is_real_world_enriched'] == 1].index

    def train_lightgbm_judge(self):
        """1. THE MAIN JUDGE (LightGBM - Core Scorer) - Trained on Combined Payload"""
        logger.info("--- Training THE MAIN JUDGE (LightGBM - Dual Source) ---")
        
        df_lgb = self.df.copy()
        le_sector = LabelEncoder()
        df_lgb['sector'] = le_sector.fit_transform(df_lgb['sector'].astype(str))
        joblib.dump(le_sector, os.path.join(self.models_dir, "lgbm_sector_encoder.pkl"))
        
        X = df_lgb.drop(columns=self.ignore_cols)
        y = df_lgb[self.target_def]
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        smote = SMOTE(random_state=42)
        X_train_sm, y_train_sm = smote.fit_resample(X_train, y_train)
        
        model = lgb.LGBMClassifier(n_estimators=600, learning_rate=0.03, max_depth=8, colsample_bytree=0.8, random_state=42, verbosity=-1)
        model.fit(X_train_sm, y_train_sm)
        
        accuracy = accuracy_score(y_test, model.predict(X_test))
        logger.info(f" -> LGBM Accuracy (Combined): {accuracy:.4f}")
        
        # Audit Split
        y_v2_true = self.df.loc[self.v2_indices, self.target_def]
        X_v2 = self.df.loc[self.v2_indices].drop(columns=self.ignore_cols)
        # Ensure sector encoding for audit
        X_v2['sector'] = le_sector.transform(X_v2['sector'].astype(str))
        v2_acc = accuracy_score(y_v2_true, model.predict(X_v2))
        logger.info(f" -> LGBM Accuracy (V2 Subset): {v2_acc:.4f}")
        
        model_path = os.path.join(self.models_dir, "credit_model.pkl")
        joblib.dump(model, model_path)
        
        explainer = shap.TreeExplainer(model)
        shap_path = os.path.join(self.models_dir, "shap_explainer_v2.pkl")
        joblib.dump(explainer, shap_path)
        joblib.dump(X.columns.tolist(), os.path.join(self.models_dir, "master_features.pkl"))
        logger.info(f"Saved: {model_path} and SHAP V2")

    def train_fraud_detective(self):
        """2. THE FRAUD DETECTIVE (XGBoost) - Prioritizing V2 Patterns"""
        logger.info("--- Training THE FRAUD DETECTIVE (XGBoost - Prioritizing V2) ---")
        
        fraud_features = [
            'buyer_concentration_index', 'upi_bounce_rate', 'gross_margin_proxy', 
            'collection_efficiency', 'avg_round_trip_hours', 'output_gst', 'input_gst',
            'is_real_world_enriched'
        ]
        fraud_features = [f for f in fraud_features if f in self.df.columns]
        
        # Weighted training: Give V2 records 2x weight
        weights = self.df['is_real_world_enriched'].map({0: 1, 1: 5}).values
        
        X = self.df[fraud_features].copy()
        y = self.df[self.target_fraud]
        
        model = xgb.XGBClassifier(
            n_estimators=400, max_depth=6, learning_rate=0.04, 
            scale_pos_weight=(len(y) - sum(y)) / max(sum(y), 1),
            use_label_encoder=False, eval_metric='logloss', random_state=42
        )
        model.fit(X, y, sample_weight=weights)
        
        model_path = os.path.join(self.models_dir, "fraud_model.pkl")
        joblib.dump(model, model_path)
        joblib.dump(fraud_features, os.path.join(self.models_dir, "fraud_features.pkl"))
        logger.info(f"Saved: {model_path} (V2 Prioritized)")

    def train_industry_specialist(self):
        """3. THE INDUSTRY SPECIALIST (CatBoost)"""
        logger.info("--- Training THE INDUSTRY SPECIALIST (CatBoost) ---")
        
        df_cat = self.df.copy()
        X = df_cat.drop(columns=self.ignore_cols)
        y = df_cat[self.target_def]
        
        cat_features = ['sector', 'state_code']
        
        model = CatBoostClassifier(
            iterations=500, learning_rate=0.03, depth=6, 
            cat_features=cat_features, verbose=0, random_seed=42,
            auto_class_weights='Balanced'
        )
        model.fit(X, y)
        
        model_path = os.path.join(self.models_dir, "sector_model.pkl")
        joblib.dump(model, model_path)
        logger.info(f"Saved: {model_path}")

    def train_anomaly_hunter(self):
        """4. THE ANOMALY HUNTER (Isolation Forest) - Exclusive V2 Training"""
        logger.info("--- Training THE ANOMALY HUNTER (Isolation Forest - V2 Exclusive) ---")
        
        # Establishing baseline from V2 (Real-world noise)
        numeric_v2 = self.df_v2.select_dtypes(include=[np.number])
        X = numeric_v2.drop(columns=[self.target_def, self.target_fraud, 'is_real_world_enriched'], errors='ignore')
        
        model = IsolationForest(
            n_estimators=300, max_samples='auto', contamination=0.05, random_state=42
        )
        model.fit(X)
        
        model_path = os.path.join(self.models_dir, "anomaly_detector.pkl")
        joblib.dump(model, model_path)
        joblib.dump(X.columns.tolist(), os.path.join(self.models_dir, "anomaly_features.pkl"))
        logger.info(f"Saved: {model_path} (Trained on V2 noise)")

    def train_baseline_anchor(self):
        """5. THE BASELINE ANCHOR (Random Forest)"""
        logger.info("--- Training THE BASELINE ANCHOR (Random Forest) ---")
        from sklearn.ensemble import RandomForestClassifier
        
        numeric_df = self.df.select_dtypes(include=[np.number]).fillna(0)
        X = numeric_df.drop(columns=[self.target_def, self.target_fraud], errors='ignore')
        y = self.df[self.target_def]
        
        model = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
        model.fit(X, y)
        
        model_path = os.path.join(self.models_dir, "baseline_model.pkl")
        joblib.dump(model, model_path)
        joblib.dump(X.columns.tolist(), os.path.join(self.models_dir, "baseline_features.pkl"))
        logger.info(f"Saved: {model_path}")

    def run_pipeline(self):
        self.train_lightgbm_judge()
        self.train_fraud_detective()
        self.train_industry_specialist()
        self.train_anomaly_hunter()
        self.train_baseline_anchor()
        logger.info("Expert Stack Dual-Source Pipeline Complete.")

if __name__ == "__main__":
    trainer = ExpertStackTrainer()
    trainer.run_pipeline()
