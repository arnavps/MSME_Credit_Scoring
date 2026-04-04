import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp,
  Shield,
  Users,
  Bell,
  Settings,
  LogOut,
  CreditCard,
  Activity,
  PieChart,
  MoreHorizontal
} from 'lucide-react';

// Royal Blue Accent Color
const ROYAL_BLUE = '#4338CA';

// Glassmorphism Card Component
const GlassCard = ({ children, className = '', style = {} }) => (
  <div 
    className={`bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] ${className}`}
    style={{
      borderRadius: '16px',
      padding: '24px',
      ...style
    }}
  >
    {children}
  </div>
);

// Slim Sidebar Component
const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Wallet, label: 'Wallet', active: false },
    { icon: Activity, label: 'Analytics', active: false },
    { icon: Shield, label: 'Security', active: false },
    { icon: Users, label: 'Team', active: false },
  ];

  return (
    <aside className="w-20 h-screen bg-white/50 backdrop-blur-md border-r border-white/60 flex flex-col items-center py-8 fixed left-0 top-0 z-50">
      {/* Logo */}
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-10"
        style={{ backgroundColor: ROYAL_BLUE }}
      >
        <span className="text-white font-black text-lg">C</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-6">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className={`p-3 rounded-xl transition-all duration-300 ${
              item.active 
                ? 'bg-white shadow-md' 
                : 'hover:bg-white/50'
            }`}
          >
            <item.icon 
              size={20} 
              strokeWidth={1.5}
              color={item.active ? ROYAL_BLUE : '#94A3B8'} 
            />
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-4">
        <button className="p-3 rounded-xl hover:bg-white/50 transition-all">
          <Settings size={20} strokeWidth={1.5} color="#94A3B8" />
        </button>
        <button className="p-3 rounded-xl hover:bg-red-50 transition-all">
          <LogOut size={20} strokeWidth={1.5} color="#EF4444" />
        </button>
      </div>
    </aside>
  );
};

// Total Balance Card
const TotalBalanceCard = () => (
  <GlassCard className="h-full flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-slate-500">Total Balance</span>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <MoreHorizontal size={18} color="#94A3B8" />
        </button>
      </div>
      
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-slate-400">₹</span>
        <span className="text-5xl font-black text-slate-800 tracking-tight">
          2,45,800
        </span>
        <span className="text-2xl font-semibold text-slate-400">.00</span>
      </div>

      {/* Trend Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full mb-8">
        <TrendingUp size={14} color="#10B981" />
        <span className="text-sm font-semibold text-emerald-600">+12.5%</span>
        <span className="text-xs text-emerald-400">vs last month</span>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-4">
      <button 
        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{ backgroundColor: ROYAL_BLUE }}
      >
        <ArrowUpRight size={18} strokeWidth={2} />
        <span>Transfer</span>
      </button>
      <button className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">
        <ArrowDownLeft size={18} strokeWidth={2} />
        <span>Request</span>
      </button>
    </div>
  </GlassCard>
);

// Credit Score Gauge
const CreditScoreGauge = () => {
  const score = 742;
  const maxScore = 900;
  const percentage = (score / maxScore) * 100;
  
  return (
    <GlassCard className="h-full flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-slate-500">Credit Score</span>
        <span 
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: `${ROYAL_BLUE}15`, color: ROYAL_BLUE }}
        >
          Low Risk
        </span>
      </div>

      {/* Radial Gauge */}
      <div className="relative w-48 h-48 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Arc */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Gradient Arc */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor={ROYAL_BLUE} />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 2.64} 264`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-800">{score}</span>
          <span className="text-xs text-slate-400 font-medium">of {maxScore}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: ROYAL_BLUE }}
        />
        <span className="text-sm text-slate-500">Excellent standing</span>
      </div>
    </GlassCard>
  );
};

// Transaction List Card
const RecentTransactions = () => {
  const transactions = [
    { name: 'GST Filing', amount: '-₹12,500', type: 'debit', date: 'Today, 2:30 PM' },
    { name: 'UPI Payment', amount: '+₹45,000', type: 'credit', date: 'Today, 11:20 AM' },
    { name: 'E-Way Bill', amount: '-₹3,200', type: 'debit', date: 'Yesterday' },
    { name: 'Loan EMI', amount: '-₹28,000', type: 'debit', date: 'Yesterday' },
  ];

  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-slate-500">Recent Transactions</span>
        <button 
          className="text-sm font-semibold hover:underline"
          style={{ color: ROYAL_BLUE }}
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((tx, idx) => (
          <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                tx.type === 'credit' ? 'bg-emerald-50' : 'bg-red-50'
              }`}>
                {tx.type === 'credit' ? (
                  <ArrowDownLeft size={18} color="#10B981" />
                ) : (
                  <ArrowUpRight size={18} color="#EF4444" />
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{tx.name}</p>
                <p className="text-xs text-slate-400">{tx.date}</p>
              </div>
            </div>
            <span className={`font-semibold ${
              tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-700'
            }`}>
              {tx.amount}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// Quick Stats Card
const QuickStats = () => {
  const stats = [
    { label: 'Active Loans', value: '3', icon: CreditCard, color: ROYAL_BLUE },
    { label: 'Credit Utilization', value: '32%', icon: PieChart, color: '#10B981' },
    { label: 'Pending Dues', value: '₹45K', icon: Bell, color: '#F59E0B' },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <GlassCard key={idx} className="!p-5">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon size={18} color={stat.color} strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</p>
          <p className="text-xs text-slate-500">{stat.label}</p>
        </GlassCard>
      ))}
    </div>
  );
};

// Main Dashboard
const BentoGridDashboard = () => {
  return (
    <div 
      className="min-h-screen flex"
      style={{
        background: 'linear-gradient(135deg, #FAFAFA 0%, #F1F5F9 50%, #E2E8F0 100%)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}
    >
      <Sidebar />
      
      <main className="flex-1 ml-20 p-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-800 mb-2">
            Good morning, <span style={{ color: ROYAL_BLUE }}>CredNexis</span>
          </h1>
          <p className="text-base text-slate-500 font-light">
            Here's your financial overview for today
          </p>
        </header>

        {/* Quick Stats Row */}
        <div className="mb-8">
          <QuickStats />
        </div>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Total Balance - Large Card */}
          <div className="col-span-5 row-span-2">
            <TotalBalanceCard />
          </div>

          {/* Credit Score */}
          <div className="col-span-4">
            <CreditScoreGauge />
          </div>

          {/* Mini Stats */}
          <div className="col-span-3 space-y-6">
            <GlassCard className="!p-5 text-center">
              <p className="text-3xl font-bold text-slate-800 mb-1">842</p>
              <p className="text-xs text-slate-500">CMR Ranking</p>
            </GlassCard>
            <GlassCard className="!p-5 text-center">
              <p className="text-3xl font-bold text-emerald-600 mb-1">98%</p>
              <p className="text-xs text-slate-500">Compliance</p>
            </GlassCard>
          </div>

          {/* Recent Transactions */}
          <div className="col-span-7">
            <RecentTransactions />
          </div>

          {/* Risk Alert Card */}
          <div className="col-span-5">
            <GlassCard className="h-full" style={{ backgroundColor: 'rgba(254, 242, 242, 0.7)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Shield size={24} color="#EF4444" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">Risk Alert</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Circular transaction pattern detected in GST network. 
                    Review pending transactions for vendor XYZ Enterprises.
                  </p>
                  <button 
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ backgroundColor: '#EF4444' }}
                  >
                    Investigate
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BentoGridDashboard;
