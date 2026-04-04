# CredNexis Presentation Script
## Insignia Hackathon 2026 | 5-Minute Demo + Pitch

---

## [0:00-0:30] HOOK: The 80% Problem

**[SLIDE 2: The Problem]**

"80% rejection rate. ₹58 trillion credit gap."

*Pause. Let the numbers sink in.*

"The current system was designed for large balance-sheet borrowers. We built ours for the 64 million MSMEs it was never designed to serve."

"Here's what that looks like: A manufacturer in Nagpur has ₹40 lakh in live purchase orders. He's been in business 18 months, filing GST regularly, with clean UPI transactions. Traditional CMR rejects him because he has no 2-year-old tax return."

"We fix that."

---

## [0:30-1:00] SOLUTION: The 3-Module Platform

**[SLIDE 3: The Solution]**

"CredNexis is a three-module credit intelligence platform that covers the complete loan lifecycle."

"ARENA for origination - a live lender marketplace where 10+ banks and NBFCs bid for each MSME in 90 seconds."

"PULSE for monitoring - 6 real-time business vitals using GST, UPI, and e-way bill data."

"SENTINEL for prevention - 17 early warning signals that detect NPAs 5 to 150 days in advance."

"We're the only team addressing origination, monitoring, AND prevention."

---

## [1:00-2:30] LIVE DEMO: Dashboard Walkthrough

**Transition:** "Let me show you this in action."

*[Switch to browser - localhost:5173]*

### [1:00-1:30] Healthy MSME Profile

**[Navigate to Dashboard - Enter GSTIN: 27AAPFU0939F1ZV]**

"First, a healthy grower in Maharashtra."

*[Wait for score to load - should be <200ms]*

"Score: 724, CMR-3 equivalent. Generated in under 200 milliseconds."

"Notice the SHAP explainability - top 5 reasons in plain English. 'GST filed on time 11/12 months. UPI inflow grew 22% last quarter.'"

*[Point to PULSE section]*

"All 6 vitals are green. Revenue pulse at 15.2, compliance at 92%, cash oxygen at 1.35."

*[Scroll to ARENA]*

"In ARENA, 8 lenders are currently bidding. SBI at 10.5%, SIDBI at 9.5%, HDFC at 11%. The borrower can see exactly how much they'll save versus the worst offer."

### [1:30-2:00] Thin-File Profile

**[Navigate to new GSTIN: 09BCDGH1234E2ZW]**

"Now a thin-file newcomer - 8 months old, limited history."

"Traditional CMR would reject outright. Our model scores 612 - CMR-5, medium risk."

*[Point to SHAP panel]*

"Notice the advisory: 'Score capped at 680 due to thin-file status. Add 3 more UPI buyers to improve.'"

"We're not just rejecting - we're giving a roadmap to creditworthiness."

### [2:00-2:30] Fraud Detection

**[Navigate to fraudster: 29XYZAB5678C3ZT]**

"Finally, a fraudster with circular transactions."

*[Wait for alerts to fire]*

"Score: 387. CMR-9. But here's what's important..."

*[Click to SENTINEL section or /dashboard/sentinel]*

"SENTINEL immediately flags S13 - Circular Topology Detected. S05 - Cheque bounce onset."

*[Navigate to /dashboard/network]*

"In the Network view, you can see the actual 3-node circular loop. Red edges show the ₹4.3 lakh moving in circles. This isn't just a score - it's visual evidence."

---

## [2:30-3:30] TECHNICAL DEPTH: The Stack

**[SLIDE 7: Technical Architecture]**

"Under the hood, we're running a 5-model ensemble."

"LightGBM for primary scoring. XGBoost for fraud detection. CatBoost for sector calibration. Isolation Forest for anomaly detection. Random Forest as a baseline anchor."

"SHAP explainability on every decision - not black box AI."

*[Pause]*

"For fraud, we use NetworkX graph analysis. We build a transaction graph - nodes are GSTINs, edges are UPI flows. Then we detect 3-5 node cycles."

"The fraudster we just saw? The system identified his circular pattern and applied a 50% score penalty automatically."

**[SLIDE 8: Data Architecture]**

"Real-time streaming via Socket.io. Every 2 seconds, fresh data."

"4 kill-switchable streams: UPI, POS, GST, E-way. Toggle any off, the velocity bars drop to zero instantly."

"AI advisory updates every 10 seconds based on rolling averages."

---

## [3:30-4:15] MARKET IMPACT: The Numbers

**[SLIDE 10: Market Impact]**

"Let's talk impact."

"For lenders: 85% fraud detection precision. Sub-200ms decisions. 17 early warning signals."

*[Emphasize]*

"If SENTINEL had been deployed last year, ₹18,000 crore in NPAs could have been prevented. With 60-day advance warning."

"For MSMEs: 51 million underserved businesses finally have a path to credit. Alternative to the CMR rejection cycle."

"For the ecosystem: We're addressing the ₹58 trillion credit gap with data-driven lending."

---

## [4:15-4:45] COMPETITIVE MOAT

**[SLIDE 11: Competitive Advantage]**

"Why us?"

*[Point to table]*

"Traditional scoring: ITR only, days to decide, black box, manual fraud checks, origination only."

"CredNexis: GST + UPI + E-way, 200ms response, SHAP explainable, graph-based fraud, full lifecycle."

"Six differentiators: 5-model ensemble, fraud graph visualization, complete lifecycle, SHAP on every decision, sub-200ms API, 17-signal EWS."

"No other team at this hackathon has all six."

---

## [4:45-5:00] CLOSE: The Vision

**[SLIDE 14: Closing]**

"We don't just approve loans. We monitor them, forecast them, and prevent them from going bad."

*[Pause for effect]*

"This is what the next generation of MSME lending looks like."

"Built on LightGBM with SHAP explainability. NetworkX fraud detection. FastAPI for speed. React for the experience."

"Demo running at localhost. Code on GitHub. Questions?"

*[Open for Q&A]*

---

## BACKUP SLIDES (If Asked)

### Technical Questions:
- **SLIDE 7+8**: Architecture diagrams
- Show actual API response times in browser dev tools
- Show confusion matrix from model training

### Business Questions:
- **SLIDE 12**: Roadmap - RBI sandbox, 50+ lenders, mobile app
- **SLIDE 13**: The Ask - introductions to NBFCs, GST API access

### Demo Failure Backup:
- Pre-recorded screen recording on desktop
- Static screenshots in backup deck
- Architecture diagram walkthrough

---

## DELIVERY TIPS

1. **Eye Contact**: Look at judges, not screen, during hook and close
2. **Pacing**: Pause after big numbers (80%, ₹58T, ₹18,000 Cr)
3. **Gestures**: Point to dashboard sections during demo
4. **Energy**: Build excitement during fraud detection reveal
5. **Recovery**: If demo lags, immediately switch to backup screenshot

## KEY PHRASES TO HIT

- "80% rejection rate"
- "₹58 trillion credit gap"
- "64 million MSMEs"
- "Complete loan lifecycle"
- "Sub-200ms response"
- "₹18,000 crore NPA prevention"
- "Next generation of MSME lending"

## TIMING CHECKPOINTS

- [0:30] Should be on Solution slide
- [1:00] Should start demo (first GSTIN entered)
- [2:30] Should transition to Technical Architecture
- [3:30] Should start Market Impact
- [4:45] Should start Close
- [5:00] Done, open for Q&A
