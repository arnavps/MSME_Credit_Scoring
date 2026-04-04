import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const ShapChart = ({ shap }) => {
  // If we have a dict of shap values, transform it
  let chartData = [];
  
  if (shap && typeof shap === 'object' && !Array.isArray(shap)) {
    chartData = Object.entries(shap)
      .map(([feature, value]) => ({
        feature: feature.replace(/_/g, ' ').toUpperCase(),
        value: parseFloat(value)
      }))
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, 5);
  } else if (shap?.reasons) {
    // Fallback for legacy format
    chartData = shap.reasons.map((reason, index) => ({
      feature: reason.split('(')[0].trim(),
      value: reason.includes('+') ? (20 - index * 3) : -(15 + index * 2)
    })).slice(0, 5);
  }

  if (chartData.length === 0) return null;

  return (
    <div className="w-full h-[220px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Model Drivers // SHAP Waterfall
        </h3>
        <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full">
          LIVE TELEMETRY
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
        >
          <XAxis type="number" domain={['dataMin - 1', 'dataMax + 1']} hide />
          <YAxis 
            type="category" 
            dataKey="feature" 
            width={100}
            fontSize={9}
            fontWeight="bold"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8' }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            contentStyle={{ 
              backgroundColor: '#1a1a1a', 
              borderRadius: '8px', 
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '10px'
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.value >= 0 ? '#10b981' : '#ef4444'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ShapChart;
