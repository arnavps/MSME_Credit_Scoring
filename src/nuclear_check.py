import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
import joblib

# 1. LOAD DATA
df = pd.read_csv("data/msme_synthetic_3000_v2.csv")

# 2. PREP
df['state_code'] = df['gstin'].str[:2].astype(int)
num = df.select_dtypes(include=[np.number]).columns
df[num] = df[num].fillna(0)

ignore = ['gstin', 'business_name', 'profile', 'is_default', 'is_fraud']
X = df.drop(columns=ignore)
y = df['is_default']

# sector
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
X['sector'] = le.fit_transform(X['sector'].astype(str))

# 3. TRAIN
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
# Balance
sm = SMOTE(random_state=42)
X_sm, y_sm = sm.fit_resample(X_train, y_train)

lgbm = lgb.LGBMClassifier(n_estimators=100, random_state=42)
lgbm.fit(X_sm, y_sm)

# 4. TEST THE SAINT
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

df_saint = pd.DataFrame([saint])
df_saint['sector'] = le.transform(["Retail"])[0]
df_saint = df_saint.reindex(columns=X.columns, fill_value=0)

pd_risky = lgbm.predict_proba(df_saint)[0, 1]
print(f"\nNuclear Test Result:")
print(f"PROB(Risky - Default): {pd_risky:.4f}")
print(f"Computed Score (900 - prob*600): {int(900 - pd_risky*600)}")
