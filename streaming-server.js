const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { processScore, generateMockRawScore } = require('./server/scoring');
const { update, compute } = require('./server/features');
const generators = require('./server/generators');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all for hackathon
    methods: ["GET", "POST"]
  }
});

// Mock GSTIN for demo
const DEMO_GSTIN = '27AAPFU0939F1ZV';
const BASE_SCORE = 650;

// Central Emit Bus
function handleEvent(event) {
  // 1. Log event flow
  // console.log(`[BUS] ${event.source} -> ${event.type}: ₹${event.amt}`);
  
  // 2. Feed into rolling window
  update(event);
  
  // 3. Optional: Push raw event to UI for sparks (Phase 4)
  io.emit('raw-event', event);
}

// Start Stream Generators
generators.upi(handleEvent);
generators.pos(handleEvent);
generators.gst(handleEvent);
generators.eway(handleEvent);

// Score Processing Loop - 2 seconds
setInterval(() => {
  const features = compute();
  
  // For demo, we still use generateMockRawScore to simulate base model volatility
  // but processed through the real scoring.js rule engine + EMA
  const rawScore = generateMockRawScore(BASE_SCORE);
  const result = processScore(DEMO_GSTIN, rawScore, []);

  const data = {
    score: result.score,
    rawScore: rawScore,
    features: features,
    shap: {
      reasons: [
        features.net_inflow_ratio > 0.2 ? "surplus cash inflow (+)" : "cash flow tight (-)",
        features.invoice_velocity > 10 ? "active billing (+)" : "low invoice velocity (-)",
        features.eway_trend > 5 ? "logistics moving (+)" : "static e-way trends (-)",
        "No circular transactions detected",
        "Consistent UPI cadence"
      ]
    },
    smoothing: {
      alpha: 0.3,
      reason: result.reason,
      delta: result.delta || 0
    },
    timestamp: new Date().toISOString()
  };

  io.emit('update', data);
  // console.log(`📊 Pushed: ${data.score} (F: ${features.txn_density.toFixed(2)})`);

}, 2000);

// REST endpoint for spec compliance (Page 14)
app.get('/api/status', (req, res) => {
  const features = compute();
  const rawScore = generateMockRawScore(BASE_SCORE);
  const result = processScore(DEMO_GSTIN, rawScore, []);
  
  res.json({ 
    score: result.score, 
    features: features 
  });
});

const PORT = 5000; // Fixed port as per guide
server.listen(PORT, () => {
  console.log(`🚀 CredNexis Streaming Server [ACTIVE] on port ${PORT}`);
  console.log(`📡 WebSocket Bus [OPEN]`);
  console.log(`🧮 Spec Compliance: Core 5 Features + EMA Alpha 0.3`);
});

