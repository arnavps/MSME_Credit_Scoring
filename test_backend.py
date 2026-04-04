import pandas as pd
import requests
import json
import time

def run_tests():
    df = pd.read_csv("data/msme_synthetic_3000_v2.csv")
    
    profiles = ["HEALTHY_GROWER", "THIN_FILE_NEWCOMER", "STRESSED_BUSINESS", "CIRCULAR_FRAUDSTER", "SEASONAL_BUSINESS"]
    targets = []
    
    for p in profiles:
        gstin = df[df['profile'] == p]['gstin'].iloc[0]
        targets.append((p, gstin))
        
    for p, gstin in targets:
        print(f"\n{'='*60}")
        print(f"TEST CASE: {p} (GSTIN: {gstin})")
        print(f"{'='*60}")
        
        t0 = time.time()
        # 1. SCORE
        try:
            res = requests.get(f"http://127.0.0.1:8000/score/{gstin}", timeout=5)
            ms = (time.time() - t0) * 1000
            print(f"[GET /score/{gstin}] (Latency: {ms:.1f}ms)")
            
            if res.status_code == 200:
                data = res.json()
                print(f" -> Score: {data['credit_score']} | Band: {data['risk_band']} | Rank: {data['cmr_equivalent']}")
                print(f" -> Fraud Flags: {data['fraud_flags']}")
                print(f" -> Top Reason: {data['top_5_reasons'][0]}")
                print(f" -> Loan Decision: {data['loan_recommendation']['type']} ({data['loan_recommendation']['amount']} INR)")
            else:
                print(f" -> Error {res.status_code}: {res.text}")
        except Exception as e:
            print(f" -> Request Failed: {e}")
            
        # 2. ARENA
        try:
            res = requests.get(f"http://127.0.0.1:8000/arena/{gstin}", timeout=5)
            if res.status_code == 200:
                bids = res.json().get("active_bids", [])
                print(f"[GET /arena/{gstin}] -> {len(bids)} reverse-auction bids passed risk metrics")
            else:
                 print(f"[GET /arena/{gstin}] -> Error {res.status_code}")
        except Exception as e:
            print(f" -> Arena Request Failed: {e}")
            
        # 3. PULSE
        try:
            res = requests.get(f"http://127.0.0.1:8000/pulse/{gstin}", timeout=5)
            if res.status_code == 200:
                 v = res.json().get('vitals', {})
                 print(f"[GET /pulse/{gstin}] -> Margin Proxy: {v.get('margin_proxy', {}).get('current')}")
        except:
             pass

        # 4. SENTINEL
        try:
            res = requests.get(f"http://127.0.0.1:8000/sentinel/{gstin}", timeout=5)
            if res.status_code == 200:
                 alerts = res.json().get('active_system_alerts', [])
                 print(f"[GET /sentinel/{gstin}] -> {len(alerts)} Early-Warning Signals Detected")
                 if alerts:
                     for a in alerts: print(f"    Alert: {a['signal']} ({a['severity']})")
        except:
             pass

if __name__ == "__main__":
    import urllib.request
    # Ensure API is responsive before testing
    retries = 5
    for _ in range(retries):
        try:
            urllib.request.urlopen("http://127.0.0.1:8000/docs", timeout=2)
            break
        except Exception:
            print("Waiting for uvicorn server to reload...")
            time.sleep(2)
            
    run_tests()
