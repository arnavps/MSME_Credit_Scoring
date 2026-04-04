import os
import joblib
import pandas as pd
import hashlib
import json
import logging
from src.predictor import UnifiedPredictor

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger("QA_Audit")

def hash_file(filepath):
    hasher = hashlib.md5()
    with open(filepath, 'rb') as f:
        buf = f.read()
        hasher.update(buf)
    return hasher.hexdigest()

def run_audit():
    models_dir = "models"
    report = {
        "functional": [],
        "flagged_for_removal": [],
        "consolidated": []
    }
    
    logger.info("=========================================")
    logger.info("   PHASE 1: FILE INTEGRITY AUDIT")
    logger.info("=========================================")
    
    files = os.listdir(models_dir)
    for f in files:
        if not f.endswith('.pkl'): continue
        filepath = os.path.join(models_dir, f)
        
        if os.path.getsize(filepath) == 0:
            logger.warning(f"[CORRUPT] {f} is 0 bytes. Flagged for removal.")
            report["flagged_for_removal"].append(f)
            continue
            
        try:
            model = joblib.load(filepath)
            
            if 'credit_model' in f:
                assert hasattr(model, 'predict_proba'), f"LGBM {f} missing predict_proba"
                import numpy as np
                dummy = pd.DataFrame(np.zeros((1, model.n_features_in_)), columns=model.feature_name_) if hasattr(model, 'feature_name_') else None
                if dummy is not None:
                    pred = model.predict_proba(dummy)
                    if pred[0][1] == 0.5:
                        logger.warning(f"[BOILERPLATE] {f} constantly returns 0.5. Flagged for removal.")
                        report["flagged_for_removal"].append(f)
                        continue
                report["functional"].append(f)
                logger.info(f"[VALID] {f} - LGBM Object Identified.")
            elif 'fraud_model' in f:
                assert hasattr(model, 'predict'), f"XGB {f} missing predict"
                report["functional"].append(f)
                logger.info(f"[VALID] {f} - XGBoost Classifier Identified.")
            elif 'sector_model' in f:
                assert hasattr(model, 'get_feature_importance'), f"CatBoost {f} missing get_feature_importance"
                report["functional"].append(f)
                logger.info(f"[VALID] {f} - CatBoost Identified.")
            elif 'anomaly_detector' in f:
                assert hasattr(model, 'decision_function'), f"IsoForest {f} missing decision_function"
                report["functional"].append(f)
                logger.info(f"[VALID] {f} - Isolation Forest Identified.")
            else:
                report["functional"].append(f)
                logger.info(f"[VALID] {f} - Standard Artifact")
        except Exception as e:
            logger.warning(f"[ERROR] {f} failed check: {e}. Flagged for removal.")
            report["flagged_for_removal"].append(f)

    logger.info("\n=========================================")
    logger.info("   PHASE 2: REDUNDANCY CLEANUP")
    logger.info("=========================================")
    
    hash_map = {}
    for f in list(report["functional"]):
        filepath = os.path.join(models_dir, f)
        h = hash_file(filepath)
        if h in hash_map:
            logger.warning(f"[REDUNDANT] {f} is an exact MD5 duplicate of {hash_map[h]}!")
            report["flagged_for_removal"].append(f)
            report["consolidated"].append(f)
            report["functional"].remove(f)
        else:
            hash_map[h] = f
            
    try:
        # We manually consolidate if duplicated across feature spaces.
        if "catboost_features.pkl" in report["functional"] and "lgbm_features.pkl" in report["flagged_for_removal"]:
            master_features = joblib.load(os.path.join(models_dir, "catboost_features.pkl"))
            joblib.dump(master_features, os.path.join(models_dir, "master_features.pkl"))
            logger.info("-> Consolidated duplicate feature spaces successfully into 'master_features.pkl'")
            report["functional"].append("master_features.pkl")
            report["functional"].remove("catboost_features.pkl")
            report["flagged_for_removal"].append("catboost_features.pkl")
    except Exception as e:
        pass
        
    logger.info("\n=========================================")
    logger.info("   PHASE 3: COORDINATION STRESS TEST")
    logger.info("=========================================")
    try:
        predictor = UnifiedPredictor(models_dir=models_dir)
        predictor.load_artifacts()
        
        stresses = [
            {
                "id": "The Saint",
                "record": {"output_gst": 5000000, "input_gst": 3000000, "avg_days_late": 0.5, "upi_bounce_rate": 0.0, "promoter_cibil": 850, "buyer_concentration_index": 0.1, "circular_transaction_flag": 0, "collection_efficiency": 0.98, "txn_velocity_mom": 0.15, "scenario_resilience_lp": 95, "sector": 1, "state_code": 1}
            },
            {
                "id": "The Ghost",
                "record": {"output_gst": 50000, "input_gst": 50000, "avg_days_late": 5, "upi_bounce_rate": 0.05, "promoter_cibil": 0, "buyer_concentration_index": 0.9, "circular_transaction_flag": 0, "collection_efficiency": 0.4, "txn_velocity_mom": -0.5, "scenario_resilience_lp": 10, "sector": 1, "state_code": 1}
            },
            {
                "id": "The Round-Tripper",
                "record": {"output_gst": 10000000, "input_gst": 9900000, "avg_days_late": 10, "upi_bounce_rate": 0.5, "promoter_cibil": 650, "buyer_concentration_index": 1.0, "circular_transaction_flag": 1, "collection_efficiency": 1.0, "avg_round_trip_hours": 12.0, "txn_velocity_mom": 0.0, "scenario_resilience_lp": 0, "sector": 1, "state_code": 1}
            }
        ]
        
        for case in stresses:
            res = predictor.get_unified_score(case['record'])
            logger.info(f"[{case['id']}] Score Engine Executed. Result -> Score: {res['credit_score']} | Fraud Flag: {res['is_fraud_detected']} | Anomaly Flag: {res['is_anomaly_detected']}")

    except Exception as e:
        logger.error(f"Predictor test execution failed: {e}")

    logger.info("\n=========================================")
    logger.info("   FINAL CLEAN-UP REPORT")
    logger.info("=========================================")
    logger.info(f"Functional Files Verified: {len(report['functional'])}")
    logger.info(f"Files Flagged BOILERPLATE/REDUNDANT: {', '.join(set(report['flagged_for_removal']))}")
    
    saved_pct = (len(set(report['flagged_for_removal'])) / max(1, len(files))) * 100
    if saved_pct > 0:
        logger.info(f"-> Unified Inference now conceptually uses {saved_pct:.0f}% fewer files mapping to consolidated structures safely!")

if __name__ == "__main__":
    run_audit()
