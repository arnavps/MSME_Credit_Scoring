"""
MSME Synthetic Data Generator
Generate 1,500 MSME records across 5 profiles for model training

Run: python generate_synthetic_data.py
Output: data/msme_synthetic.csv
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Set seed for reproducibility
np.random.seed(42)
random.seed(42)

def generate_gstin(state_code, entity_type="1"):
    """Generate realistic GSTIN"""
    pan_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    pan_digits = ''.join([str(random.randint(0, 9)) for _ in range(4)])
    pan_letters = ''.join([random.choice(pan_chars) for _ in range(5)])
    pan = pan_letters[:3] + 'P' + pan_letters[3] + pan_digits + pan_letters[4]
    
    return f"{state_code:02d}{pan}Z{entity_type}V"

def generate_healthy_profile(n=500):
    """Profile 1: Healthy Growing MSME"""
    data = []
    
    for i in range(n):
        state = random.choice([27, 29, 19, 9, 6])  # MH, KA, WB, UP, HR
        gstin = generate_gstin(state)
        
        # High compliance
        gst_compliance_rate = np.random.uniform(0.90, 1.00)
        avg_days_late = np.random.uniform(0, 3)
        
        # Steady growth
        monthly_turnover = np.random.uniform(800000, 5000000)
        turnover_growth_mom = np.random.uniform(0.05, 0.20)
        
        # Diverse buyers
        unique_buyers = random.randint(8, 50)
        buyer_concentration_hhi = np.random.uniform(0.08, 0.22)  # Low concentration
        
        # UPI characteristics
        upi_inflow_monthly = monthly_turnover * np.random.uniform(0.85, 1.15)
        upi_inflow_cov = np.random.uniform(0.10, 0.30)  # Low variance
        
        # E-way bills
        eway_bill_count = random.randint(40, 200)
        eway_growth_mom = np.random.uniform(0.05, 0.20)
        
        # Compliance
        epfo_compliant = 1
        bounce_rate = np.random.uniform(0, 0.05)
        
        # Promoter
        promoter_cibil = random.randint(700, 850)
        
        # Circular fraud
        circular_flag = 0
        
        # Working capital
        itc_efficiency = np.random.uniform(0.80, 0.95)
        gross_margin_proxy = np.random.uniform(0.12, 0.28)
        
        # Label
        label = 1 if np.random.random() > 0.94 else 0  # 6% default rate
        
        data.append({
            'gstin': gstin,
            'state_code': state,
            'gst_compliance_rate': gst_compliance_rate,
            'avg_days_late_filing': avg_days_late,
            'monthly_turnover': monthly_turnover,
            'turnover_growth_mom': turnover_growth_mom,
            'unique_buyers': unique_buyers,
            'buyer_concentration_hhi': buyer_concentration_hhi,
            'upi_inflow_monthly': upi_inflow_monthly,
            'upi_inflow_cov': upi_inflow_cov,
            'eway_bill_count': eway_bill_count,
            'eway_growth_mom': eway_growth_mom,
            'epfo_compliant': epfo_compliant,
            'bounce_rate': bounce_rate,
            'promoter_cibil': promoter_cibil,
            'circular_flag': circular_flag,
            'itc_efficiency': itc_efficiency,
            'gross_margin_proxy': gross_margin_proxy,
            'profile': 'healthy',
            'default': label
        })
    
    return pd.DataFrame(data)

def generate_thin_file_profile(n=300):
    """Profile 2: New-to-Credit / Thin File"""
    data = []
    
    for i in range(n):
        state = random.choice([27, 29, 19, 9, 6])
        gstin = generate_gstin(state)
        
        # Moderate compliance (learning phase)
        gst_compliance_rate = np.random.uniform(0.70, 1.00)
        avg_days_late = np.random.uniform(0, 5)
        
        # Small scale
        monthly_turnover = np.random.uniform(200000, 1500000)
        turnover_growth_mom = np.random.uniform(0, 0.15)
        
        # Few buyers
        unique_buyers = random.randint(2, 10)
        buyer_concentration_hhi = np.random.uniform(0.25, 0.45)
        
        # UPI
        upi_inflow_monthly = monthly_turnover * np.random.uniform(0.70, 1.20)
        upi_inflow_cov = np.random.uniform(0.20, 0.60)
        
        # E-way
        eway_bill_count = random.randint(5, 40)
        eway_growth_mom = np.random.uniform(0, 0.15)
        
        # Partial compliance
        epfo_compliant = random.choice([0, 1])
        bounce_rate = np.random.uniform(0, 0.10)
        
        # Promoter
        promoter_cibil = random.randint(650, 800)
        
        circular_flag = 0
        itc_efficiency = np.random.uniform(0.60, 0.85)
        gross_margin_proxy = np.random.uniform(0.08, 0.22)
        
        # Higher default rate
        label = 1 if np.random.random() > 0.80 else 0  # 20% default
        
        data.append({
            'gstin': gstin,
            'state_code': state,
            'gst_compliance_rate': gst_compliance_rate,
            'avg_days_late_filing': avg_days_late,
            'monthly_turnover': monthly_turnover,
            'turnover_growth_mom': turnover_growth_mom,
            'unique_buyers': unique_buyers,
            'buyer_concentration_hhi': buyer_concentration_hhi,
            'upi_inflow_monthly': upi_inflow_monthly,
            'upi_inflow_cov': upi_inflow_cov,
            'eway_bill_count': eway_bill_count,
            'eway_growth_mom': eway_growth_mom,
            'epfo_compliant': epfo_compliant,
            'bounce_rate': bounce_rate,
            'promoter_cibil': promoter_cibil,
            'circular_flag': circular_flag,
            'itc_efficiency': itc_efficiency,
            'gross_margin_proxy': gross_margin_proxy,
            'profile': 'thin_file',
            'default': label
        })
    
    return pd.DataFrame(data)

def generate_stressed_profile(n=300):
    """Profile 3: Stressed/Declining Business"""
    data = []
    
    for i in range(n):
        state = random.choice([27, 29, 19, 9, 6])
        gstin = generate_gstin(state)
        
        # Poor compliance
        gst_compliance_rate = np.random.uniform(0.40, 0.70)
        avg_days_late = np.random.uniform(10, 45)
        
        # Declining
        monthly_turnover = np.random.uniform(300000, 2000000)
        turnover_growth_mom = np.random.uniform(-0.30, -0.05)  # Negative growth
        
        # Very few buyers
        unique_buyers = random.randint(1, 4)
        buyer_concentration_hhi = np.random.uniform(0.60, 0.95)  # High concentration
        
        # UPI volatility
        upi_inflow_monthly = monthly_turnover * np.random.uniform(0.50, 0.90)
        upi_inflow_cov = np.random.uniform(0.50, 1.20)  # High variance
        
        # E-way declining
        eway_bill_count = random.randint(5, 30)
        eway_growth_mom = np.random.uniform(-0.30, -0.05)
        
        # Poor compliance
        epfo_compliant = 0
        bounce_rate = np.random.uniform(0.10, 0.40)
        
        # Promoter
        promoter_cibil = random.randint(550, 700)
        
        circular_flag = 0
        itc_efficiency = np.random.uniform(0.40, 0.70)
        gross_margin_proxy = np.random.uniform(0.02, 0.12)
        
        # Very high default
        label = 1 if np.random.random() > 0.45 else 0  # 55% default
        
        data.append({
            'gstin': gstin,
            'state_code': state,
            'gst_compliance_rate': gst_compliance_rate,
            'avg_days_late_filing': avg_days_late,
            'monthly_turnover': monthly_turnover,
            'turnover_growth_mom': turnover_growth_mom,
            'unique_buyers': unique_buyers,
            'buyer_concentration_hhi': buyer_concentration_hhi,
            'upi_inflow_monthly': upi_inflow_monthly,
            'upi_inflow_cov': upi_inflow_cov,
            'eway_bill_count': eway_bill_count,
            'eway_growth_mom': eway_growth_mom,
            'epfo_compliant': epfo_compliant,
            'bounce_rate': bounce_rate,
            'promoter_cibil': promoter_cibil,
            'circular_flag': circular_flag,
            'itc_efficiency': itc_efficiency,
            'gross_margin_proxy': gross_margin_proxy,
            'profile': 'stressed',
            'default': label
        })
    
    return pd.DataFrame(data)

def generate_fraudster_profile(n=200):
    """Profile 4: Circular Fraud Ring"""
    data = []
    
    for i in range(n):
        state = random.choice([27, 29, 19, 9, 6])
        gstin = generate_gstin(state)
        
        # Perfect compliance (to hide fraud)
        gst_compliance_rate = np.random.uniform(0.95, 1.00)
        avg_days_late = np.random.uniform(0, 2)
        
        # Inflated turnover
        monthly_turnover = np.random.uniform(1000000, 8000000)
        turnover_growth_mom = np.random.uniform(0.40, 1.20)  # Suspiciously high
        
        # Very few counterparties (ring members)
        unique_buyers = random.randint(1, 3)
        buyer_concentration_hhi = np.random.uniform(0.80, 1.00)
        
        # UPI shows circular pattern
        upi_inflow_monthly = monthly_turnover * np.random.uniform(0.95, 1.05)
        upi_inflow_cov = np.random.uniform(0.02, 0.10)  # Artificially stable
        
        # E-way bills don't match (fraud indicator)
        eway_bill_count = random.randint(2, 15)  # Low despite high turnover
        eway_growth_mom = np.random.uniform(0.40, 1.20)
        
        # Compliance maintained to avoid suspicion
        epfo_compliant = 1
        bounce_rate = np.random.uniform(0, 0.02)
        
        # Good promoter CIBIL (sophisticated fraudsters)
        promoter_cibil = random.randint(720, 800)
        
        # KEY FRAUD INDICATOR
        circular_flag = 1  # Always flagged
        
        itc_efficiency = np.random.uniform(0.85, 0.98)
        gross_margin_proxy = np.random.uniform(0.15, 0.35)  # Inflated
        
        # Always defaults
        label = 1
        
        data.append({
            'gstin': gstin,
            'state_code': state,
            'gst_compliance_rate': gst_compliance_rate,
            'avg_days_late_filing': avg_days_late,
            'monthly_turnover': monthly_turnover,
            'turnover_growth_mom': turnover_growth_mom,
            'unique_buyers': unique_buyers,
            'buyer_concentration_hhi': buyer_concentration_hhi,
            'upi_inflow_monthly': upi_inflow_monthly,
            'upi_inflow_cov': upi_inflow_cov,
            'eway_bill_count': eway_bill_count,
            'eway_growth_mom': eway_growth_mom,
            'epfo_compliant': epfo_compliant,
            'bounce_rate': bounce_rate,
            'promoter_cibil': promoter_cibil,
            'circular_flag': circular_flag,
            'itc_efficiency': itc_efficiency,
            'gross_margin_proxy': gross_margin_proxy,
            'profile': 'fraudster',
            'default': label
        })
    
    return pd.DataFrame(data)

def generate_seasonal_profile(n=200):
    """Profile 5: Seasonal Business (Agriculture-linked)"""
    data = []
    
    for i in range(n):
        state = random.choice([27, 29, 19, 9, 6])
        gstin = generate_gstin(state)
        
        # Good compliance
        gst_compliance_rate = np.random.uniform(0.80, 0.95)
        avg_days_late = np.random.uniform(0, 7)
        
        # Seasonal turnover
        monthly_turnover = np.random.uniform(400000, 3000000)
        turnover_growth_mom = np.random.uniform(-0.20, 0.40)  # Highly variable
        
        # Moderate buyers
        unique_buyers = random.randint(5, 25)
        buyer_concentration_hhi = np.random.uniform(0.20, 0.50)
        
        # UPI seasonal
        upi_inflow_monthly = monthly_turnover * np.random.uniform(0.80, 1.10)
        upi_inflow_cov = np.random.uniform(0.40, 0.90)  # High seasonal variance
        
        # E-way seasonal
        eway_bill_count = random.randint(10, 100)
        eway_growth_mom = np.random.uniform(-0.30, 0.50)
        
        # Partial compliance
        epfo_compliant = random.choice([0, 1])
        bounce_rate = np.random.uniform(0.02, 0.15)
        
        # Promoter
        promoter_cibil = random.randint(640, 780)
        
        circular_flag = 0
        itc_efficiency = np.random.uniform(0.70, 0.90)
        gross_margin_proxy = np.random.uniform(0.10, 0.25)
        
        # Moderate default
        label = 1 if np.random.random() > 0.88 else 0  # 12% default
        
        data.append({
            'gstin': gstin,
            'state_code': state,
            'gst_compliance_rate': gst_compliance_rate,
            'avg_days_late_filing': avg_days_late,
            'monthly_turnover': monthly_turnover,
            'turnover_growth_mom': turnover_growth_mom,
            'unique_buyers': unique_buyers,
            'buyer_concentration_hhi': buyer_concentration_hhi,
            'upi_inflow_monthly': upi_inflow_monthly,
            'upi_inflow_cov': upi_inflow_cov,
            'eway_bill_count': eway_bill_count,
            'eway_growth_mom': eway_growth_mom,
            'epfo_compliant': epfo_compliant,
            'bounce_rate': bounce_rate,
            'promoter_cibil': promoter_cibil,
            'circular_flag': circular_flag,
            'itc_efficiency': itc_efficiency,
            'gross_margin_proxy': gross_margin_proxy,
            'profile': 'seasonal',
            'default': label
        })
    
    return pd.DataFrame(data)

def main():
    print("Generating MSME synthetic dataset...")
    
    # Generate all profiles
    healthy = generate_healthy_profile(500)
    print(f"✓ Generated {len(healthy)} healthy MSMEs")
    
    thin_file = generate_thin_file_profile(300)
    print(f"✓ Generated {len(thin_file)} thin-file MSMEs")
    
    stressed = generate_stressed_profile(300)
    print(f"✓ Generated {len(stressed)} stressed MSMEs")
    
    fraudster = generate_fraudster_profile(200)
    print(f"✓ Generated {len(fraudster)} fraudster MSMEs")
    
    seasonal = generate_seasonal_profile(200)
    print(f"✓ Generated {len(seasonal)} seasonal MSMEs")
    
    # Combine all
    df = pd.concat([healthy, thin_file, stressed, fraudster, seasonal], ignore_index=True)
    
    # Add some derived features
    df['gst_upi_correlation'] = (
        df['monthly_turnover'] / df['upi_inflow_monthly']
    ).clip(0.5, 1.5)
    
    df['working_capital_proxy'] = (
        df['upi_inflow_monthly'] * 30 / df['monthly_turnover']
    ).clip(20, 90)
    
    # Shuffle
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    # Save
    import os
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/msme_synthetic.csv', index=False)
    
    print(f"\n✓ Combined dataset: {len(df)} rows")
    print(f"✓ Saved to: data/msme_synthetic.csv")
    print(f"\nProfile Distribution:")
    print(df['profile'].value_counts())
    print(f"\nDefault Rate: {df['default'].mean():.1%}")
    print(f"Fraud Cases: {df['circular_flag'].sum()}")
    
    print("\n" + "="*60)
    print("Dataset ready! Next steps:")
    print("1. Run feature engineering: python train_model.py")
    print("2. Train models with SMOTE for class balance")
    print("3. Generate SHAP values")
    print("="*60)

if __name__ == "__main__":
    main()
