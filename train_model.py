"""
MSME Credit Scoring - Model Training Pipeline
Train LightGBM with SHAP explainability

Run: python train_model.py
"""

import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE
import shap
import joblib
import os

# ============================================================================
# CONFIGURATION
# ============================================================================

DATA_PATH = 'data/msme_synthetic.csv'
MODEL_DIR = 'models'
RANDOM_STATE = 42

# ============================================================================
# FEATURE ENGINEERING
# ============================================================================

def engineer_features(df):
    """
    Create derived features from raw data
    
    Key feature groups:
    1. Compliance features
    2. Growth/velocity features
    3. Concentration risk features
    4. Efficiency ratios
    5. Fraud indicators
    """
    df = df.copy()
    
    # 1. COMPLIANCE FEATURES
    df['compliance_score'] = (
        df['gst_compliance_rate'] * 0.6 + 
        (1 - df['avg_days_late_filing'] / 45) * 0.4
    ).clip(0, 1)
    
    df['late_filing_severity'] = pd.cut(
        df['avg_days_late_filing'],
        bins=[-1, 3, 10, 30, 100],
        labels=[0, 1, 2, 3]
    ).astype(int)
    
    # 2. GROWTH & VELOCITY FEATURES
    df['turnover_volatility'] = df['upi_inflow_cov']
    
    df['growth_category'] = pd.cut(
        df['turnover_growth_mom'],
        bins=[-1, -0.10, 0, 0.10, 0.30, 2],
        labels=['declining', 'stagnant', 'stable', 'growing', 'explosive']
    )
    df['is_growing'] = (df['turnover_growth_mom'] > 0.05).astype(int)
    df['is_declining'] = (df['turnover_growth_mom'] < -0.05).astype(int)
    
    # 3. CONCENTRATION RISK
    df['high_concentration_risk'] = (df['buyer_concentration_hhi'] > 0.25).astype(int)
    df['critical_concentration'] = (df['buyer_concentration_hhi'] > 0.60).astype(int)
    
    df['buyer_diversity_score'] = (
        np.log1p(df['unique_buyers']) * 
        (1 - df['buyer_concentration_hhi'])
    )
    
    # 4. EFFICIENCY RATIOS
    df['gst_upi_alignment'] = (
        df['monthly_turnover'] / df['upi_inflow_monthly'].clip(1, None)
    ).clip(0.5, 1.5)
    
    df['gst_upi_mismatch'] = (
        np.abs(df['gst_upi_alignment'] - 1.0) > 0.20
    ).astype(int)
    
    df['margin_quality'] = pd.cut(
        df['gross_margin_proxy'],
        bins=[-1, 0.05, 0.10, 0.15, 0.25, 2],
        labels=['very_low', 'low', 'moderate', 'good', 'excellent']
    )
    
    # 5. FRAUD INDICATORS
    df['fraud_risk_score'] = (
        df['circular_flag'] * 0.5 +
        df['gst_upi_mismatch'] * 0.2 +
        df['critical_concentration'] * 0.2 +
        (df['turnover_growth_mom'] > 0.40).astype(int) * 0.1
    )
    
    df['suspicious_growth'] = (
        (df['turnover_growth_mom'] > 0.40) & 
        (df['eway_bill_count'] < 20)
    ).astype(int)
    
    # 6. OPERATIONAL HEALTH
    df['operational_health'] = (
        df['epfo_compliant'] * 0.3 +
        (1 - df['bounce_rate']) * 0.4 +
        df['itc_efficiency'] * 0.3
    )
    
    # 7. PROMOTER QUALITY
    df['promoter_quality'] = pd.cut(
        df['promoter_cibil'],
        bins=[0, 600, 700, 750, 900],
        labels=['poor', 'fair', 'good', 'excellent']
    )
    
    return df

# ============================================================================
# MODEL TRAINING
# ============================================================================

def train_model():
    """Train LightGBM model with SMOTE balancing"""
    
    print("="*60)
    print("MSME CREDIT SCORING - MODEL TRAINING")
    print("="*60)
    
    # Load data
    print("\n1. Loading data...")
    df = pd.read_csv(DATA_PATH)
    print(f"   Loaded {len(df)} records")
    print(f"   Default rate: {df['default'].mean():.1%}")
    
    # Feature engineering
    print("\n2. Engineering features...")
    df = engineer_features(df)
    
    # Select features
    feature_cols = [
        # Raw features
        'gst_compliance_rate', 'avg_days_late_filing',
        'monthly_turnover', 'turnover_growth_mom',
        'unique_buyers', 'buyer_concentration_hhi',
        'upi_inflow_monthly', 'upi_inflow_cov',
        'eway_bill_count', 'eway_growth_mom',
        'epfo_compliant', 'bounce_rate',
        'promoter_cibil', 'circular_flag',
        'itc_efficiency', 'gross_margin_proxy',
        'gst_upi_correlation', 'working_capital_proxy',
        
        # Engineered features
        'compliance_score', 'late_filing_severity',
        'turnover_volatility', 'is_growing', 'is_declining',
        'high_concentration_risk', 'critical_concentration',
        'buyer_diversity_score', 'gst_upi_alignment',
        'gst_upi_mismatch', 'fraud_risk_score',
        'suspicious_growth', 'operational_health'
    ]
    
    X = df[feature_cols]
    y = df['default']
    
    print(f"   Features: {len(feature_cols)}")
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )
    
    print(f"\n3. Applying SMOTE for class balance...")
    print(f"   Before SMOTE: {y_train.value_counts().to_dict()}")
    
    smote = SMOTE(random_state=RANDOM_STATE)
    X_train_res, y_train_res = smote.fit_resample(X_train, y_train)
    
    print(f"   After SMOTE:  {pd.Series(y_train_res).value_counts().to_dict()}")
    
    # Train LightGBM
    print(f"\n4. Training LightGBM model...")
    
    model = lgb.LGBMClassifier(
        n_estimators=200,
        max_depth=7,
        learning_rate=0.05,
        num_leaves=31,
        min_child_samples=20,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=RANDOM_STATE,
        verbose=-1
    )
    
    model.fit(
        X_train_res, y_train_res,
        eval_set=[(X_test, y_test)],
        eval_metric='auc',
        callbacks=[lgb.early_stopping(50), lgb.log_evaluation(0)]
    )
    
    # Evaluate
    print(f"\n5. Model Evaluation...")
    
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    auc = roc_auc_score(y_test, y_pred_proba)
    print(f"   AUC: {auc:.4f}")
    
    print("\n   Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['No Default', 'Default']))
    
    print("\n   Confusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    print(f"   TN: {cm[0,0]:4d}  |  FP: {cm[0,1]:4d}")
    print(f"   FN: {cm[1,0]:4d}  |  TP: {cm[1,1]:4d}")
    
    # Feature importance
    print(f"\n6. Top 10 Important Features:")
    feature_importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False).head(10)
    
    for idx, row in feature_importance.iterrows():
        print(f"   {row['feature']:30s} {row['importance']:8.1f}")
    
    # SHAP values
    print(f"\n7. Calculating SHAP values...")
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_test)
    
    # SHAP summary (top features)
    shap_importance = pd.DataFrame({
        'feature': feature_cols,
        'mean_shap': np.abs(shap_values).mean(axis=0)
    }).sort_values('mean_shap', ascending=False).head(10)
    
    print("\n   Top 10 SHAP Features:")
    for idx, row in shap_importance.iterrows():
        print(f"   {row['feature']:30s} {row['mean_shap']:8.4f}")
    
    # Save model
    print(f"\n8. Saving model and artifacts...")
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    joblib.dump(model, f'{MODEL_DIR}/lightgbm_model.pkl')
    joblib.dump(explainer, f'{MODEL_DIR}/shap_explainer.pkl')
    joblib.dump(feature_cols, f'{MODEL_DIR}/feature_cols.pkl')
    
    print(f"   ✓ Saved to {MODEL_DIR}/")
    
    # Generate credit scores (300-900 scale)
    print(f"\n9. Generating credit scores...")
    
    def probability_to_score(proba):
        """Convert default probability to credit score (300-900)"""
        # Lower probability = higher score
        # 0% default prob -> 900
        # 100% default prob -> 300
        score = 900 - (proba * 600)
        return int(np.clip(score, 300, 900))
    
    scores = [probability_to_score(p) for p in y_pred_proba]
    
    print(f"   Score distribution:")
    print(f"   Min:  {min(scores)}")
    print(f"   Mean: {int(np.mean(scores))}")
    print(f"   Max:  {max(scores)}")
    
    print("\n" + "="*60)
    print("MODEL TRAINING COMPLETE!")
    print("="*60)
    print("\nNext steps:")
    print("1. Test API: uvicorn api_starter:app --reload")
    print("2. Visit: http://localhost:8000/docs")
    print("3. Try: /score/27AAPFU0939F1ZV")
    print("="*60)
    
    return model, explainer, feature_cols

# ============================================================================
# SHAP EXPLAINER DEMO
# ============================================================================

def explain_prediction(gstin_features, model, explainer, feature_cols):
    """
    Generate SHAP explanation for a single GSTIN
    
    Returns top 5 reasons in plain language
    """
    # Get SHAP values for this prediction
    shap_vals = explainer.shap_values(gstin_features)
    
    # Get top 5 features by absolute SHAP value
    feature_impacts = pd.DataFrame({
        'feature': feature_cols,
        'shap_value': shap_vals[0],
        'feature_value': gstin_features.values[0]
    })
    
    feature_impacts['abs_shap'] = np.abs(feature_impacts['shap_value'])
    top_5 = feature_impacts.nlargest(5, 'abs_shap')
    
    # Convert to plain language
    reasons = []
    for _, row in top_5.iterrows():
        feature = row['feature']
        value = row['feature_value']
        impact = row['shap_value']
        
        direction = "increases" if impact > 0 else "decreases"
        
        # Feature-specific formatting
        if feature == 'gst_compliance_rate':
            reasons.append(f"GST filed on time {value*100:.0f}% of months ({direction} score)")
        elif feature == 'promoter_cibil':
            reasons.append(f"Promoter CIBIL: {value:.0f} ({direction} score)")
        elif feature == 'circular_flag':
            if value == 1:
                reasons.append(f"⚠️ Circular transaction detected (major red flag)")
            else:
                reasons.append(f"✓ No circular transactions (builds trust)")
        elif feature == 'unique_buyers':
            reasons.append(f"{value:.0f} unique buyers ({direction} score)")
        elif feature == 'turnover_growth_mom':
            reasons.append(f"Revenue growth: {value*100:+.1f}% MoM ({direction} score)")
        else:
            reasons.append(f"{feature}: {value:.2f} ({direction} score)")
    
    return reasons

# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    train_model()
