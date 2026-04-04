"""
MSME Credit Scoring API - Minimal Starter Template
FastAPI backend with all required endpoints

Run: uvicorn api_starter:app --reload
Docs: http://localhost:8000/docs
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
from datetime import datetime

app = FastAPI(
    title="MSME Credit Intelligence API",
    description="Real-time credit scoring for MSMEs using alternative data",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# DATA MODELS
# ============================================================================

class LoanRecommendation(BaseModel):
    amount: int
    type: str
    tenure_months: int
    interest_band: str
    cgtmse_eligible: bool
    foir: float

class SMARegionalRisk(BaseModel):
    sma1_probability_60d: float
    sma2_probability_90d: float

class CreditScoreResponse(BaseModel):
    gstin: str
    credit_score: int
    cmr_equivalent: str
    risk_band: str
    loan_recommendation: LoanRecommendation
    sma_risk: SMARegionalRisk
    fraud_flags: List[str]
    top_5_reasons: List[str]
    score_freshness: str
    data_completeness: float
    improvement_roadmap: List[str]

class LenderBid(BaseModel):
    lender_name: str
    lender_type: str
    max_amount: int
    interest_rate: float
    tenure_months: int
    emi_monthly: int
    processing_fee_pct: float
    disbursal_days: int

class ArenaResponse(BaseModel):
    gstin: str
    credit_score: int
    eligible_lenders: List[LenderBid]
    best_offer: str
    savings_vs_worst: int
    auction_timestamp: str

class VitalSign(BaseModel):
    name: str
    current_value: float
    healthy_range: List[float]
    status: str  # "healthy", "warning", "critical"
    trend: str  # "improving", "stable", "declining"

class PulseResponse(BaseModel):
    gstin: str
    vitals: List[VitalSign]
    overall_health: str
    timestamp: str

class SentinelSignal(BaseModel):
    signal_id: str
    name: str
    triggered: bool
    lead_time_days: int
    severity: str
    value: float
    description: str

class SentinelResponse(BaseModel):
    gstin: str
    risk_level: str
    active_signals: List[SentinelSignal]
    earliest_alert_days: Optional[int]
    recommended_action: str
    timestamp: str

# ============================================================================
# HELPER FUNCTIONS (Replace with actual model predictions)
# ============================================================================

def calculate_credit_score(gstin: str) -> int:
    """
    TODO: Replace with actual LightGBM model prediction
    For now, returns mock score based on GSTIN pattern
    """
    # Mock logic - replace with: model.predict(features)
    if gstin.startswith("27"):  # Maharashtra
        return random.randint(650, 800)
    elif gstin.startswith("29"):  # Karnataka
        return random.randint(600, 750)
    else:
        return random.randint(550, 700)

def get_cmr_equivalent(score: int) -> str:
    """Map credit score to CMR band"""
    if score >= 750:
        return "CMR-1"
    elif score >= 700:
        return "CMR-2"
    elif score >= 650:
        return "CMR-3"
    elif score >= 600:
        return "CMR-4"
    elif score >= 550:
        return "CMR-5"
    else:
        return "CMR-6"

def get_risk_band(score: int) -> str:
    """Map score to risk category"""
    if score >= 750:
        return "LOW"
    elif score >= 650:
        return "LOW-MEDIUM"
    elif score >= 550:
        return "MEDIUM"
    else:
        return "HIGH"

def get_top_5_reasons(gstin: str, score: int) -> List[str]:
    """
    TODO: Replace with actual SHAP values
    For now, returns mock reasons
    """
    return [
        "GST filed on time 11/12 months",
        "UPI inflow grew 22% last 90 days",
        "E-way bill volume up 18% MoM",
        "12 unique buyers — low concentration risk",
        "No circular transactions detected"
    ]

def simulate_lender_bids(score: int) -> List[LenderBid]:
    """Generate lender bids based on credit score"""
    lenders = [
        {"name": "SBI", "type": "PSB", "min_score": 650, "base_rate": 10.5},
        {"name": "SIDBI", "type": "DFI", "min_score": 600, "base_rate": 9.5},
        {"name": "HDFC Bank", "type": "Private", "min_score": 700, "base_rate": 11.0},
        {"name": "Lendingkart", "type": "NBFC", "min_score": 580, "base_rate": 18.0},
        {"name": "Indifi", "type": "NBFC", "min_score": 560, "base_rate": 20.0},
        {"name": "Ugro Capital", "type": "NBFC", "min_score": 600, "base_rate": 16.0},
        {"name": "FlexiLoans", "type": "NBFC", "min_score": 550, "base_rate": 22.0},
        {"name": "Capital Float", "type": "NBFC", "min_score": 620, "base_rate": 17.0},
    ]
    
    eligible = []
    for lender in lenders:
        if score >= lender["min_score"]:
            amount = random.randint(500000, 3000000)
            tenure = random.choice([12, 18, 24, 36])
            rate = lender["base_rate"]
            
            # Calculate EMI
            monthly_rate = rate / 12 / 100
            emi = int(amount * monthly_rate * (1 + monthly_rate)**tenure / ((1 + monthly_rate)**tenure - 1))
            
            eligible.append(LenderBid(
                lender_name=lender["name"],
                lender_type=lender["type"],
                max_amount=amount,
                interest_rate=rate,
                tenure_months=tenure,
                emi_monthly=emi,
                processing_fee_pct=random.uniform(1.0, 3.0),
                disbursal_days=random.randint(3, 15)
            ))
    
    # Sort by EMI (best offer first)
    return sorted(eligible, key=lambda x: x.emi_monthly)

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
def root():
    """Health check"""
    return {
        "status": "healthy",
        "service": "MSME Credit Intelligence API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/score/{gstin}", response_model=CreditScoreResponse)
async def score_msme(gstin: str):
    """
    Main credit scoring endpoint
    
    Returns credit score, CMR equivalent, loan recommendation,
    SHAP reasons, and improvement roadmap
    """
    if len(gstin) != 15:
        raise HTTPException(status_code=400, detail="Invalid GSTIN format")
    
    # TODO: Load features from database/cache
    # features = load_features(gstin)
    
    # Calculate score (replace with model.predict)
    score = calculate_credit_score(gstin)
    cmr = get_cmr_equivalent(score)
    risk_band = get_risk_band(score)
    
    # Generate loan recommendation
    loan_amount = int(score * 2500)  # Simple formula
    loan_rec = LoanRecommendation(
        amount=loan_amount,
        type="Working Capital",
        tenure_months=18,
        interest_band="12-14%",
        cgtmse_eligible=True,
        foir=0.38
    )
    
    # SMA risk
    sma_risk = SMARegionalRisk(
        sma1_probability_60d=0.08,
        sma2_probability_90d=0.03
    )
    
    # Fraud check (replace with NetworkX graph check)
    fraud_flags = []
    if score < 400:
        fraud_flags.append("Suspicious circular transaction pattern detected")
    
    # SHAP reasons
    top_reasons = get_top_5_reasons(gstin, score)
    
    # Improvement roadmap
    improvement = [
        "File GSTR-1 5 days early for 2 months: +12 pts",
        "Add 3 more UPI buyers: +8 pts"
    ]
    
    return CreditScoreResponse(
        gstin=gstin,
        credit_score=score,
        cmr_equivalent=cmr,
        risk_band=risk_band,
        loan_recommendation=loan_rec,
        sma_risk=sma_risk,
        fraud_flags=fraud_flags,
        top_5_reasons=top_reasons,
        score_freshness=datetime.now().isoformat(),
        data_completeness=0.78,
        improvement_roadmap=improvement
    )

@app.get("/arena/{gstin}", response_model=ArenaResponse)
async def lender_auction(gstin: str):
    """
    ARENA: Live lender marketplace
    
    Returns competing bids from multiple lenders
    """
    if len(gstin) != 15:
        raise HTTPException(status_code=400, detail="Invalid GSTIN format")
    
    score = calculate_credit_score(gstin)
    bids = simulate_lender_bids(score)
    
    if len(bids) == 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Credit score {score} too low for any lender"
        )
    
    best = bids[0]
    worst = bids[-1]
    savings = (worst.emi_monthly - best.emi_monthly) * best.tenure_months
    
    return ArenaResponse(
        gstin=gstin,
        credit_score=score,
        eligible_lenders=bids,
        best_offer=best.lender_name,
        savings_vs_worst=savings,
        auction_timestamp=datetime.now().isoformat()
    )

@app.get("/pulse/{gstin}", response_model=PulseResponse)
async def business_vitals(gstin: str):
    """
    PULSE: Real-time business vitals monitor
    
    Returns 6 vital signs with health status
    """
    if len(gstin) != 15:
        raise HTTPException(status_code=400, detail="Invalid GSTIN format")
    
    # TODO: Calculate actual vitals from real-time data
    vitals = [
        VitalSign(
            name="Revenue Pulse",
            current_value=15.2,
            healthy_range=[5.0, 20.0],
            status="healthy",
            trend="improving"
        ),
        VitalSign(
            name="Compliance BP",
            current_value=92.0,
            healthy_range=[85.0, 100.0],
            status="healthy",
            trend="stable"
        ),
        VitalSign(
            name="Cash Oxygen",
            current_value=1.35,
            healthy_range=[1.2, 2.0],
            status="healthy",
            trend="stable"
        ),
        VitalSign(
            name="Trade Temperature",
            current_value=18.5,
            healthy_range=[5.0, 25.0],
            status="healthy",
            trend="improving"
        ),
        VitalSign(
            name="Fraud ECG",
            current_value=0.0,
            healthy_range=[0.0, 0.1],
            status="healthy",
            trend="stable"
        ),
        VitalSign(
            name="Growth Enzyme",
            current_value=12.3,
            healthy_range=[3.0, 30.0],
            status="healthy",
            trend="improving"
        ),
    ]
    
    return PulseResponse(
        gstin=gstin,
        vitals=vitals,
        overall_health="HEALTHY",
        timestamp=datetime.now().isoformat()
    )

@app.get("/sentinel/{gstin}", response_model=SentinelResponse)
async def npa_early_warning(gstin: str):
    """
    SENTINEL: Pre-NPA detection system
    
    Returns early warning signals with lead times
    """
    if len(gstin) != 15:
        raise HTTPException(status_code=400, detail="Invalid GSTIN format")
    
    # TODO: Check all 17 signals against real-time data
    # For now, return mock signals
    
    signals = [
        SentinelSignal(
            signal_id="S07",
            name="UPI Inflow Velocity Break",
            triggered=False,
            lead_time_days=55,
            severity="HIGH",
            value=0.12,
            description="7-day UPI inflow stable"
        ),
        SentinelSignal(
            signal_id="S13",
            name="Circular Transaction Onset",
            triggered=False,
            lead_time_days=20,
            severity="CRITICAL",
            value=0.0,
            description="No circular patterns detected"
        ),
    ]
    
    active = [s for s in signals if s.triggered]
    
    return SentinelResponse(
        gstin=gstin,
        risk_level="LOW" if len(active) == 0 else "HIGH",
        active_signals=active,
        earliest_alert_days=min([s.lead_time_days for s in active]) if active else None,
        recommended_action="No action required - all vitals healthy" if len(active) == 0 
            else "Immediate review recommended",
        timestamp=datetime.now().isoformat()
    )

# ============================================================================
# DEMO DATA ENDPOINTS
# ============================================================================

@app.get("/demo/healthy")
async def demo_healthy():
    """Demo: Healthy MSME"""
    return await score_msme("27AAPFU0939F1ZV")

@app.get("/demo/thin-file")
async def demo_thin_file():
    """Demo: Thin-file new business"""
    return await score_msme("09BCDGH1234E2ZW")

@app.get("/demo/fraudster")
async def demo_fraudster():
    """Demo: Fraudster with circular transactions"""
    return await score_msme("29XYZAB5678C3ZT")

# ============================================================================
# RUN
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
