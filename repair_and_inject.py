import csv
import os

def clean_and_inject(source="data/msme_synthetic_3000.csv", target="data/msme_synthetic_3000_v2.csv"):
    if not os.path.exists(source):
        print(f"ERR: Source {source} not found.")
        return

    # 1. Define demo cases
    gold_anchors = [
        ["06FLTPW4322DZ1V", "Apex Precision Engineering", "Manufacturing", "HEALTHY", "0.85", "4500000.0", "3200000.0", "1.2", "1.0", "0.02", "0.12", "0.15", "0.98", "0", "785.0", "0.28", "0.0", "0", "0"],
        ["09YYYPM8725QZ1V", "Modern Textiles & Fabrics", "Manufacturing", "STRESSED", "0.45", "1200000.0", "1100000.0", "18.5", "0.65", "0.22", "-0.28", "0.45", "0.72", "0", "612.0", "0.08", "0.0", "1", "0"],
        ["27AAPFU0939F1ZV", "Healthy Retailer", "Retail", "HEALTHY", "0.92", "6500000.0", "4200000.0", "0.5", "1.0", "0.01", "0.15", "0.08", "0.99", "0", "810.0", "0.32", "0.0", "0", "0"],
        ["29OBQFV0902E1Z4", "Healthy Grower", "Wholesale", "HEALTHY_GROWER", "0.89", "8500000.0", "5200000.0", "2.1", "1.0", "0.03", "0.18", "0.12", "0.95", "0", "806.0", "0.25", "0.0", "0", "0"]
    ]
    
    header = "gstin,business_name,sector,profile,scenario_resilience_lp,output_gst,input_gst,avg_days_late,filing_compliance_rate,upi_bounce_rate,txn_velocity_mom,buyer_concentration_index,collection_efficiency,circular_transaction_flag,promoter_cibil,gross_margin_proxy,avg_round_trip_hours,is_default,is_fraud"
    expected_fields = len(header.split(','))
    
    valid_rows = []
    
    # 2. Read and filter source
    with open(source, 'r', encoding='utf-8', errors='ignore') as f:
        reader = csv.reader(f)
        try:
            source_header = next(reader)
        except StopIteration:
            source_header = []
            
        for i, row in enumerate(reader, 1):
            # Basic validation: ensure row has correct number of fields and GSTIN is present
            if len(row) == expected_fields and row[0]:
                # Skip if it's one of our anchors (we'll re-add them)
                if row[0] not in [a[0] for a in gold_anchors]:
                    valid_rows.append(row)
            else:
                if i < 200: # Only log first few errors
                    print(f"Skipping malformed row {i} (Fields: {len(row)})")

    # 3. Combine and Save
    with open(target, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header.split(','))
        writer.writerows(gold_anchors)
        writer.writerows(valid_rows)
        
    print(f"✅ Repaired and saved {len(gold_anchors) + len(valid_rows)} records to {target}")

if __name__ == "__main__":
    clean_and_inject()
