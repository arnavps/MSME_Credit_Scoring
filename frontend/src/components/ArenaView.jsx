import React, { useState, useEffect, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Gavel, Clock, TrendingDown, Users, Building2, Landmark, Briefcase, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

// Mock lender data
const mockLenders = [
  { id: 'sbi', name: 'State Bank of India', type: 'PSB', baseRate: 10.5, maxAmount: 5000000, minScore: 650, icon: Landmark },
  { id: 'sidbi', name: 'SIDBI', type: 'DFI', baseRate: 9.5, maxAmount: 3000000, minScore: 600, icon: Building2 },
  { id: 'hdfc', name: 'HDFC Bank', type: 'Private', baseRate: 11.0, maxAmount: 2500000, minScore: 700, icon: Building2 },
  { id: 'lendingkart', name: 'Lendingkart', type: 'NBFC', baseRate: 18.0, maxAmount: 2000000, minScore: 580, icon: Briefcase },
  { id: 'indifi', name: 'Indifi', type: 'NBFC', baseRate: 20.0, maxAmount: 1500000, minScore: 560, icon: Briefcase },
  { id: 'ugro', name: 'Ugro Capital', type: 'NBFC', baseRate: 16.0, maxAmount: 2500000, minScore: 600, icon: Briefcase },
  { id: 'flexi', name: 'FlexiLoans', type: 'NBFC', baseRate: 22.0, maxAmount: 1000000, minScore: 550, icon: Briefcase },
  { id: 'capfloat', name: 'Capital Float', type: 'NBFC', baseRate: 17.0, maxAmount: 1800000, minScore: 620, icon: Briefcase },
];

function ArenaView() {
  const { data } = useDashboard();
  const [tenure, setTenure] = useState(18);
  const [timeLeft, setTimeLeft] = useState(90);
  const [bids, setBids] = useState([]);

  const creditScore = data?.credit_score || 650;
  
  const eligibleLenders = useMemo(() => 
    mockLenders.filter(l => creditScore >= l.minScore),
  [creditScore]);


  // Simulate live bidding - STATIC (no countdown timer)
  useEffect(() => {
    const generateBids = () => {
      return eligibleLenders.map(lender => {
        const rateAdjustment = (creditScore - 600) * -0.02; // Better score = lower rate
        const finalRate = Math.max(lender.baseRate + rateAdjustment, lender.baseRate - 2);
        const amount = Math.min(lender.maxAmount, Math.floor(creditScore * 3500));

        // Calculate EMI
        const monthlyRate = finalRate / 12 / 100;
        const emi = Math.floor(
          amount * monthlyRate * Math.pow(1 + monthlyRate, tenure) /
          (Math.pow(1 + monthlyRate, tenure) - 1)
        );

        return {
          ...lender,
          finalRate: parseFloat(finalRate.toFixed(2)),
          offeredAmount: amount,
          emi: emi,
          processingFee: Math.floor(amount * 0.02),
          disbursalDays: (creditScore % 5) + 3 // Deterministic disbursal
        };
      }).sort((a, b) => a.emi - b.emi);
    };

    setBids(generateBids());
    // No interval - static data only
  }, [creditScore, tenure, eligibleLenders]);

  const formatTime = () => "1:30"; // Completely static timer


  const bestBid = bids[0];
  const worstBid = bids[bids.length - 1];
  const totalSavings = worstBid ? (worstBid.emi - bestBid.emi) * tenure : 0;

  const lenderTypeColors = {
    'PSB': 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    'DFI': 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    'Private': 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    'NBFC': 'text-amber-400 border-amber-500/30 bg-amber-500/10'
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Gavel className="text-primary" size={28} />
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter">ARENA // Live Lender Marketplace</h1>
        </div>
        <p className="text-slate-500 text-sm">Real-time reverse auction. {eligibleLenders.length} lenders competing for your business.</p>
      </div>

      {/* Main Dark Card */}
      <div className="bg-slate-900 rounded-3xl p-8 mb-6 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Principal & Tenure */}
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Final Calibrated Principal
              </div>
              <div className="text-4xl font-black text-emerald-400">
                ₹{(bestBid?.offeredAmount || 0).toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Based on CIBIL: {creditScore} • CMR: {data?.cmr_equivalent || '4'}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                Tenure Option
              </div>
              <input
                type="range"
                min="12"
                max="36"
                step="6"
                value={tenure}
                onChange={(e) => setTenure(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>12 mo</span>
                <span className="text-emerald-400 font-bold">{tenure} mo</span>
                <span>36 mo</span>
              </div>
            </div>

            {/* Auction Timer */}
            <div className="bg-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Clock className="text-red-400" size={24} />
                <div>
                  <div className="text-2xl font-black text-red-400">{formatTime(timeLeft)}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Auction Closing</div>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Best Offer */}
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl p-6 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="text-emerald-400" size={20} />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Best Offer</span>
            </div>

            {bestBid ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <bestBid.icon className="text-emerald-400" size={32} />
                  <div>
                    <div className="text-lg font-bold">{bestBid.name}</div>
                    <div className={`text-[10px] px-2 py-0.5 rounded inline-block ${lenderTypeColors[bestBid.type]}`}>
                      {bestBid.type}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-emerald-500/20">
                  <div>
                    <div className="text-xs text-slate-400">Interest Rate</div>
                    <div className="text-2xl font-black text-white">{bestBid.finalRate}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Monthly EMI</div>
                    <div className="text-2xl font-black text-emerald-400">₹{bestBid.emi.toLocaleString()}</div>
                  </div>
                </div>

                <div className="text-xs text-emerald-400/80">
                  Disbursal: {bestBid.disbursalDays} days • Processing: ₹{bestBid.processingFee.toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-sm">No eligible lenders for current score</div>
            )}
          </div>

          {/* Right: Savings Comparison */}
          <div className="space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Savings vs Worst Offer
            </div>

            {bestBid && worstBid && (
              <>
                <div className="text-4xl font-black text-emerald-400">
                  ₹{totalSavings.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">
                  Total savings over {tenure} months
                </div>

                <div className="bg-slate-800 rounded-xl p-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="text-emerald-400" size={16} />
                    <span className="text-xs font-bold text-slate-400">Rate Comparison</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-400">{bestBid.name}</span>
                      <span className="font-bold">{bestBid.finalRate}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">{worstBid.name}</span>
                      <span className="text-slate-400">{worstBid.finalRate}%</span>
                    </div>
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Live Bidding Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-slate-400" size={18} />
            <span className="text-sm font-bold text-slate-800">Live Bids</span>
            <span className="text-xs text-slate-500">({bids.length} active)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-emerald-600 font-semibold">Live</span>
          </div>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Rank</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Lender</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Type</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">Rate</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">EMI</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">Amount</th>
                <th className="px-6 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {bids.map((bid, index) => (
                <tr key={bid.id} className={index === 0 ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {index === 0 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold">
                        1
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm">{index + 1}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <bid.icon size={16} className={index === 0 ? 'text-emerald-500' : 'text-slate-400'} />
                      <span className={`text-sm font-semibold ${index === 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                        {bid.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-[10px] px-2 py-1 rounded border ${lenderTypeColors[bid.type]}`}>
                      {bid.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-bold ${index === 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {bid.finalRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-bold ${index === 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                      ₹{bid.emi.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600">
                    ₹{bid.offeredAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${index === 0
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}>
                      {index === 0 ? 'Accept' : 'Select'}
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bids.length === 0 && (
          <div className="px-6 py-12 text-center">
            <AlertCircle className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="text-slate-500 font-medium">No eligible lenders for current credit profile</p>
            <p className="text-xs text-slate-400 mt-1">Improve your score to unlock more options</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArenaView;
