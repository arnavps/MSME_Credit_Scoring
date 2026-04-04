import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

from src.sentinel import sentinel
import json

def test_sentinel_triggers():
    print("\n🔍 STARTING SENTINEL EWS VERIFICATION")
    print("="*50)

    # Test Case 1: Healthy MSME
    healthy_data = {
        "gstin": "14YWMDG3562Y1Z3",
        "txn_velocity_mom": 0.05,
        "filing_compliance_rate": 0.98,
        "upi_bounce_rate": 0.02,
        "buyer_concentration_index": 0.3,
        "avg_days_late": 2,
        "promoter_cibil": 780,
        "circular_transaction_flag": 0
    }
    fraud_metrics_clean = {"is_circular": False, "circularity_ratio": 0.0, "topology_path": []}
    
    signals_healthy = sentinel.get_ews_report(healthy_data, fraud_metrics_clean)
    print(f"✅ Healthy MSME: {len(signals_healthy)} signals triggered.")
    
    # Test Case 2: Fraudulent MSME (S13, S06)
    fraud_data = {
        "gstin": "19MBWPY4089G1Z8",
        "txn_velocity_mom": -0.1,
        "filing_compliance_rate": 0.8,
        "upi_bounce_rate": 0.05,
        "buyer_concentration_index": 0.5,
        "avg_days_late": 5,
        "promoter_cibil": 700,
        "circular_transaction_flag": 1
    }
    fraud_metrics_hit = {
        "is_circular": True, 
        "circularity_ratio": 0.85, 
        "topology_path": ["19MBWPY4089G1Z8", "99ABCDE1234F1Z1", "88XYZ123456G1Z2", "19MBWPY4089G1Z8"]
    }
    
    signals_fraud = sentinel.get_ews_report(fraud_data, fraud_metrics_hit)
    print(f"🚨 Fraud MSME: {len(signals_fraud)} signals triggered.")
    s_ids = [s['id'] for s in signals_fraud]
    if "S13" in s_ids: print("   - [MATCH] S13: Circular Topology detected.")
    if "S06" in s_ids: print("   - [MATCH] S06: Round-tripping surge detected.")

    # Test Case 3: Operational Distress (S01, S05, S09, S16)
    distress_data = {
        "gstin": "DISTRESS_MSME_001",
        "txn_velocity_mom": -0.45,
        "filing_compliance_rate": 0.6,
        "upi_bounce_rate": 0.18,
        "buyer_concentration_index": 0.85,
        "avg_days_late": 25,
        "promoter_cibil": 620,
        "circular_transaction_flag": 0
    }
    distress_metrics = {"is_circular": False, "circularity_ratio": 0.03, "topology_path": []}
    
    signals_distress = sentinel.get_ews_report(distress_data, distress_metrics)
    print(f"⚠️ Distress MSME: {len(signals_distress)} signals triggered.")
    s_ids_distress = [s['id'] for s in signals_distress]
    expected = ["S01", "S02", "S05", "S07", "S09", "S16"]
    for eid in expected:
        if eid in s_ids_distress:
            print(f"   - [MATCH] {eid}: Triggered correctly.")

    print("="*50)
    print("✨ VERIFICATION COMPLETE")

if __name__ == "__main__":
    test_sentinel_triggers()
