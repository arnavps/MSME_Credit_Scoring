import os
import string
import random
import numpy as np
import pandas as pd
from faker import Faker
from typing import List, Dict, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

fake = Faker("en_IN")

class DynamicMSMEGenerator:
    def __init__(self, output_dir: str = "data", enriched: bool = True):
        self.output_dir = output_dir
        self.enriched = enriched
        os.makedirs(self.output_dir, exist_ok=True)
        
        self.profile_counts = {
            "HEALTHY_GROWER": 1000,
            "THIN_FILE_NEWCOMER": 600,
            "STRESSED_BUSINESS": 600,
            "CIRCULAR_FRAUDSTER": 400,
            "SEASONAL_BUSINESS": 400
        }
        self.sectors = ['Retail', 'Wholesale', 'Manufacturing', 'Services', 'Logistics', 'Financials', 'Construction']
        
        if self.enriched:
            logger.info("Initializing Real-World Data Extractors (V2 Enriched)...")
            self._load_external_distributions()
        else:
            logger.info("Using Standard Synthetic Distributions (V1 Baseline)...")
            self.fraud_round_trip_hours = 24.0
            self.coll_delay_mean, self.coll_delay_std, self.global_collection_efficiency = 12.0, 8.0, 0.82
            self.stress_impact = {}

    def _load_external_distributions(self):
        """1. DATA SAMPLING (EFFICIENCY FIRST)"""
        txns_path = os.path.join(self.output_dir, 'transactions_data.csv')
        if os.path.exists(txns_path):
            try:
                df_txns = pd.read_csv(txns_path, nrows=50000)
                df_txns['date'] = pd.to_datetime(df_txns['date'])
                df_txns = df_txns.sort_values(by=['client_id', 'date'])
                df_txns['time_diff_hours'] = df_txns.groupby('client_id')['date'].diff().dt.total_seconds() / 3600
                real_rt = df_txns['time_diff_hours'].median()
                self.fraud_round_trip_hours = round(min(real_rt, 48.0) if pd.notna(real_rt) else 24.0, 2)
            except:
                self.fraud_round_trip_hours = 24.0
        else:
            self.fraud_round_trip_hours = 24.0

        col_path = os.path.join(self.output_dir, 'banking_collections_dataset.csv')
        if os.path.exists(col_path):
            try:
                df_coll = pd.read_csv(col_path)
                self.coll_delay_mean = df_coll['Payment_Delay_Days'].mean()
                self.coll_delay_std = df_coll['Payment_Delay_Days'].std()
                paid_count = df_coll['Payment_Status'].str.contains('Paid', case=False, na=False).sum()
                self.global_collection_efficiency = paid_count / len(df_coll)
            except:
                self.coll_delay_mean, self.coll_delay_std, self.global_collection_efficiency = 12.0, 8.0, 0.82
        else:
            self.coll_delay_mean, self.coll_delay_std, self.global_collection_efficiency = 12.0, 8.0, 0.82

        macro_path = os.path.join(self.output_dir, 'macro_stress_scenarios.csv')
        if os.path.exists(macro_path):
            try:
                df_macro = pd.read_csv(macro_path)
                self.stress_impact = df_macro.groupby('sector')['el_increase_pct'].mean().to_dict()
            except:
                self.stress_impact = {}
        else:
            self.stress_impact = {}

    def _generate_gstin(self) -> str:
        state_code = f"{random.randint(10, 37):02d}"
        pan = ''.join(random.choices(string.ascii_uppercase, k=5)) + \
              ''.join(random.choices(string.digits, k=4)) + \
              random.choice(string.ascii_uppercase)
        return f"{state_code}{pan}1Z{random.choice(string.digits)}"

    def _base_record(self, profile_name: str) -> Dict[str, Any]:
        sector = random.choice(self.sectors)
        scenario_resilience = 100
        if sector in self.stress_impact:
            scenario_resilience -= abs(self.stress_impact[sector] * 2) 
            
        return {
            "gstin": self._generate_gstin(),
            "business_name": fake.company(),
            "sector": sector,
            "profile": profile_name,
            "scenario_resilience_lp": max(0, min(100, scenario_resilience + np.random.normal(0, 10)))
        }

    def _calculate_derived(self, record: Dict[str, Any]) -> Dict[str, Any]:
        out = record.get("output_gst", 0)
        inp = record.get("input_gst", 0)
        record["gross_margin_proxy"] = round((out - inp) / out, 4) if out > 0 else 0.0
        return record

    def generate_healthy_growers(self) -> List[Dict]:
        records = []
        for _ in range(self.profile_counts["HEALTHY_GROWER"]):
            rec = self._base_record("HEALTHY_GROWER")
            out = np.random.uniform(100000, 5000000)
            rec["output_gst"] = round(out, 1)
            rec["input_gst"] = round(out * np.random.uniform(0.5, 0.8), 1)
            rec["avg_days_late"] = max(0, np.random.normal(2, 1))
            rec["filing_compliance_rate"] = 1.0
            rec["upi_bounce_rate"] = max(0, np.random.uniform(0.0, 0.05))
            rec["txn_velocity_mom"] = np.random.uniform(0.1, 0.2)
            rec["buyer_concentration_index"] = round(np.random.uniform(0.05, 0.25), 3)
            rec["collection_efficiency"] = 0.98
            rec["circular_transaction_flag"] = 0
            rec["promoter_cibil"] = random.randint(750, 850)
            rec["is_default"] = 0
            rec["is_fraud"] = 0
            records.append(self._calculate_derived(rec))
        return records

    def generate_stressed_businesses(self) -> List[Dict]:
        records = []
        for _ in range(self.profile_counts["STRESSED_BUSINESS"]):
            rec = self._base_record("STRESSED_BUSINESS")
            out = np.random.uniform(50000, 1000000)
            rec["output_gst"] = round(out, 1)
            rec["input_gst"] = round(out * np.random.uniform(0.9, 1.2), 1)
            delay = max(20.0, np.random.normal(self.coll_delay_mean * 2, self.coll_delay_std))
            rec["avg_days_late"] = round(delay, 1)
            rec["filing_compliance_rate"] = 0.65
            rec["upi_bounce_rate"] = np.random.uniform(0.15, 0.45)
            rec["txn_velocity_mom"] = np.random.uniform(-0.4, -0.05)
            rec["buyer_concentration_index"] = round(np.random.uniform(0.5, 0.8), 3)
            rec["collection_efficiency"] = 0.65
            rec["circular_transaction_flag"] = 0
            rec["promoter_cibil"] = random.randint(550, 650)
            rec["is_default"] = 1
            rec["is_fraud"] = 0
            records.append(self._calculate_derived(rec))
        return records

    def generate_circular_fraudsters(self) -> List[Dict]:
        records = []
        for _ in range(self.profile_counts["CIRCULAR_FRAUDSTER"]):
            rec = self._base_record("CIRCULAR_FRAUDSTER")
            out = np.random.uniform(2000000, 10000000)
            rec["output_gst"] = round(out, 1)
            rec["input_gst"] = round(out * np.random.uniform(0.98, 1.0), 1)
            rec["avg_days_late"] = round(np.random.uniform(0, 5), 1)
            rec["filing_compliance_rate"] = 0.95
            rec["upi_bounce_rate"] = 0.0
            rec["txn_velocity_mom"] = 0.05
            rec["buyer_concentration_index"] = 0.95
            rec["collection_efficiency"] = 1.0
            rec["circular_transaction_flag"] = 1
            rec["promoter_cibil"] = random.randint(700, 800)
            rec["is_default"] = 0
            rec["is_fraud"] = 1
            rt_hours = min(self.fraud_round_trip_hours, np.random.uniform(1.0, 48.0))
            rec["avg_round_trip_hours"] = round(rt_hours, 2)
            records.append(self._calculate_derived(rec))
        return records

    def generate_thin_file_newcomers(self) -> List[Dict]:
        records = []
        for _ in range(self.profile_counts["THIN_FILE_NEWCOMER"]):
            rec = self._base_record("THIN_FILE_NEWCOMER")
            out = np.random.uniform(10000, 200000)
            rec["output_gst"] = round(out, 1)
            rec["input_gst"] = round(out * np.random.uniform(0.7, 0.95), 1)
            rec["avg_days_late"] = max(0, np.random.normal(5, 3))
            rec["filing_compliance_rate"] = 0.9
            rec["upi_bounce_rate"] = max(0, np.random.uniform(0.01, 0.08))
            rec["txn_velocity_mom"] = np.random.uniform(-0.1, 0.5)
            rec["buyer_concentration_index"] = 0.6
            rec["collection_efficiency"] = 0.85
            rec["circular_transaction_flag"] = 0
            rec["promoter_cibil"] = random.randint(750, 850)
            rec["is_default"] = int(np.random.rand() > 0.95)
            rec["is_fraud"] = 0
            records.append(self._calculate_derived(rec))
        return records

    def generate_seasonal_businesses(self) -> List[Dict]:
        records = []
        for _ in range(self.profile_counts["SEASONAL_BUSINESS"]):
            rec = self._base_record("SEASONAL_BUSINESS")
            out = np.random.uniform(100000, 2000000)
            rec["output_gst"] = round(out, 1)
            rec["input_gst"] = round(out * np.random.uniform(0.6, 0.8), 1)
            rec["avg_days_late"] = 10.0
            rec["filing_compliance_rate"] = 0.85
            rec["upi_bounce_rate"] = 0.05
            rec["txn_velocity_mom"] = np.random.uniform(-0.6, 0.6)
            rec["buyer_concentration_index"] = 0.4
            rec["collection_efficiency"] = 0.8
            rec["circular_transaction_flag"] = 0
            rec["promoter_cibil"] = random.randint(650, 780)
            stress = rec.get("scenario_resilience_lp", 50)
            prob_default = 0.5 - (stress / 200.0)
            rec["is_default"] = np.random.choice([0, 1], p=[max(0, 1-prob_default), min(1, prob_default)])
            rec["is_fraud"] = 0
            records.append(self._calculate_derived(rec))
        return records

    def run(self, filename: str = "msme_synthetic_3000.csv") -> pd.DataFrame:
        logger.info(f"Generating synthetic MSME framework ({filename})...")
        all_records = []
        all_records.extend(self.generate_healthy_growers())
        all_records.extend(self.generate_thin_file_newcomers())
        all_records.extend(self.generate_stressed_businesses())
        all_records.extend(self.generate_circular_fraudsters())
        all_records.extend(self.generate_seasonal_businesses())
        df = pd.DataFrame(all_records)
        df = df.sample(frac=1, random_state=42).reset_index(drop=True)
        output_filepath = os.path.join(self.output_dir, filename)
        df.to_csv(output_filepath, index=False)
        logger.info(f"[SUCCESS] Dataset persisted at: {output_filepath}")
        return df

if __name__ == "__main__":
    # Generate Dual-Source Data
    gen_v1 = DynamicMSMEGenerator(enriched=False)
    gen_v1.run("msme_synthetic_3000.csv")
    
    gen_v2 = DynamicMSMEGenerator(enriched=True)
    gen_v2.run("msme_synthetic_3000_v2.csv")
    print("\nDual-Source Generation Complete (6,000 records total).")
