import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ScoreTrend = () => {
  const { scoreHistory, data } = useDashboard();

  // Calculate trend direction
  const getTrend = () => {
    if (scoreHistory.length < 2) return 'stable';
    const first = scoreHistory[0].score;
    const last = scoreHistory[scoreHistory.length - 1].score;
    if (last > first + 5) return 'up';
    if (last < first - 5) return 'down';
    return 'stable';
  };

  const trend = getTrend();
  const currentScore = data?.credit_score || 0;
  
  // Prepare chart data
  const chartData = scoreHistory.map((item, index) => ({
    index,
    score: item.score,
    timestamp: item.timestamp
  }));

  // Get gradient color based on score range
  const getScoreColor = (score) => {
    if (score >= 750) return '#10b981'; // emerald-500
    if (score >= 650) return '#3b82f6'; // blue-500
    if (score >= 550) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const strokeColor = getScoreColor(currentScore);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400';

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Live Pulse
          </span>
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon size={12} />
            <span className="text-[10px] font-semibold capitalize">{trend}</span>
          </div>
        </div>
        <span className="text-[10px] text-slate-500">
          {scoreHistory.length} / 30 points
        </span>
      </div>

      {/* Sparkline Chart */}
      <div className="h-16 w-full">
        {scoreHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis 
                domain={['dataMin - 10', 'dataMax + 10']} 
                hide 
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px]">
                        <span className="text-slate-300">Score: </span>
                        <span className="font-bold" style={{ color: strokeColor }}>
                          {payload[0].value}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke={strokeColor}
                strokeWidth={2}
                fill="url(#scoreGradient)"
                animationDuration={500}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-[10px]">
            Waiting for streaming data...
          </div>
        )}
      </div>

      {/* Stats */}
      {scoreHistory.length > 0 && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
          <div className="flex gap-3">
            <div>
              <span className="text-[9px] text-slate-500 uppercase">Min</span>
              <p className="text-[11px] font-semibold text-slate-300">
                {Math.min(...scoreHistory.map(h => h.score))}
              </p>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase">Avg</span>
              <p className="text-[11px] font-semibold text-slate-300">
                {Math.round(scoreHistory.reduce((a, b) => a + b.score, 0) / scoreHistory.length)}
              </p>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase">Max</span>
              <p className="text-[11px] font-semibold text-slate-300">
                {Math.max(...scoreHistory.map(h => h.score))}
              </p>
            </div>
          </div>
          
          {/* Live indicator */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-medium text-emerald-400 uppercase">Live</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreTrend;
