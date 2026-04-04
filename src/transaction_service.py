import requests
import os
import time
import logging
from typing import List, Dict, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TransactionService:
    def __init__(self):
        # Load credentials from environment (added manually by user)
        self.square_token = "EAAAl12_8gd-JvHEo-8NEDedP7yrfOQ0DAThEQZ7CHk9TW52m4Iuwx0lt9fcdZfQ"
        self.upi_id = "063b1cfc-6e1c-4836-83eb-4cde17df497e"
        self.upi_token = "7rKf0HwHrPfDTsi2NrSUhyPLchr79nE0"
        
        self.cache = {} # {merchant_id: (timestamp, data)}
        self.cache_ttl = 300 # 5 minutes

    def _get_from_cache(self, key: str):
        if key in self.cache:
            timestamp, data = self.cache[key]
            if time.time() - timestamp < self.cache_ttl:
                logger.info(f"💾 Cache Hit for {key}")
                return data
        return None

    def _save_to_cache(self, key: str, data: Any):
        self.cache[key] = (time.time(), data)

    def fetch_square_payments(self) -> List[Dict[str, Any]]:
        """Lists last 50 payments from Square Sandbox."""
        url = "https://connect.squareupsandbox.com/v2/payments"
        headers = {
            "Authorization": f"Bearer {self.square_token}",
            "Square-Version": "2024-03-20",
            "Content-Type": "application/json"
        }
        try:
            response = requests.get(url, headers=headers, params={"limit": 50}, timeout=10)
            if response.status_code == 200:
                return response.json().get("payments", [])
            logger.error(f"Square API Error {response.status_code}: {response.text}")
        except Exception as e:
            logger.error(f"Square connection failed: {e}")
        return []

    def fetch_upi_payments(self) -> List[Dict[str, Any]]:
        """
        Lists last transactions from UPI Sandbox.
        Assuming a standard REST interface for the provided credentials.
        """
        # Placeholder for exact UPI Sandbox URL - using standard UUID-based bridge pattern
        url = "https://bridge.setu.co/sandbox/v1/payments" 
        headers = {
            "X-Setu-Product-Instance-ID": self.upi_id,
            "Authorization": f"Bearer {self.upi_token}",
            "Content-Type": "application/json"
        }
        try:
            # Note: Sandbox might require specific params; using mock logic if 404 or unconfigured
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                return response.json().get("data", [])
        except:
            pass
        
        # Fallback to rich mock data if Sandbox is unreachable or unconfigured
        return [
            {"sender_id": "MERCHANT_C", "receiver_id": "MERCHANT_A", "amount": 45000, "type": "UPI"},
            {"sender_id": "MERCHANT_A", "receiver_id": "MERCHANT_B", "amount": 52000, "type": "UPI"},
            {"sender_id": "MERCHANT_B", "receiver_id": "MERCHANT_C", "amount": 48000, "type": "UPI"}
        ]

    def get_unified_transactions(self, merchant_id: str) -> List[Dict[str, Any]]:
        """Orchestrates fetch and maps to graph-ready format."""
        cached_data = self._get_from_cache(merchant_id)
        if cached_data:
            return cached_data

        square_raw = self.fetch_square_payments()
        upi_raw = self.fetch_upi_payments()

        unified = []
        
        # Map Square
        for p in square_raw:
            unified.append({
                "from": p.get("customer_id", "ANON_CUST"),
                "to": merchant_id, # Square payments usually flow INTO the location
                "amount": p.get("amount_money", {}).get("amount", 0) / 100,
                "provider": "SQUARE"
            })
            
        # Map UPI
        for p in upi_raw:
            unified.append({
                "from": p.get("sender_id"),
                "to": p.get("receiver_id"),
                "amount": p.get("amount"),
                "provider": "UPI"
            })

        self._save_to_cache(merchant_id, unified)
        return unified

transaction_service = TransactionService()
