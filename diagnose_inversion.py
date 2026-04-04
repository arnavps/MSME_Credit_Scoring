import joblib
import pandas as pd
import numpy as np
import os

# Load Artifacts
models_dir = "models"
lgbm_model = joblib.load(os.path.join(models_dir, "credit_model.pkl"))
master_features = joblib.load(os.path.join(models_dir, "master_features.pkl"))

# Define THE SAINT
saint = {
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
    "is_real_world_enriched": 1,
    "state_code": 27 # Added by predictor
}

df = pd.DataFrame([saint])
df_lgb = df.reindex(columns=master_features, fill_value=0)

# Apply sector encoding (diagnostic)
le_sector = joblib.load(os.path.join(models_dir, "lgbm_sector_encoder.pkl"))
df_lgb['sector'] = le_sector.transform([saint['sector']])[0]

# Diagnostics
print(f"Features: {master_features}")
print(f"Input Vec: {df_lgb.values[0]}")
probs = lgbm_model.predict_proba(df_lgb)
print(f"Probs [Class 0, Class 1]: {probs}")

# Load a bit of data to verify correlations
df_v2 = pd.read_csv("data/msme_synthetic_3000_v2.csv")
print("\nCorrelation Analysis (V2):")
print(df_v2[['filing_compliance_rate', 'upi_bounce_rate', 'is_default']].corr()['is_default'])

# Check Healthy Profiles in Data
healthy = df_v2[df_v2['profile'] == 'HEALTHY_GROWER']
print(f"\nHealthy Grower Defaults: {healthy['is_default'].sum()} / {len(healthy)}")
