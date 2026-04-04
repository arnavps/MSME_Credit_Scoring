import pandas as pd
import os

def inject_demo_cases(source_path="data/msme_synthetic_3000.csv", target_path="data/msme_synthetic_3000_v2.csv"):
    if not os.path.exists(source_path):
        print(f"ERR: Source {source_path} not found.")
        return
        
    df = pd.read_csv(source_path)
    
    # Gold Anchor Demo Cases
    gold_anchors = [
        {
            "gstin": "06FLTPW4322DZ1V", "business_name": "Apex Precision Engineering", "sector": "Manufacturing",
            "profile": "HEALTHY", "output_gst": 4500000.0, "input_gst": 3200000.0, "filing_compliance_rate": 1.0,
            "avg_days_late": 1.2, "upi_bounce_rate": 0.02, "txn_velocity_mom": 0.12, "collection_efficiency": 0.98,
            "circular_transaction_flag": 0, "promoter_cibil": 785.0, "gross_margin_proxy": 0.28, "avg_round_trip_hours": 0.0,
            "is_default": 0, "is_fraud": 0, "scenario_resilience_lp": 0.85, "buyer_concentration_index": 0.15
        },
        {
            "gstin": "09YYYPM8725QZ1V", "business_name": "Modern Textiles & Fabrics", "sector": "Manufacturing",
            "profile": "STRESSED", "output_gst": 1200000.0, "input_gst": 1100000.0, "filing_compliance_rate": 0.65,
            "avg_days_late": 18.5, "upi_bounce_rate": 0.22, "txn_velocity_mom": -0.28, "collection_efficiency": 0.72,
            "circular_transaction_flag": 0, "promoter_cibil": 612.0, "gross_margin_proxy": 0.08, "avg_round_trip_hours": 0.0,
            "is_default": 1, "is_fraud": 0, "scenario_resilience_lp": 0.45, "buyer_concentration_index": 0.45
        },
        {
            "gstin": "27AAPFU0939F1ZV", "business_name": "Healthy Retailer", "sector": "Retail",
            "profile": "HEALTHY", "output_gst": 6500000.0, "input_gst": 4200000.0, "filing_compliance_rate": 1.0,
            "avg_days_late": 0.5, "upi_bounce_rate": 0.01, "txn_velocity_mom": 0.15, "collection_efficiency": 0.99,
            "circular_transaction_flag": 0, "promoter_cibil": 810.0, "gross_margin_proxy": 0.32, "avg_round_trip_hours": 0.0,
            "is_default": 0, "is_fraud": 0, "scenario_resilience_lp": 0.92, "buyer_concentration_index": 0.08
        }
    ]
    
    # Filter out if already present (though we know they aren't)
    existing_gstins = df["gstin"].tolist()
    anchors_df = pd.DataFrame([a for a in gold_anchors if a["gstin"] not in existing_gstins])
    
    if not anchors_df.empty:
        df = pd.concat([anchors_df, df], ignore_index=True)
        print(f"✅ Injected {len(anchors_df)} demo cases into {target_path}")
    else:
        print(f"ℹ️ Demo cases already present in {source_path}")
        
    df.to_csv(target_path, index=False)
    print(f"✅ Data saved to {target_path} ({len(df)} records total)")

if __name__ == "__main__":
    inject_demo_cases()
