import pandas as pd
import random
import time
import asyncio
import logging
import os
from src.csv_load import read_msme_csv

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def start_simulation(csv_path: str, interval_seconds: int = 30):
    """
    Background task to simulate live data updates by jittering key metrics.
    """
    logger.info(f"🚀 Pipeline Simulator started. Jittering {csv_path} every {interval_seconds}s.")
    
    while True:
        try:
            if not os.path.exists(csv_path):
                logger.error(f"CSV path {csv_path} not found.")
                await asyncio.sleep(interval_seconds)
                continue

            # Load data
            df = read_msme_csv(csv_path)
            
            # Apply jitter (1-5% random change) for all
            df['output_gst'] = df['output_gst'] * df['output_gst'].apply(lambda x: random.uniform(0.95, 1.05))
            df['filing_compliance_rate'] = df['filing_compliance_rate'].apply(
                lambda x: min(1.0, max(0.0, x * random.uniform(0.98, 1.02)))
            )

            # --- CHAOS MODE: Trigger EWS alerts for 2-3 random MSMEs ---
            chaos_targets = df.sample(n=3).index
            for idx in chaos_targets:
                # Tank their metrics to trigger S01, S05, S09
                df.at[idx, 'txn_velocity_mom'] = random.uniform(-0.5, -0.35) # S01
                df.at[idx, 'upi_bounce_rate'] = random.uniform(0.15, 0.25)    # S05
                df.at[idx, 'avg_days_late'] = random.uniform(15, 30)          # S09
                df.at[idx, 'filing_compliance_rate'] = random.uniform(0.4, 0.6) # S02
                logger.info(f"🔥 CHAOS: Tanked vitals for {df.at[idx, 'gstin']} to trigger Sentinel EWS.")

            # Save back to CSV
            df.to_csv(csv_path, index=False)
            logger.info(f"✅ Data Pipeline Jitter + Chaos applied to {len(df)} records.")
            
        except Exception as e:
            logger.error(f"Pipeline simulation error: {e}")
            
        await asyncio.sleep(interval_seconds)

if __name__ == "__main__":
    # Test runner
    asyncio.run(start_simulation("data/msme_synthetic_3000_v2.csv", interval_seconds=5))
