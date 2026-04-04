import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const PulseGauge = ({ score, cmr, riskBand }) => {
  // Score mapping for gauge (300-900)
  const normalizedScore = ((score - 300) / 600) * 100;
  const data = [
    { value: normalizedScore },
    { value: 100 - normalizedScore }
  ];

  const getColor = (band) => {
    if (band?.toLowerCase().includes('low')) return '#10b981';
    if (band?.toLowerCase().includes('high')) return '#ef4444';
    return '#f59e0b';
  };

  const color = getColor(riskBand);

  return (
    <div className="relative w-full h-[300px] flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="70%"
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={110}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#e2e8f0" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col gap-0">
        <span className="text-5xl font-bold text-slate-900 leading-tight tracking-tighter">
          {score}
        </span>
        <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          Credit Score
        </span>
        <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold inline-block mx-auto shadow-lg">
          {cmr} • {riskBand}
        </div>
      </div>

      {/* Decorative Glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 blur-[80px] opacity-20 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

export default PulseGauge;
