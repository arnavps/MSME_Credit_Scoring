# CredNexis Pitch Deck
## Insignia Hackathon 2026 | FT02 FinTech Track

---

## Slide 1: Title Slide

**CREDNEXIS**
### Real-Time Alternative Credit Intelligence for MSMEs

**The 64 Million MSME Opportunity**

*Insignia Hackathon 2026 | FT02 - FinTech Track*

---

## Slide 2: The Problem

### 80% Rejection Rate. ₹58 Trillion Credit Gap.

**Traditional CMR Scores Fail MSMEs:**
- Require 2-year tax returns
- Reject thin-file businesses  
- Ignore alternative data
- 51 million MSMEs underserved

**The Real Impact:**
A manufacturer with ₹40 lakh in live orders gets rejected because he has no historical ITR.

> "The current system was designed for large balance-sheet borrowers. We built ours for the 64 million MSMEs it was never designed to serve."

---

## Slide 3: The Solution

### CredNexis: 3-Module Credit Intelligence Platform

**Complete Loan Lifecycle Coverage:**

| Module | Function | Innovation |
|--------|----------|------------|
| **ARENA** | Live Lender Marketplace | Reverse auction - 10 lenders bid in 90s |
| **PULSE** | Real-Time Business Vitals | 6 vital signs continuous monitoring |
| **SENTINEL** | Pre-NPA Detection | 17 early warning signals, 5-150 day lead time |

**The Only Platform Covering:**
✓ Origination → Monitoring → Prevention

---

## Slide 4: ARENA - Live Lender Marketplace

### Democratizing Access to Credit

**Reverse Auction Model:**
- 10+ lenders compete in real-time
- Sorted by EMI cost
- Shows savings vs. worst offer
- Transparent interest rate discovery

**Lender Mix:**
- PSBs: SBI, SIDBI (9.5-10.5%)
- Private: HDFC Bank (11%)
- NBFCs: Lendingkart, Indifi (16-22%)

**Value Creation:** Borrowers save 3-8% through competitive bidding

---

## Slide 5: PULSE - Real-Time Business Vitals

### 6 Vital Signs Monitored Continuously

| Vital | Healthy Range | Data Source |
|-------|---------------|-------------|
| Revenue Pulse | 5-20 | GST Turnover |
| Compliance BP | 85-100% | Filing Timeliness |
| Cash Oxygen | 1.2-2.0 | UPI Velocity |
| Trade Temperature | 5-25 | E-Way Bills |
| Fraud ECG | 0-0.1 | Circular Detection |
| Growth Enzyme | 3-30 | MoM Growth |

**Color-Coded Health:** Green / Yellow / Red status indicators

---

## Slide 6: SENTINEL - Pre-NPA Detection

### 17 Signals. 5-150 Day Lead Time.

**Critical Alerts (0-5 days):**
- S05: Cheque/NACH Bounce Onset
- S06: Round-tripping Volume Surge
- S13: Circular Topology Detected
- S17: GST Registration Cancellation

**High Priority (10-20 days):**
- S04: Wage Payment Delays
- S08: Rapid Balance Depletion
- S12: Tax Notice Active

**Impact:** ₹18,000 Crore in NPAs preventable with 60-day advance warning

---

## Slide 7: Technical Architecture

### 5-Model Ensemble + Graph-Based Fraud Detection

**ML Stack:**
```
LightGBM (Primary) → XGBoost (Fraud) → CatBoost (Sector)
        ↓                    ↓                  ↓
   SHAP Explain      Isolation Forest      RF Anchor
```

**Fraud Detection:**
- NetworkX graph topology analysis
- Circular transaction detection
- 3-5 node cycle identification
- 50% score penalty on detection

**Performance:**
- AUC-ROC: >0.80
- API Response: <200ms
- SHAP Latency: <50ms

---

## Slide 8: Data Architecture

### Real-Time Streaming Layer

**Socket.io WebSocket Pipeline:**
- Port 5000: Real-time score updates
- 2-second freshness timestamp
- 4 data streams: UPI, POS, GST, E-WAY
- Kill-switch toggles for each stream

**Rolling 30-Point Score History:**
- Sparkline visualization
- Trend analysis (improving/declining/stable)
- Rolling average for AI advisory

**AI Advisory (Ollama):**
- Updates every 10 seconds
- Generates narrative from rolling avg
- Risk context + 30-day tactical roadmap

---

## Slide 9: The Demo - 3 GSTIN Profiles

### Live Dashboard Walkthrough

**Healthy MSME (27AAPFU0939F1ZV):**
- Score: 724 (CMR-3)
- All 6 vitals green
- ARENA: 8 lenders bidding

**Thin-File (09BCDGH1234E2ZW):**
- Score: 612 (CMR-5)
- Score capped at 680
- Advisory: Increase transaction volume

**Fraudster (29XYZAB5678C3ZT):**
- Score: 387 (CMR-9)
- Circular flag triggered
- SENTINEL: Critical alerts firing

---

## Slide 10: Market Impact

### Quantified Value Proposition

**For Lenders:**
- 85% fraud detection precision
- Sub-200ms credit decisions
- 17 early warning signals
- ₹18,000 Cr NPA prevention potential

**For MSMEs:**
- 51 million underserved businesses
- Alternative to CMR rejection
- Transparent rate discovery
- Real-time credit monitoring

**For Ecosystem:**
- ₹58T credit gap reduction
- Financial inclusion acceleration
- Data-driven lending standards

---

## Slide 11: Competitive Advantage

### Why CredNexis Wins

| Feature | Traditional | CredNexis |
|---------|-------------|-----------|
| Data Sources | ITR Only | GST + UPI + E-Way |
| Decision Time | Days | <200ms |
| Explainability | Black Box | SHAP Top-5 |
| Fraud Detection | Rule-Based | Graph + ML |
| Lifecycle | Origination Only | Orig → Monitor → Prevent |
| Lender Matching | Manual | Live Auction |

**Only platform with complete loan lifecycle coverage**

---

## Slide 12: Roadmap & Vision

### From Hackathon to Production

**Phase 1 (Complete):**
✓ 5-Model ensemble
✓ Real-time streaming
✓ 3-module dashboard
✓ Socket.io pipeline

**Phase 2 (Next 3 Months):**
- Live GST API integration
- 50+ lender marketplace
- Mobile app launch
- Regional language support

**Phase 3 (6-12 Months):**
- RBI sandbox approval
- Pan-India rollout
- Export to SE Asia
- Credit bureau partnership

---

## Slide 13: The Ask

### What We Need

**Technical:**
- GPU infrastructure for model training
- Production-grade hosting
- Security audit & compliance

**Business:**
- Introductions to NBFCs & banks
- GST API access (sandbox)
- UPI data partnerships

**Support:**
- Mentorship from fintech veterans
- Investor intros for seed round
- Regulatory guidance

---

## Slide 14: Closing

### Next Generation MSME Lending

**Built by:** Team CredNexis
**Stack:** LightGBM + SHAP + NetworkX + FastAPI + React
**Status:** Live Demo Ready

> "We don't just approve loans. We monitor them, forecast them, and prevent them from going bad. This is what the next generation of MSME lending looks like."

**Thank You.**

**Demo:** http://localhost:5173
**Code:** github.com/arnavps/MSME_Credit_Scoring

---

## Appendix: Technical Specs

**API Endpoints:**
- GET /score/{gstin} - Credit score + SHAP
- GET /arena/{gstin} - Lender bids
- GET /pulse/{gstin} - Business vitals
- GET /sentinel/{gstin} - Early warnings
- WS :5000 - Real-time streaming

**Model Performance:**
- LightGBM: 500 estimators
- SMOTE balancing
- 10-fold cross validation
- AUC-ROC: 0.82

**Infrastructure:**
- FastAPI + Uvicorn
- Socket.io WebSocket
- React + Vite + Tailwind
- SQLite → PostgreSQL migration ready
