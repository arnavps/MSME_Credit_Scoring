import sys
import os
import json
# Add src to path
sys.path.append(os.path.join(os.getcwd(), "src"))
from predictor import UnifiedPredictor

def run_verify():
    predictor = UnifiedPredictor()
    predictor.load_artifacts()
    
    # 1. THE SAINT
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
    
    # 2. THE GHOST
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

    # 3. THE ROUND-TRIPPER
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

    results = {}
    for name, data in [("SAINT", saint), ("GHOST", ghost), ("FRAUDSTER", fraudster)]:
        results[name] = predictor.predict_credit_intelligence(data)
    
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    run_verify()
