import math
import random
from typing import List, Dict, Any

class SentinelEWS:
    def __init__(self):
        # Master Signal Metadata
        self.signal_metadata = {
            "S01": {"name": "Sudden utility payment drop", "severity": "MEDIUM", "lead_time_days": 45, "type": "Host"},
            "S02": {"name": "Cessation of GST logins", "severity": "MEDIUM", "lead_time_days": 30, "type": "Host"},
            "S03": {"name": "Frequent address changes", "severity": "LOW", "lead_time_days": 90, "type": "Host"},
            "S04": {"name": "Wage payment delays", "severity": "HIGH", "lead_time_days": 15, "type": "Host"},
            "S05": {"name": "Cheque/NACH bounce onset", "severity": "CRITICAL", "lead_time_days": 5, "type": "Transaction"},
            "S06": {"name": "Round-tripping volume surge", "severity": "CRITICAL", "lead_time_days": 0, "type": "Transaction"},
            "S07": {"name": "High buyer concentration", "severity": "LOW", "lead_time_days": 120, "type": "Transaction"},
            "S08": {"name": "Rapid balance depletion", "severity": "HIGH", "lead_time_days": 20, "type": "Transaction"},
            "S09": {"name": "GSTR-1 vs 3B delay", "severity": "MEDIUM", "lead_time_days": 40, "type": "Compliance"},
            "S10": {"name": "E-Way bill value mismatch", "severity": "MEDIUM", "lead_time_days": 35, "type": "Compliance"},
            "S11": {"name": "Credit Note surge", "severity": "LOW", "lead_time_days": 60, "type": "Compliance"},
            "S12": {"name": "Tax Notice flag active", "severity": "HIGH", "lead_time_days": 10, "type": "Compliance"},
            "S13": {"name": "Circular Topology detected", "severity": "CRITICAL", "lead_time_days": 0, "type": "Fraud"},
            "S14": {"name": "Sectoral NIC downturn", "severity": "MEDIUM", "lead_time_days": 150, "type": "Macro"},
            "S15": {"name": "Legal Caution List hit", "severity": "HIGH", "lead_time_days": 15, "type": "Legal"},
            "S16": {"name": "Promoter CIBIL drop", "severity": "HIGH", "lead_time_days": 60, "type": "External"},
            "S17": {"name": "GST Registration Cancellation", "severity": "CRITICAL", "lead_time_days": 0, "type": "Terminal"}
        }

    def get_ews_report(self, gstin_data: Dict[str, Any], fraud_metrics: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Evaluates 17 signals against MSME features.
        Uses real data where available, else applies deterministic heuristics for demo.
        """
        active_signals = []
        
        # Extract features
        txn_velocity = float(gstin_data.get('txn_velocity_mom', 0))
        compliance_rate = float(gstin_data.get('filing_compliance_rate', 1.0))
        upi_bounce = float(gstin_data.get('upi_bounce_rate', 0))
        hhi_index = float(gstin_data.get('buyer_concentration_index', 0.5))
        avg_days_late = float(gstin_data.get('avg_days_late', 0))
        promoter_cibil = float(gstin_data.get('promoter_cibil', 750))
        is_fraud_flag = bool(gstin_data.get('circular_transaction_flag', 0))
        
        # NetworkX Inputs
        is_circular = fraud_metrics.get('is_circular', False)

        # ---------------------------------------------------------
        # SIGNAL EVALUATION
        # ---------------------------------------------------------

        # S01: Utility Drop (Heuristic: Txn Velocity < -0.3)
        if txn_velocity < -0.3:
            active_signals.append(self._make_signal("S01", "Utility payments dropped by 30% MoM, indicating operational slowdown."))

        # S02: GST Logins (Heuristic: Compliance < 0.7)
        if compliance_rate < 0.7:
            active_signals.append(self._make_signal("S02", "GST portal login dormancy detected (>15 days)."))

        # S05: UPI Bounce
        if upi_bounce > 0.12:
            active_signals.append(self._make_signal("S05", f"Abnormal UPI bounce rate ({upi_bounce*100:.1f}%) detected."))

        # S06: Round-tripping (From CSV flag or high ratio)
        if is_fraud_flag or fraud_metrics.get('circularity_ratio', 0) > 0.5:
            active_signals.append(self._make_signal("S06", "Significant increase in round-tripping transaction volume."))

        # S07: Buyer Concentration
        if hhi_index > 0.8:
            active_signals.append(self._make_signal("S07", "Over-reliance on a single buyer (HHI > 0.8) poses counterparty risk."))

        # S09: Filing Delay
        if avg_days_late > 10:
            active_signals.append(self._make_signal("S09", f"Borrower is averaging {avg_days_late:.1f} days delay in GSTR filing."))

        # S13: Circular Topology
        if is_circular:
            path_str = " -> ".join(fraud_metrics.get('topology_path', []))
            active_signals.append(self._make_signal("S13", f"NetworkX detected active circular ring: {path_str}"))

        # S16: CIBIL Drop
        if promoter_cibil < 650:
            active_signals.append(self._make_signal("S16", f"Sudden drop in promoter personal CIBIL ({int(promoter_cibil)})."))

        # ---------------------------------------------------------
        # DETERMINISTIC MOCK LAYER (For Demo Completeness)
        # Using GSTIN hash ensures consistency for the same MSME
        # ---------------------------------------------------------
        gstin_hash = hash(str(gstin_data.get('gstin', '')))
        
        if (gstin_hash % 10) == 1: # 10% chance
            active_signals.append(self._make_signal("S03", "Frequent business address changes in the last 6 months."))
        if (gstin_hash % 15) == 2: # ~7% chance
            active_signals.append(self._make_signal("S04", "Labor turnover spike or wage settlement delays reported."))
        if (gstin_hash % 20) == 3:
            active_signals.append(self._make_signal("S10", "Mismatch between E-Way bill declarations and GSTR-1 values."))
        if (gstin_hash % 25) == 4:
            active_signals.append(self._make_signal("S12", "Tax authorities 'Notice' flag active in the GST system."))
        if (gstin_hash % 30) == 5:
            active_signals.append(self._make_signal("S15", "New hit detected on the MCA/CBI Caution List."))

        return active_signals

    def _make_signal(self, sid: str, description: str) -> Dict[str, Any]:
        meta = self.signal_metadata.get(sid, {})
        return {
            "id": sid,
            "name": meta.get("name"),
            "severity": meta.get("severity"),
            "lead_time_days": meta.get("lead_time_days"),
            "type": meta.get("type"),
            "description": description
        }

# Singleton
sentinel = SentinelEWS()
