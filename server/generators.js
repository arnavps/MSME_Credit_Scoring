/**
 * CredNexis Stream Generators
 * Implements business-hour peak patterns (9 AM - 8 PM)
 */

function getPeakMultiplier() {
  const hour = new Date().getHours();
  // Peak activity between 9 AM and 8 PM (20:00)
  return (hour >= 9 && hour <= 20) ? 2.0 : 0.5;
}

const generators = {
  upi: (emit) => {
    setInterval(() => {
      const pm = getPeakMultiplier();
      const n = Math.ceil(Math.random() * 3 * pm);
      for (let i = 0; i < n; i++) {
        emit({
          type: 'txn',
          source: 'upi',
          dir: Math.random() > 0.3 ? 'in' : 'out',
          amt: 200 + Math.random() * 4800,
          ts: Date.now()
        });
      }
    }, 1500);
  },

  pos: (emit) => {
    setInterval(() => {
      const pm = getPeakMultiplier();
      if (Math.random() > (0.6 / pm)) {
        emit({
          type: 'txn',
          source: 'pos',
          dir: 'in',
          amt: 500 + Math.random() * 9500,
          ts: Date.now()
        });
      }
    }, 2500);
  },

  gst: (emit) => {
    setInterval(() => {
      const pm = getPeakMultiplier();
      const n = Math.floor(Math.random() * 5 * pm); 
      for (let i = 0; i < n; i++) {
        emit({
          type: 'invoice',
          source: 'gst',
          dir: 'in',
          amt: 1000 + Math.random() * 20000,
          ts: Date.now(),
          invoice_id: Math.floor(Math.random() * 999999),
          filing_status: Math.random() > 0.1 ? 'FILED' : 'PENDING'
        });
      }
    }, 5000);
  },

  eway: (emit) => {
    setInterval(() => {
      const pm = getPeakMultiplier();
      if (Math.random() > (0.7 / pm)) {
        emit({
          type: 'eway',
          source: 'eway',
          dir: 'out',
          amt: 5000 + Math.random() * 50000,
          ts: Date.now(),
          eway_id: Math.floor(Math.random() * 999999999)
        });
      }
    }, 10000);
  }
};

module.exports = generators;
