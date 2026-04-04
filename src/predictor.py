import joblib
import pandas as pd
import numpy as np
import os
import logging
import time
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

# Import audit logger for judicial traceability
from src.score_audit_logger import audit_logger, DataSourceType

class UnifiedPredictor:
    def __init__(self, models_dir: str = "models"):
        self.models_dir = models_dir
        
        # Models
        self.lgbm_model = None
        self.xgb_model = None
        self.cat_model = None
        self.iso_model = None
        self.rf_baseline = None
        
        # Tools
        self.explainer = None
        self.label_encoder = None
        
        # Features
        self.master_features = []
        self.xgb_features = []
        self.iso_features = []
        self.rf_features = []
        
        self.is_loaded = False

    def check_system_integrity(self):
        """1. MODEL LOADING & VERIFICATION"""
        required_files = [
            "credit_model.pkl", "fraud_model.pkl", "sector_model.pkl", 
            "anomaly_detector.pkl", "baseline_model.pkl", "shap_explainer_v2.pkl",
            "master_features.pkl", "fraud_features.pkl", "anomaly_features.pkl", "baseline_features.pkl",
            "lgbm_sector_encoder.pkl"
        ]
        
        missing = [f for f in required_files if not os.path.exists(os.path.join(self.models_dir, f))]
        if missing:
            raise RuntimeError(f"Audit Failed: Missing core artifacts: {missing}")
        
        logger.info("[AUDIT PASSED] 5-Model Stack and SHAP V2 verified.")

    def load_artifacts(self):
        self.check_system_integrity()
        t0 = time.time()
        
        try:
            # Load Primary Scorer & Explainer
            self.lgbm_model = joblib.load(os.path.join(self.models_dir, "credit_model.pkl"))
            self.explainer = joblib.load(os.path.join(self.models_dir, "shap_explainer_v2.pkl"))
            self.master_features = joblib.load(os.path.join(self.models_dir, "master_features.pkl"))
            self.label_encoder = joblib.load(os.path.join(self.models_dir, "lgbm_sector_encoder.pkl"))
            
            # Load Fraud & Anomaly Specializations
            self.xgb_model = joblib.load(os.path.join(self.models_dir, "fraud_model.pkl"))
            self.xgb_features = joblib.load(os.path.join(self.models_dir, "fraud_features.pkl"))
            
            self.iso_model = joblib.load(os.path.join(self.models_dir, "anomaly_detector.pkl"))
            self.iso_features = joblib.load(os.path.join(self.models_dir, "anomaly_features.pkl"))
            
            # Load Sector Calibrator
            self.cat_model = joblib.load(os.path.join(self.models_dir, "sector_model.pkl"))
            
            # Load Baseline Anchor
            self.rf_baseline = joblib.load(os.path.join(self.models_dir, "baseline_model.pkl"))
            self.rf_features = joblib.load(os.path.join(self.models_dir, "baseline_features.pkl"))
            
            self.is_loaded = True
            logger.info(f"Loaded Dual-Source 5-Model Architecture in {time.time()-t0:.2f}s")
        except Exception as e:
            logger.error(f"Failed to load ML artifacts: {e}")
            raise e

    def _score_to_cmr(self, score: int) -> str:
        if score >= 850: return "CMR-1"
        if score >= 800: return "CMR-2"
        if score >= 750: return "CMR-3"
        if score >= 700: return "CMR-4"
        if score >= 650: return "CMR-5"
        if score >= 600: return "CMR-6"
        if score >= 550: return "CMR-7"
        if score >= 500: return "CMR-8"
        if score >= 400: return "CMR-9"
        return "CMR-10"

    def track_score_change(
        self,
        gstin: str,
        previous_score: int,
        new_score: int,
        record: dict,
        source_type: DataSourceType,
        source_id: str,
        source_description: str,
        affected_features: Dict[str, Any],
        feature_deltas: Dict[str, float],
        risk_band: str,
        reliability_status: str = "Reliable"
    ) -> Dict[str, Any]:
        """
        Track a score change with full audit logging for judicial traceability.
        This method logs exactly which transaction caused the score to change.
        """
        # Build raw evidence from the record
        raw_evidence = {
            "gstin": gstin,
            "timestamp": time.time(),
            "features": {k: v for k, v in record.items() if k not in ['gstin', 'business_name']},
            "score_before": previous_score,
            "score_after": new_score
        }
        
        # Log the score change event
        event = audit_logger.log_score_change(
            gstin=gstin,
            previous_score=previous_score,
            new_score=new_score,
            source_type=source_type,
            source_id=source_id,
            source_description=source_description,
            affected_features=affected_features,
            feature_deltas=feature_deltas,
            reliability_status=reliability_status,
            risk_band=risk_band,
            raw_evidence=raw_evidence,
            evidence_reference=f"data/audit_logs/{gstin}_raw.json"
        )
        
        return {
            "logged": True,
            "event_id": f"{gstin}_{event.timestamp}",
            "audit_file": audit_logger._get_audit_file(gstin)
        }

    def predict_credit_intelligence(self, record: dict, apply_amnesty: bool = True) -> Dict[str, Any]:
        """CORE COORDINATION LOGIC: Executes our 5-model sequence with SHAP, Sector, and Amnesty adjustments."""
        from src.amnesty_engine import amnesty_engine
        
        if not self.is_loaded:
            self.load_artifacts()

        # Robust Preprocessing
        original_record = record.copy()
        
        # --- TWIST 2: AMNESTY PRE-INFERENCE INTERCEPTION ---
        # Neutralize filing delays if amnesty is active
        processed_record = amnesty_engine.apply_amnesty_to_features(original_record) if apply_amnesty else original_record.copy()
        
        # Dual-Source Enrichment Flag: Mandatory for live inference 
        processed_record["is_real_world_enriched"] = 1
        
        # Consistent State Code as Integer
        gstin = str(processed_record.get("gstin", "00"))
        processed_record["state_code"] = int(gstin[:2]) if gstin[:2].isdigit() else 0
        
        # Feature Fallbacks
        fallbacks = {
            "filing_compliance_rate": 1.0,
            "collection_efficiency": 0.9,
            "promoter_cibil": 700,
            "scenario_resilience_lp": 70,
            "avg_round_trip_hours": 0.0
        }
        for feat, val in fallbacks.items():
            if feat not in processed_record or processed_record[feat] is None:
                processed_record[feat] = val

        # Margin Proxy calculation
        out_gst = float(processed_record.get("output_gst", 1))
        in_gst = float(processed_record.get("input_gst", 0))
        if out_gst > 0:
            processed_record["gross_margin_proxy"] = round((out_gst - in_gst) / out_gst, 4)
        else:
            processed_record["gross_margin_proxy"] = 0.0

        df = pd.DataFrame([processed_record])
        df_lgb = df.reindex(columns=self.master_features, fill_value=0)
        
        # Sector Encoding
        if 'sector' in df_lgb.columns:
            try:
                sector_val = str(df_lgb['sector'].iloc[0])
                df_lgb['sector'] = self.label_encoder.transform([sector_val])[0]
            except:
                df_lgb['sector'] = 0
            df_lgb['sector'] = df_lgb['sector'].astype(int)
        
        # Ensure DTypes
        for col in df_lgb.columns:
            df_lgb[col] = pd.to_numeric(df_lgb[col], errors='coerce').fillna(0)

        # PD stands for Probability of Default (Class 1)
        base_probs = self.lgbm_model.predict_proba(df_lgb)
        base_pd = base_probs[0, 1]
        
        # Convert PD to 300-900 score
        base_score = int(900 - (base_pd * 600))
        
        # ---- STEP 2: SHAP Top-5 Explainability ----
        shap_values = self.explainer.shap_values(df_lgb)
        sv = shap_values[1][0] if isinstance(shap_values, list) else shap_values[0]
        
        feature_contributions = list(zip(self.master_features, sv))
        feature_contributions.sort(key=lambda x: abs(x[1]), reverse=True)
        top_5 = feature_contributions[:5]

        reasons = []
        for feature, contribution in top_5:
            fc = feature.replace("_", " ").title()
            if contribution > 0.05: reasons.append(f"(-) High Risk Flag: {fc}")
            elif contribution < -0.05: reasons.append(f"(+) Strength: {fc}")

        # ---- STEP 3: Specializations Parallel (Fraud & Anomaly) ----
        df_xgb = df.reindex(columns=self.xgb_features, fill_value=0)
        for col in df_xgb.columns: df_xgb[col] = pd.to_numeric(df_xgb[col], errors='coerce').fillna(0)
        xgb_fraud = int(self.xgb_model.predict(df_xgb)[0]) == 1
        
        df_iso = df.reindex(columns=self.iso_features, fill_value=0)
        for col in df_iso.columns: df_iso[col] = pd.to_numeric(df_iso[col], errors='coerce').fillna(0)
        iso_anomaly = int(self.iso_model.predict(df_iso)[0]) == -1
        
        fraud_triggered = bool(xgb_fraud or iso_anomaly)
        
        # ---- STEP 4: Sector Level Calibration (CatBoost) ----
        df_cat = df.reindex(columns=self.master_features, fill_value=0)
        if 'sector' in df_cat.columns: df_cat['sector'] = df_cat['sector'].astype(str)
        if 'state_code' in df_cat.columns: df_cat['state_code'] = df_cat['state_code'].astype(str)
        
        sector_pd = self.cat_model.predict_proba(df_cat)[0, 1]
        sector_score_equiv = int(900 - (sector_pd * 600))
        
        adjustment = min(20, max(-20, (sector_score_equiv - base_score) * 0.2))
        final_score = int(base_score + adjustment)
        
        # ---- STEP 5: Baseline Anchor Variance Check (Random Forest) ----
        df_rf = df.reindex(columns=self.rf_features, fill_value=0)
        for col in df_rf.columns: df_rf[col] = pd.to_numeric(df_rf[col], errors='coerce').fillna(0)
        
        rf_pd = self.rf_baseline.predict_proba(df_rf)[0, 1]
        rf_baseline_score = int(900 - (rf_pd * 600))
        
        variance_pct = abs(final_score - rf_baseline_score) / max(1, rf_baseline_score)
        manual_review = bool(variance_pct > 0.15)
        
        # ---- STEP 6: Hard Fraud Penalty & Final Calibration ----
        if fraud_triggered:
            # If fraud or anomaly detected, we must reflect it in the score even if PD is low
            # Fraudsters often have 0% PD until the rug-pull.
            final_score = int(final_score * 0.5) # 50% Penalty
            reasons.insert(0, "(!) CRITICAL: Fraud/Anomaly Signal Detected")
            risk_band = "HIGH"
        
        # Thin-File Logic: If revenue or history is too low, cap the score
        out_gst_val = float(processed_record.get("output_gst", 0))
        txn_velocity_val = float(processed_record.get("txn_velocity_mom", 0))
        is_thin_file = out_gst_val < 200000 and txn_velocity_val < 0.1
        
        if is_thin_file and not fraud_triggered:
            final_score = min(final_score, 680) # Bound new businesses
            reasons.append("(!) Advisory: Thin-File MSME (Score Capped)")
            risk_band = "MEDIUM" if final_score >= 600 else "HIGH"

        # --- TWIST 2: AMNESTY POST-HOC CORRECTION ---
        raw_final_score = final_score
        amnesty_boost = 0
        if apply_amnesty and not fraud_triggered:
            amnesty_boost = amnesty_engine.calculate_score_boost(raw_final_score, original_record)
            final_score = min(900, final_score + amnesty_boost)
            if amnesty_boost > 0:
                reasons.append(f"(+) GST Amnesty applied ({amnesty_boost} pt boost)")

        # Ensure bounds
        final_score = max(300, min(900, final_score))
        if not fraud_triggered and not is_thin_file:
            risk_band = "LOW" if final_score >= 750 else ("MEDIUM" if final_score >= 600 else "HIGH")

        return {
            "credit_score": final_score,
            "risk_band": risk_band,
            "cmr_equivalent": self._score_to_cmr(final_score),
            "fraud_detected": fraud_triggered,
            "top_reasons": reasons[:5],
            "amnesty_info": {
                "applied": bool(amnesty_boost > 0),
                "boost": amnesty_boost,
                "raw_score": raw_final_score
            },
            "review_flags": {
                "manual_review_required": manual_review,
                "baseline_variance_pct": round(float(variance_pct * 100), 2)
            }
        }


if __name__ == "__main__":
    predictor = UnifiedPredictor()
    predictor.load_artifacts()
    
    # 1. THE SAINT (Healthy Grower)
    saint = {
        "gstin": "27AAACR1234A1Z1",
        "sector": "Retail",
        "scenario_resilience_lp": 100.0,
        "output_gst": 5000000.0,
        "input_gst": 3000000.0,
        "avg_days_late": 0.1,
        "filing_compliance_rate": 1.0,
        "upi_bounce_rate": 0.0,
        "txn_velocity_mom": 0.20,
        "buyer_concentration_index": 0.1,
        "collection_efficiency": 0.99,
        "promoter_cibil": 820
    }
    
    # 2. THE GHOST (Thin-File)
    ghost = {
        "gstin": "10ABCDE1234F1Z1",
        "sector": "Logistics",
        "scenario_resilience_lp": 70.0,
        "output_gst": 50000.0,
        "input_gst": 40000.0,
        "avg_days_late": 2.0,
        "filing_compliance_rate": 1.0,
        "upi_bounce_rate": 0.0,
        "txn_velocity_mom": 0.0,
        "buyer_concentration_index": 0.5,
        "collection_efficiency": 0.9,
        "promoter_cibil": 750
    }

    # 3. THE ROUND-TRIPPER (Circular Fraud)
    fraudster = {
        "gstin": "24XYZB1234C1Z5",
        "sector": "Wholesale",
        "scenario_resilience_lp": 10.0,
        "output_gst": 10000000.0,
        "input_gst": 9900000.0,
        "avg_days_late": 1.0,
        "filing_compliance_rate": 0.95,
        "upi_bounce_rate": 0.0,
        "txn_velocity_mom": 0.05,
        "buyer_concentration_index": 0.95,
        "collection_efficiency": 1.0,
        "promoter_cibil": 720,
        "avg_round_trip_hours": 12.0
    }

    import json
    for name, test_case in [("THE SAINT", saint), ("THE GHOST", ghost), ("THE ROUND-TRIPPER", fraudster)]:
        print(f"\n--- SPECIALIZED PROBE: {name} ---")
        result = predictor.predict_credit_intelligence(test_case)
        print(json.dumps(result, indent=2))
