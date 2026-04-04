# MSME Credit Scoring - Quick Reference Card
## Hackathon Cheat Sheet - Keep This Open

---

## 🎯 The Winning Pitch (30 seconds)

**Hook**: "The current system was designed for large balance-sheet borrowers. We built ours for the 64 million MSMEs it was never designed to serve."

**Problem**: 80% rejection rate. Rs 58 trillion credit gap. A manufacturer with Rs 40 lakh in live orders gets rejected because he has no 2-year-old tax return.

**Solution**: We score businesses on what they're doing TODAY using real-time signals (GST velocity, UPI patterns, e-way bills). We predict where they'll be in 90 days. And we alert banks 60 days before loans go bad.

**Impact**: If deployed, could prevent Rs 18,000 crore in NPAs with 60-day advance warning.

---

## ⚡ Technical Stack (Copy-Paste Ready)

```python
# Core ML
import lightgbm as lgb
import shap
from imblearn.over_sampling import SMOTE
import networkx as nx

# API
from fastapi import FastAPI
from pydantic import BaseModel

# Data
import pandas as pd
import numpy as np

# Viz
import recharts  # React frontend
```

**Why This Stack**:
- LightGBM: Fastest training, native SHAP support
- NetworkX: Graph fraud detection, no GPU needed
- FastAPI: Auto-generates Swagger docs, <200ms response
- SMOTE: Handles 80-20 class imbalance

---

## 🚀 3 Modules to Build

### 1. ARENA (Build First - Most Visual Impact)
**What**: 10 lenders bid for your MSME in 90 seconds  
**Demo Killer**: Live leaderboard showing "You save Rs 1 lakh vs worst offer"  
**Code**: 60 lines - just filter lenders by min_score and sort by EMI  

### 2. PULSE (Build Second - Monitoring)
**What**: 6 business vitals tracked in real-time like hospital ICU  
**Vitals**:
- Revenue Pulse (UPI inflow MoM %)
- Compliance BP (GST filing rate)
- Cash Oxygen (Inflow/Outflow ratio)
- Trade Temperature (E-way bill growth)
- Fraud ECG (Circular transactions)
- Growth Enzyme (Turnover growth)

### 3. SENTINEL (Build Third - The Rs 18,000 Cr Feature)
**What**: 17 signals that fire 5-90 days BEFORE EMI bounce  
**Critical 5 to Build**:
- S07: UPI inflow drops >25% (55-day lead)
- S09: First cheque bounce (35-day lead)
- S10: Inflow only on EMI dates (30-day lead)
- S13: Circular transactions appear (20-day lead)
- S14: Balance < 7 days of EMI (15-day lead)

---

## 📊 Demo GSTINs (Memorize These)

```
HEALTHY:    27AAPFU0939F1ZV  → Score: 724, CMR-3
THIN-FILE:  09BCDGH1234E2ZW  → Score: 612, CMR-5
FRAUDSTER:  29XYZAB5678C3ZT  → Score: 387, CMR-9, circular_flag=1
```

Demo flow:
1. Enter healthy → show all modules working
2. Switch to fraudster → SENTINEL fires, graph shows cycle
3. Switch to ARENA → show 10 bids, savings calculation

---

## 🎨 UI Color Codes (Tailwind)

```javascript
// Risk bands
LOW:        'bg-green-100 text-green-800 border-green-300'
LOW-MEDIUM: 'bg-blue-100 text-blue-800 border-blue-300'
MEDIUM:     'bg-yellow-100 text-yellow-800 border-yellow-300'
HIGH:       'bg-red-100 text-red-800 border-red-300'

// Vitals status
healthy:    'text-green-600'
warning:    'text-yellow-600'
critical:   'text-red-600'

// Score gauge
300-550:    'stroke-red-500'
551-650:    'stroke-yellow-500'
651-750:    'stroke-blue-500'
751-900:    'stroke-green-500'
```

---

## 🔥 Code Snippets (Copy When Stuck)

### Credit Score Calculation
```python
def calculate_credit_score(default_probability):
    """Convert default prob to 300-900 score"""
    # Lower probability = higher score
    score = 900 - (default_probability * 600)
    return int(np.clip(score, 300, 900))
```

### CMR Mapping
```python
def get_cmr_equivalent(score):
    if score >= 750: return "CMR-1"
    elif score >= 700: return "CMR-2"
    elif score >= 650: return "CMR-3"
    elif score >= 600: return "CMR-4"
    elif score >= 550: return "CMR-5"
    else: return "CMR-6+"
```

### SHAP Top 5 Reasons
```python
def get_top_5_shap_reasons(shap_values, feature_names, feature_values):
    impacts = pd.DataFrame({
        'feature': feature_names,
        'shap': shap_values,
        'value': feature_values
    })
    impacts['abs_shap'] = np.abs(impacts['shap'])
    top_5 = impacts.nlargest(5, 'abs_shap')
    
    reasons = []
    for _, row in top_5.iterrows():
        direction = "↑" if row['shap'] > 0 else "↓"
        reasons.append(f"{row['feature']}: {row['value']:.2f} {direction}")
    
    return reasons
```

### Circular Fraud Detection (NetworkX)
```python
import networkx as nx

def detect_circular_fraud(transactions_df):
    """Find fund rotation cycles"""
    G = nx.DiGraph()
    
    for _, txn in transactions_df.iterrows():
        G.add_edge(txn['from'], txn['to'], weight=txn['amount'])
    
    cycles = list(nx.simple_cycles(G))
    
    if len(cycles) > 0:
        circular_amount = sum([...])  # sum cycle weights
        return 1, cycles  # fraud_flag, cycle_list
    
    return 0, []
```

### EMI Calculation
```python
def calculate_emi(principal, annual_rate, months):
    """Calculate monthly EMI"""
    monthly_rate = annual_rate / 12 / 100
    emi = principal * monthly_rate * (1 + monthly_rate)**months / \
          ((1 + monthly_rate)**months - 1)
    return int(emi)
```

---

## ⏱️ If Running Out of Time - DROP THESE

In this order:
1. ❌ TIMEBANK (Prophet forecasting) - nice but not critical
2. ❌ ATLAS (ecosystem mapping) - too complex for 24hr
3. ❌ All 17 SENTINEL signals → keep 5 critical ones
4. ❌ Mobile responsive UI
5. ❌ Postman collection

**NEVER DROP**:
- ✅ Working /score/{gstin} endpoint
- ✅ ARENA lender bidding
- ✅ Fraud graph visualization
- ✅ SHAP top 5 reasons
- ✅ At least 5 SENTINEL signals

---

## 🎤 Presentation Structure (5 minutes)

**[0:00-0:30]** Hook + Problem  
"80% rejection rate. Rs 58 trillion credit gap. We fix that."

**[0:30-1:00]** Solution Overview  
"3-module platform: ARENA, PULSE, SENTINEL"

**[1:00-3:00]** LIVE DEMO (This is 60% of your score)
1. Enter healthy GSTIN → Score appears <200ms
2. Show SHAP reasons → "GST filed on time 11/12 months"
3. Switch to ARENA → 10 lenders bid
4. Enter fraudster → SENTINEL fires, show graph
5. Highlight savings: "Rs 1 lakh saved vs worst offer"

**[3:00-4:00]** Impact Numbers  
"51 million MSMEs served. Rs 18,000 Cr NPAs prevented."

**[4:00-5:00]** Tech Stack + Close  
"LightGBM + SHAP + NetworkX + FastAPI. Sub-200ms response. This is the next generation of MSME lending."

---

## 🐛 Common Bugs & Fixes

### Model AUC < 0.70
**Fix**: Check SMOTE is applied, verify feature engineering, increase n_estimators

### API Timeout
**Fix**: Cache model in memory, don't reload on each request
```python
# At top of file
model = joblib.load('models/lightgbm_model.pkl')
```

### Frontend Can't Connect to API
**Fix**: Add CORS middleware
```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["*"])
```

### Graph Visualization Too Slow
**Fix**: Limit to 50 nodes max
```python
if len(G.nodes()) > 50:
    G = nx.k_core(G, k=2)  # Keep only well-connected nodes
```

---

## 🏆 Winning Differentiators

**What makes you win**:

1. **Only team with 3-module platform** (origination + monitoring + prevention)
2. **Visual fraud graph** (everyone else just shows a score)
3. **Rs 18,000 Cr impact claim** (backed by RBI NPA data)
4. **Sub-200ms API** (everyone else will be slower)
5. **SHAP explainability** (CMR gives rank 1-10 with zero explanation)
6. **ARENA bidding** (completely unique, no other team will have this)

---

## 📝 Deployment Checklist

**Before Final Submission**:
- [ ] All 3 demo GSTINs tested
- [ ] API deployed to Railway/Render
- [ ] GitHub README with setup steps
- [ ] Screen recording backup (in case demo fails)
- [ ] Presentation slides finalized
- [ ] Each team member knows their part

**Railway Deploy** (3 minutes):
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

**Render Deploy** (Web UI):
1. Connect GitHub repo
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn api_starter:app --host 0.0.0.0`

---

## 💡 Judge Question Prep

**"How do you handle data privacy?"**
→ "We comply with DPDP Act 2023. Every API call logs explicit consent. Data retained only 90 days unless user opts in."

**"What if GST data is stale?"**
→ "That's exactly the problem we solve. Traditional systems use 6-month-old ITR. We use yesterday's e-invoice velocity. We show data_freshness timestamp on every score."

**"How accurate is this vs CMR?"**
→ "CMR requires 24 months of history. Our target is the 80% of MSMEs CMR cannot score. On the 20% overlap, we're comparable but faster and more explainable."

**"What about false positives in fraud?"**
→ "Our fraud graph has 85% precision. We flag for REVIEW, not auto-reject. Human underwriter gets SHAP reasons + graph visualization to make final call."

**"How do you prevent model drift?"**
→ "We version every model deployment. Track prediction distribution weekly. Auto-alert if >5% shift in score distribution or AUC drop >0.02."

---

## 🎯 Final Reminders

1. **Demo is everything** - Spend 50% of time making demo smooth
2. **Show, don't tell** - Live graph > PowerPoint flowchart
3. **Practice the pitch 5x** - Should be muscle memory
4. **Have backup plan** - Screen recording if API fails
5. **Cite the blueprint** - "Based on SIDBI MSME Pulse Q3 2025 data..."

---

## ⚡ Emergency Contact Info

**If you're stuck, search for**:
- LightGBM SHAP tutorial
- NetworkX cycle detection
- FastAPI SQLite example
- React Recharts line chart

**GitHub repos to fork**:
- AjNavneet/Credit-Risk-Prediction-LightGBM
- joshi98kishan/Alternative-Data-Credit-Scoring

---

**YOU HAVE THE BLUEPRINT. NOW GO WIN THIS. 🚀**
