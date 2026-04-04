import joblib
import pandas as pd
import numpy as np

# Load
lgbm = joblib.load("models/credit_model.pkl")
feat = joblib.load("models/master_features.pkl")
explainer = joblib.load("models/shap_explainer.pkl")
le_sector = joblib.load("models/lgbm_sector_encoder.pkl")

# THE SAINT (Ideally Healthy)
# Ensure we include ALL features in master_features.pkl
# Feature List Reference: sector, scenario_resilience_lp, output_gst, input_gst, avg_days_late, filing_compliance_rate, upi_bounce_rate, txn_velocity_mom, buyer_concentration_index, collection_efficiency, circular_transaction_flag, promoter_cibil, gross_margin_proxy, avg_round_trip_hours, state_code
saint = {
    "sector": "Retail",
    "scenario_resilience_lp": 100.0,
    "output_gst": 5000000.0,
    "input_gst": 3000000.0,
    "avg_days_late": 0.5,
    "filing_compliance_rate": 1.0,
    "upi_bounce_rate": 0.0,
    "txn_velocity_mom": 0.20,
    "buyer_concentration_index": 0.1,
    "collection_efficiency": 0.98,
    "circular_transaction_flag": 0,
    "promoter_cibil": 850,
    "gross_margin_proxy": 0.4,
    "avg_round_trip_hours": 0.0,
    "state_code": 24
}

df = pd.DataFrame([saint])
df['sector'] = le_sector.transform(['Retail'])[0]
df = df.reindex(columns=feat, fill_value=0)

# DTYPES
for col in df.columns:
    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

# PREDICT
prob = lgbm.predict_proba(df)
print(f"\n--- PREDICTION ON THE SAINT ---")
print(f"PROB(Risky - Class 1): {prob[0, 1]:.4f}")
print(f"PROB(Safe - Class 0): {prob[0, 0]:.4f}")
print(f"Computed Score (900 - prob*600): {int(900 - prob[0, 1]*600)}")

# SHAP Analysis
sv = explainer.shap_values(df)
if isinstance(sv, list):
    # For binary models, index 1 is usually the "Risky" class
    print("\n--- SHAP REASONS (Increasing Probability of RISK) ---")
    risky_sv = sv[1][0]
    contributions = sorted(list(zip(feat, risky_sv)), key=lambda x: abs(x[1]), reverse=True)
    for f, val in contributions:
        if abs(val) > 0.01:
            print(f"  {f}: {val:+.4f}")
else:
    print("\n--- SHAP REASONS ---")
    vals = sv[0]
    contributions = sorted(list(zip(feat, vals)), key=lambda x: abs(x[1]), reverse=True)
    for f, val in contributions:
        if abs(val) > 0.01:
            print(f"  {f}: {val:+.4f}")
