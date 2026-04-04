import pandas as pd
import numpy as np
import random
import os

def generate_v2_data(output_path="data/msme_synthetic_3000_v2.csv", num_records=3000):
    sectors = ["Retail", "Manufacturing", "Services", "Wholesale", "Agri-Tech"]
    profiles = ["Healthy", "Thin-File", "Stressed", "Fraudulent", "Circular-Flow"]
    
    data = []
    
    # 1. Inject "Gold Anchor" Demo Cases
    gold_anchors = [
        {
            "gstin": "06FLTPW4322DZ1V", "business_name": "Apex Precision Engineering", "sector": "Manufacturing",
            "profile": "Healthy", "output_gst": 4500000, "input_gst": 3200000, "filing_compliance_rate": 1.0,
            "avg_days_late": 1.2, "upi_bounce_rate": 0.02, "txn_velocity_mom": 0.12, "collection_efficiency": 0.98,
            "circular_transaction_flag": 0, "promoter_cibil": 785, "gross_margin_proxy": 0.28, "avg_round_trip_hours": 0,
            "is_default": 0, "is_fraud": 0
        },
        {
            "gstin": "09YYYPM8725QZ1V", "business_name": "Modern Textiles & Fabrics", "sector": "Manufacturing",
            "profile": "Stressed", "output_gst": 1200000, "input_gst": 1100000, "filing_compliance_rate": 0.65,
            "avg_days_late": 18.5, "upi_bounce_rate": 0.22, "txn_velocity_mom": -0.28, "collection_efficiency": 0.72,
            "circular_transaction_flag": 0, "promoter_cibil": 612, "gross_margin_proxy": 0.08, "avg_round_trip_hours": 0,
            "is_default": 1, "is_fraud": 0
        },
        {
            "gstin": "06OSSPW2079NZ1V", "business_name": "Swift Logistics Solutions", "sector": "Services",
            "profile": "Circular-Flow", "output_gst": 8500000, "input_gst": 8300000, "filing_compliance_rate": 0.95,
            "avg_days_late": 4.5, "upi_bounce_rate": 0.08, "txn_velocity_mom": 0.45, "collection_efficiency": 0.88,
            "circular_transaction_flag": 1, "promoter_cibil": 680, "gross_margin_proxy": 0.02, "avg_round_trip_hours": 12,
            "is_default": 0, "is_fraud": 1
        }
    ]
    data.extend(gold_anchors)
    
    # 2. Generate remaining synthetic records
    for i in range(num_records - len(gold_anchors)):
        profile = random.choice(profiles)
        sector = random.choice(sectors)
        
        # Base templates
        if profile == "Healthy":
            output_gst = random.uniform(2000000, 10000000)
            input_gst = output_gst * random.uniform(0.6, 0.8)
            filing_rate = random.uniform(0.9, 1.0)
            avg_late = random.uniform(0, 5)
            upi_bounce = random.uniform(0, 0.05)
            txn_vel = random.uniform(0, 0.2)
            coll_eff = random.uniform(0.9, 1.0)
            circular = 0
            cibil = random.randint(700, 850)
            margin = random.uniform(0.15, 0.35)
            round_trip = 0
            is_def = 0
            is_fr = 0
        elif profile == "Thin-File":
            output_gst = random.uniform(500000, 1500000)
            input_gst = output_gst * random.uniform(0.4, 0.6)
            filing_rate = random.uniform(0.8, 1.0)
            avg_late = random.uniform(2, 10)
            upi_bounce = random.uniform(0.05, 0.15)
            txn_vel = random.uniform(-0.1, 0.1)
            coll_eff = random.uniform(0.8, 0.95)
            circular = 0
            cibil = random.randint(600, 750)
            margin = random.uniform(0.1, 0.25)
            round_trip = 0
            is_def = random.choice([0, 1])
            is_fr = 0
        elif profile == "Stressed":
            output_gst = random.uniform(500000, 3000000)
            input_gst = output_gst * random.uniform(0.85, 0.95)
            filing_rate = random.uniform(0.4, 0.7)
            avg_late = random.uniform(15, 45)
            upi_bounce = random.uniform(0.15, 0.4)
            txn_vel = random.uniform(-0.5, -0.2)
            coll_eff = random.uniform(0.6, 0.8)
            circular = 0
            cibil = random.randint(450, 650)
            margin = random.uniform(0.02, 0.1)
            round_trip = 0
            is_def = 1
            is_fr = 0
        elif profile == "Fraudulent":
            output_gst = random.uniform(10000000, 50000000)
            input_gst = output_gst * random.uniform(0.98, 1.02)
            filing_rate = random.uniform(0.95, 1.0)
            avg_late = random.uniform(0, 5)
            upi_bounce = random.uniform(0, 0.05)
            txn_vel = random.uniform(0.5, 2.0)
            coll_eff = random.uniform(0.9, 1.0)
            circular = random.choice([0, 1])
            cibil = random.randint(500, 750)
            margin = random.uniform(0, 0.05)
            round_trip = random.randint(6, 48)
            is_def = random.choice([0, 1])
            is_fr = 1
        else: # Circular-Flow
            output_gst = random.uniform(5000000, 20000000)
            input_gst = output_gst * random.uniform(0.95, 1.05)
            filing_rate = random.uniform(0.9, 1.0)
            avg_late = random.uniform(2, 8)
            upi_bounce = random.uniform(0.02, 0.1)
            txn_vel = random.uniform(0.3, 1.0)
            coll_eff = random.uniform(0.85, 0.95)
            circular = 1
            cibil = random.randint(600, 700)
            margin = random.uniform(0.01, 0.04)
            round_trip = random.randint(4, 24)
            is_def = 0
            is_fr = 1
            
        data.append({
            "gstin": f"{random.randint(10, 37)}{''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k=5))}{random.randint(1000, 9999)}{random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}{random.randint(1, 9)}Z{random.choice('1234567890')}",
            "business_name": f"Synthetic Biz {i}",
            "sector": sector,
            "profile": profile,
            "output_gst": output_gst,
            "input_gst": input_gst,
            "filing_compliance_rate": filing_rate,
            "avg_days_late": avg_late,
            "upi_bounce_rate": upi_bounce,
            "txn_velocity_mom": txn_vel,
            "collection_efficiency": coll_eff,
            "circular_transaction_flag": circular,
            "promoter_cibil": cibil,
            "gross_margin_proxy": margin,
            "avg_round_trip_hours": round_trip,
            "is_default": is_def,
            "is_fraud": is_fr
        })
        
    df = pd.DataFrame(data)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"✅ Successfully restored {len(df)} records to {output_path}")

if __name__ == "__main__":
    generate_v2_data()
