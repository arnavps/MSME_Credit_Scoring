import pandas as pd
import requests
import json
import random

def run_detailed_tests():
    # Load raw data to show the inputs before we see what the API output
    df = pd.read_csv("data/msme_synthetic_3000_v2.csv")
    
    # Let's shuffle and pick a few highly distinct profiles
    profiles_to_test = ["THIN_FILE_NEWCOMER", "STRESSED_BUSINESS", "CIRCULAR_FRAUDSTER", "HEALTHY_GROWER"]
    
    for p in profiles_to_test:
        # Sample randomly from the dataset so we get totally fresh targets
        sample = df[df['profile'] == p].sample(1, random_state=random.randint(0, 1000)).iloc[0]
        gstin = sample['gstin']
        
        print(f"\n{'='*75}")
        print(f"🔍 PROFILE TEST: {p} | GSTIN Target: {gstin}")
        print(f"--- RAW DATABASE INPUTS (What the MSME actually looks like) ---")
        print(f"   Sector: {sample['sector']}")
        print(f"   Sales (Output GST): {sample['output_gst']:.2f}")
        print(f"   Avg Days Late: {sample['avg_days_late']:.1f} days")
        print(f"   UPI Bounce Rate: {sample['upi_bounce_rate']:.2%}")
        print(f"   Promoter CIBIL: {sample['promoter_cibil']}")
        print(f"   HHI (Buyer Concent): {sample['buyer_concentration_index']:.2f}")
        print(f"   Circular Flag: {bool(sample['circular_transaction_flag'])}")
        print(f"---------------------------------------------------------------")
        
        # 1. SCORE ENDPOINT
        res = requests.get(f"http://127.0.0.1:8000/score/{gstin}", timeout=5)
        if res.status_code == 200:
            data = res.json()
            print(f"[API OUTPUT -> /score] Bespoke Scoring Engine")
            print(f"  >> Generated Credit Score: {data['credit_score']} ({data['risk_band']} | {data['cmr_equivalent']})")
            if data['fraud_flags']:
                print(f"  >> 🚨 Fraud Engine Tripped: {data['fraud_flags']}")
            else:
                print(f"  >> Fraud Engine Tripped: None")
                
            print(f"  >> Dynamic SHAP Interpretations:")
            for idx, reason in enumerate(data['top_5_reasons'][:3]):
                print(f"      {idx+1}. {reason}")
        else:
            print(f"API Error: {res.text}")
            
        # 2. SENTINEL ENDPOINT
        res2 = requests.get(f"http://127.0.0.1:8000/sentinel/{gstin}", timeout=5)
        if res2.status_code == 200:
            alerts = res2.json().get('active_system_alerts', [])
            print(f"[API OUTPUT -> /sentinel] Early Warning Signal (EWS) Rules")
            if not alerts:
                print("  >> No Early Warnings Activated.")
            for a in alerts:
                print(f"  >> ⚠️ ALERT [{a['severity']}]: {a['desc']} -> Recommended Action: {a['action']}")

if __name__ == "__main__":
    run_detailed_tests()
