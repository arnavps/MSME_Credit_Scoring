import pandas as pd
import requests
import json
import time

# Configuration
CSV_PATH = 'data/msme_synthetic_3000_v2.csv'
API_URL = 'http://localhost:8001/api/v1/risk/'

# 5 Key Profiles from MSME Intelligence Engine
PROFILES = [
    'HEALTHY_GROWER',     
    'STRESSED_BUSINESS',  
    'THIN_FILE_NEWCOMER', 
    'CIRCULAR_FRAUDSTER', 
    'SEASONAL_BUSINESS'   
]

# Industrial "Gold Anchor" Demo Cases
DEMO_ANCHORS = [
    ('06FLTPW4322DZ1V', 'TechFlow Solutions', 'HEALTHY_GROWER'),
    ('09YYYPM8725QZ1V', 'Zenith Traders', 'STRESSED_BUSINESS'),
    ('06OSSPW2079NZ1V', 'Global Apex Corp', 'CIRCULAR_FRAUDSTER')
]

def run_verification():
    print("🚀 Initializing CredNexis 10-Case Verification Suite\n")
    
    try:
        df = pd.read_csv(CSV_PATH)
    except FileNotFoundError:
        print(f"❌ Error: Database at {CSV_PATH} not found.")
        return

    results = []
    
    for profile in PROFILES:
        print(f"🔎 Testing Profile: {profile}...")
        # Get 2 samples for each profile
        samples = df[df['profile'] == profile].head(2)
        
        if samples.empty:
            print(f"⚠️ Warning: No samples found for profile {profile}")
            continue
            
        for _, row in samples.iterrows():
            gstin = row['gstin']
            name = row['business_name']
            
            try:
                # Query the live API
                resp = requests.get(f"{API_URL}{gstin}", timeout=10)
                if resp.status_code == 200:
                    data = resp.json()
                    results.append({
                        "Profile": profile,
                        "Name": name,
                        "GSTIN": gstin,
                        "Score": data.get("credit_score"),
                        "Risk Band": data.get("risk_band"),
                        "Status": "✅ PASS"
                    })
                else:
                    results.append({
                        "Profile": profile, "Name": name, "GSTIN": gstin,
                        "Score": "N/A", "Risk Band": "N/A", "Status": f"❌ FAIL ({resp.status_code})"
                    })
            except Exception as e:
                results.append({
                    "Profile": profile, "Name": name, "GSTIN": gstin,
                    "Score": "N/A", "Risk Band": "N/A", "Status": f"⚠️ ERROR"
                })
            time.sleep(0.5) # Gentle throttle

    print("\n🔎 Testing Industrial Demo Anchors...")
    for gstin, name, profile in DEMO_ANCHORS:
        try:
            resp = requests.get(f"{API_URL}{gstin}", timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                results.append({
                    "Profile": f"DEMO ({profile})",
                    "Name": name,
                    "GSTIN": gstin,
                    "Score": data.get("credit_score"),
                    "Risk Band": data.get("risk_band"),
                    "Status": "✅ PASS"
                })
        except:
            results.append({
                "Profile": "DEMO", "Name": name, "GSTIN": gstin,
                "Score": "N/A", "Risk Band": "N/A", "Status": "⚠️ ERROR"
            })
    print("\n" + "="*90)
    print(f"{'PROFILE':<20} | {'NAME':<20} | {'SCORE':<5} | {'RISK':<10} | {'STATUS'}")
    print("-" * 90)
    for r in results:
        print(f"{r['Profile']:<20} | {r['Name']:<20} | {r['Score']:<5} | {r['Risk Band']:<10} | {r['Status']}")
    print("="*90 + "\n")

if __name__ == "__main__":
    run_verification()
