# CredNexis — MSME Credit Intelligence Dashboard

A production-grade fintech dashboard for real-time MSME credit scoring, built with React + Vite + Tailwind CSS + Recharts + Framer Motion.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 + custom CSS variables |
| Charts | Recharts 2 |
| Animations | Framer Motion 11 |
| Icons | Lucide React |
| API | FastAPI (POST /score) |

---

## Project Structure

```
crednexis/
├── index.html
├── vite.config.js          # Vite + proxy config
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx             # Root layout + state orchestration
    ├── index.css           # Tailwind + global design tokens
    ├── components/
    │   ├── Navbar.jsx              # Top navigation bar
    │   ├── InputPanel.jsx          # GSTIN input + sample GSTINs
    │   ├── ScoreCard.jsx           # Animated circular score ring
    │   ├── LoanRecommendation.jsx  # Loan eligibility metrics
    │   ├── ExplainabilitySection.jsx # AI reasoning + feature importance chart
    │   ├── FraudAlert.jsx          # Fraud detection warning banner
    │   ├── ChartsSection.jsx       # UPI area chart + GST bar chart
    │   ├── EntityProfile.jsx       # Business entity details
    │   ├── EmptyState.jsx          # Landing/idle state
    │   ├── LoadingSkeleton.jsx     # Main content skeletons
    │   └── SidebarSkeleton.jsx     # Sidebar skeletons
    ├── pages/
    │   └── Dashboard.jsx           # Page-level layout (alternate entry)
    ├── hooks/
    │   └── useScore.js             # API call + loading state hook
    ├── services/
    │   └── api.js                  # fetchCreditScore() + getMockScore()
    └── utils/
        └── index.js                # formatCurrency, getBandConfig, etc.
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env

# Start dev server
npm run dev
```

The app runs at `http://localhost:5173`.

---

## API Integration

The dashboard calls `POST /score` on your FastAPI backend:

**Request:**
```json
{ "gstin": "27AABCU9603R1ZX" }
```

**Expected Response:**
```json
{
  "gstin": "27AABCU9603R1ZX",
  "entity": {
    "name": "M/S Urban Craft Private Limited",
    "type": "Private Limited",
    "state": "Maharashtra",
    "district": "Pune",
    "pan": "AABCU9603R",
    "vintage_years": 6,
    "employee_count": 42,
    "annual_turnover": 28500000,
    "sector": "Manufacturing",
    "last_filed": "2025-03-20",
    "gst_status": "Active"
  },
  "credit_score": 742,
  "risk_band": "LOW",
  "fraud_flag": false,
  "fraud_reasons": [],
  "loan_recommendation": {
    "eligible_amount": 4500000,
    "tenure_months": 36,
    "interest_rate": 10.5,
    "emi": 145000,
    "product_type": "Term Loan",
    "collateral_required": false
  },
  "explainability": {
    "reasons": [
      { "rank": 1, "factor": "GST Filing Regularity", "description": "...", "impact": "positive", "weight": 0.87 }
    ],
    "feature_importance": [
      { "feature": "GST Compliance", "importance": 0.87, "category": "compliance" }
    ]
  },
  "trends": {
    "upi": [{ "month": "Apr", "volume": 1.8, "count": 420 }],
    "gst": [{ "month": "Apr", "taxable": 24, "tax": 4.3 }]
  },
  "model_version": "crednexis-v2.4.1",
  "scored_at": "2025-04-03T10:30:00Z",
  "confidence": 88
}
```

### FastAPI Backend Example

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ScoreRequest(BaseModel):
    gstin: str

@app.post("/score")
async def score(req: ScoreRequest):
    # Your ML scoring logic here
    return { ... }
```

### Vite Proxy (dev)

`vite.config.js` proxies `/score` → `http://localhost:8000/score` automatically.

For production, set `VITE_API_URL=https://your-api.com` in `.env`.

---

## Mock Mode

When the FastAPI backend is unreachable, `api.js` automatically falls back to `getMockScore()` — a deterministic mock that generates realistic data from the GSTIN string. This means the UI is always demo-able without a backend.

Try these sample GSTINs in the UI:
- `27AABCU9603R1ZX` — Low Risk
- `07AADCB2230M1ZT` — Medium Risk  
- `29GGGGG1314R9Z6` — Triggers fraud alert

---

## Design System

The dashboard uses a dark-first design with CSS custom properties:

```css
--bg-900: #070b12      /* Page background */
--bg-800: #0a0f1e      /* Card background */
--bg-700: #0f1729      /* Input/nested bg */
--accent: #3b82f6      /* Primary blue */
--green:  #22c55e      /* Low risk / success */
--amber:  #f59e0b      /* Medium risk / warning */
--red:    #ef4444      /* High risk / danger */
--purple: #a78bfa      /* AI/model elements */
```

---

## Build for Production

```bash
npm run build
# Output in /dist — serve with nginx or any static host
```

---

## License

MIT — built for CredNexis MSME Credit Intelligence Platform.
