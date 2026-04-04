import logging
from datetime import datetime
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class AmnestyEngine:
    def __init__(self):
        # Default Amnesty Windows (Starting with Q3 FY2024)
        self.amnesty_windows = [
            {
                "name": "Q3 FY2024 Recovery",
                "start": "2024-10-01",
                "end": "2024-12-31",
                "is_active": True
            },
            {
                "name": "GSTR-1 Amnesty Pool",
                "start": "2026-04-01",
                "end": "2026-06-30", # Includes current local time 2026-04-04
                "is_active": True
            }
        ]

    def is_amnesty_active(self, date_str: str = None) -> bool:
        """Checks if the current date (or provided date) falls within an active window."""
        now = datetime.now() if not date_str else datetime.strptime(date_str, "%Y-%m-%d")
        
        for window in self.amnesty_windows:
            if not window.get("is_active", False):
                continue
            
            start = datetime.strptime(window["start"], "%Y-%m-%d")
            end = datetime.strptime(window["end"], "%Y-%m-%d")
            
            if start <= now <= end:
                return True
        return False

    def apply_amnesty_to_features(self, features: dict) -> dict:
        """
        Feature Neutralizer: Resets filing delays to 0 and floors compliance at 0.85
        if an active amnesty window is detected.
        """
        neutralized = features.copy()
        
        if self.is_amnesty_active():
            logger.info("🛡️ GST Amnesty Active: Neutralizing historical delays.")
            # Map common delay/compliance fields
            neutralized["avg_days_late"] = 0.0
            if "filing_compliance_rate" in neutralized:
                neutralized["filing_compliance_rate"] = max(0.85, neutralized["filing_compliance_rate"])
            
            # Internal tag for downstream tracking
            neutralized["_amnesty_applied"] = True
        else:
            neutralized["_amnesty_applied"] = False
            
        return neutralized

    def calculate_score_boost(self, raw_score: int, original_features: dict) -> int:
        """
        Score Corrector: Calculates post-hoc boost based on neutralized delay severity.
        Boost = avg_days_late * 5, capped at +60.
        """
        if not self.is_amnesty_active():
            return 0
            
        original_delays = float(original_features.get("avg_days_late", 0))
        compliance = float(original_features.get("filing_compliance_rate", 1.0))
        
        # Points lost due to delays (approximate correction)
        # 1 day late ~ -5 points
        boost = int(original_delays * 5)
        
        # Compliance boost (if was below 0.85)
        if compliance < 0.85:
            boost += int((0.85 - compliance) * 100)
            
        return min(60, boost)

    def configure_window(self, window_data: dict):
        """Adds or updates an amnesty window."""
        self.amnesty_windows.append(window_data)
        logger.info(f"🆕 Amnesty Window Configured: {window_data['name']}")

amnesty_engine = AmnestyEngine()
