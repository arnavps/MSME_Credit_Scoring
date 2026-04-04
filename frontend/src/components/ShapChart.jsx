import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const ShapChart = ({ shap }) => {
  if (!shap || !shap.reasons) return null;

  // Transform reasons into data objects for chart
  // In a real flow, we'd have exact SHAP values. 
  // For demo alignment, we map the reason sentiment to a dummy value range.
  const data = shap.reasons.map((reason, index) => ({
    feature: reason.split('(')[0].trim(),
    value: reason.includes('+') ? (20 - index * 3) : -(15 + index * 2)
  })).slice(0, 5);

  return (
    <div className="w-full h-[220px]">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
        Model Drivers // SHAP Waterfall
      </h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <XAxis type="number" domain={[-25, 25]} hide />
          <YAxis 
            type="category" 
            dataKey="feature" 
            width={120}
            fontSize={10}
            fontWeight="bold"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.02)' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
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
