import math
from typing import List, Dict, Any

class ArenaLender:
    def __init__(self, name: str, min_score: int, max_loan: int, base_rate: float, advantage: str, lender_type: str = "Bank"):
        self.name = name
        self.min_score = min_score
        self.max_loan = max_loan
        self.base_rate = base_rate
        self.advantage = advantage
        self.lender_type = lender_type

# Registry of 10 Lenders with diverse risk appetites
LENDER_REGISTRY = [
    ArenaLender("SBI", 750, 10_000_000, 8.0, "Govt-backed security & lowest terminal rates"),
    ArenaLender("SIDBI", 700, 5_000_000, 7.5, "MSME Special Schemes with subsidy support"),
    ArenaLender("HDFC Bank", 800, 15_000_000, 9.0, "Instant disbursement for high-score entities"),
    ArenaLender("Lendingkart", 600, 2_000_000, 14.0, "No collateral required, purely cashflow based", "NBFC"),
    ArenaLender("Indifi", 650, 3_000_000, 13.0, "Sector-specific customized loan products", "NBFC"),
    ArenaLender("Ugro Capital", 680, 4_000_000, 12.0, "Data-driven decisions for niche clusters", "NBFC"),
    ArenaLender("FlexiLoans", 620, 2_000_000, 15.0, "Sub-24hr approval and flexible documentation", "Fintech"),
    ArenaLender("Capital Float", 720, 5_000_000, 11.0, "Flexible repayment linked to GST cycles", "NBFC"),
    ArenaLender("ICICI Bank", 780, 12_000_000, 8.5, "Robust digital ecosystem and credit limits"),
    ArenaLender("Bajaj Finserv", 660, 4_000_000, 13.5, "Pre-approved limits and minimal paperwork", "NBFC")
]

def calculate_emi(principal: float, annual_rate: float, tenure_months: int) -> float:
    """Standard Amortization Formula: [P x R x (1+R)^N]/[(1+R)^N-1]"""
    if annual_rate == 0:
        return principal / tenure_months
    
    r = annual_rate / (12 * 100)
    n = tenure_months
    emi = (principal * r * (1 + r)**n) / ((1 + r)**n - 1)
    return round(emi, 2)

def generate_lender_bids(credit_score: int, principal: int = 1_000_000, tenure: int = 24) -> List[Dict[str, Any]]:
    """
    Simulates a live auction where lenders bid for the MSME's loan.
    Higher credit scores unlock lower rates and more lenders.
    """
    bids = []
    
    for lender in LENDER_REGISTRY:
        if credit_score >= lender.min_score:
            # Personalization Logic: Score above 600 reduces rate
            # Every 100 points reduction = 1% rate drop
            rate_reduction = (credit_score - 600) / 100
            personalized_rate = max(lender.base_rate - rate_reduction, 6.0) # Clamp at 6% floor
            
            emi = calculate_emi(principal, personalized_rate, tenure)
            total_interest = (emi * tenure) - principal
            
            bids.append({
                "lender_name": lender.name,
                "lender_type": lender.lender_type,
                "max_amount": lender.max_loan,
                "interest_rate": round(personalized_rate, 2),
                "monthly_emi": emi,
                "total_interest": round(total_interest, 2),
                "advantage": lender.advantage
            })
            
    # Sort by lowest interest rate (Winner of the auction)
    return sorted(bids, key=lambda x: x["interest_rate"])
