import React from 'react';

const TopReasons = ({ reasons }) => {
  if (!reasons) return null;

  const { positive = [], negative = [] } = reasons;
  
  // Combine and sort (negatives first for risk awareness, or just sequential)
  // For the demo "split" look, we combine them into a single top 5 list
  const combined = [...negative.map(r => ({ text: r, type: 'neg' })), ...positive.map(r => ({ text: r, type: 'pos' }))].slice(0, 5);

  return (
    <div className="w-full">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
        Top 5 Reasons for this Score
      </h3>
      
      <div className="space-y-4">
        {combined.map((reason, idx) => (
          <div key={idx} className="flex items-start gap-3 group">
            <span className="text-sm font-black text-slate-300 w-4">
              {idx + 1}.
            </span>
            <p className="text-sm font-bold text-slate-700 leading-tight">
              {reason.text} 
              <span className={`ml-2 font-black ${reason.type === 'pos' ? 'text-emerald-500' : 'text-rose-500'}`}>
                ({reason.type === 'pos' ? '+' : '-'})
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopReasons;
