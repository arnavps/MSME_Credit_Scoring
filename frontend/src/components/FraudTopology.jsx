import React, { useEffect, useRef } from 'react';
import { Activity, ShieldAlert, Network, Share2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { cn } from '../lib/utils';

function FraudTopology() {
  const { data, loading } = useDashboard();
  const canvasRef = useRef(null);

  useEffect(() => {
    // Global Red Pulse logic
    if (data?.fraud?.is_circular) {
      document.body.classList.add('fraud-alert-active');
    } else {
      document.body.classList.remove('fraud-alert-active');
    }
  }, [data?.fraud?.is_circular]);

  useEffect(() => {
    if (data?.fraud?.path && canvasRef.current) {
      drawTopology(canvasRef.current, data.fraud.path);
    }
  }, [data?.fraud?.path]);

  if (loading) return (
    <div className="h-full bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center animate-pulse shadow-2xl">
       <Activity className="text-slate-700 mb-4" size={48} />
       <div className="h-4 w-32 bg-slate-800 rounded-full" />
    </div>
  );

  if (!data) return (
    <div className="h-full bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800/50 p-8 flex flex-col items-center justify-center border-dashed opacity-20 select-none">
       <Network className="text-slate-700 mb-4" size={64} />
       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Network Scorer Offline</p>
    </div>
  );

  const isCircular = data.fraud.is_circular;

  return (
    <div className={cn(
      "h-full rounded-[32px] p-8 flex flex-col shadow-2xl transition-all duration-700",
      isCircular ? "bg-red-950/20 border-2 border-red-500/50" : "bg-slate-900 border border-slate-800"
    )}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Atlas // Fraud Topology</span>
          <h3 className="text-xl font-black text-white tracking-tighter">Network Explorer</h3>
        </div>
        <div className={cn(
          "p-2 rounded-xl transition-colors",
          isCircular ? "bg-red-500/20 text-red-500" : "bg-slate-800 text-primary"
        )}>
           <ShieldAlert size={20} />
        </div>
      </div>

      <div className="flex-1 relative bg-black/20 rounded-2xl border border-white/5 overflow-hidden group">
        <canvas ref={canvasRef} className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" />
        
        {/* SVG Backup/Static Visualization */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="relative">
              {isCircular && (
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
              )}
              <Share2 size={48} className={isCircular ? "text-red-500" : "text-slate-700"} />
           </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between">
           <div className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Nodes Scanned: {data.fraud.path.length}</span>
           </div>
           {isCircular && (
             <div className="px-3 py-1 bg-red-500 text-white rounded-lg animate-bounce">
                <span className="text-[9px] font-black uppercase tracking-widest">CIRCULAR PATH DETECTED</span>
             </div>
           )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Circularity Ratio</span>
          <span className={cn(
            "text-xl font-black tabular-nums",
            isCircular ? "text-red-500" : "text-green-400"
          )}>
            {(data.fraud.ratio * 100).toFixed(2)}%
          </span>
        </div>
        <div className="text-right">
           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Network Health</span>
           <p className={cn(
             "text-xs font-bold",
             isCircular ? "text-red-400" : "text-green-500/80"
           )}>
             {isCircular ? "CRITICAL RISK" : "NOMINAL / SAFE"}
           </p>
        </div>
      </div>
    </div>
  );
}

function drawTopology(canvas, path) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, rect.width, rect.height);
  
  // Simple "Star" or "Circle" visualization of nodes
  const nodes = path.map((name, i) => {
    const angle = (i / path.length) * Math.PI * 2;
    const radius = Math.min(rect.width, rect.height) * 0.35;
    return {
      x: rect.width / 2 + Math.cos(angle) * radius,
      y: rect.height / 2 + Math.sin(angle) * radius,
      labels: name.substring(0, 4)
    };
  });

  // Draw lines
  ctx.strokeStyle = 'rgba(45, 91, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  nodes.forEach((node, i) => {
    const nextNode = nodes[(i + 1) % nodes.length];
    ctx.moveTo(node.x, node.y);
    ctx.lineTo(nextNode.x, nextNode.y);
  });
  ctx.stroke();

  // Draw nodes
  nodes.forEach(node => {
     ctx.fillStyle = '#2D5BFF';
     ctx.beginPath();
     ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
     ctx.fill();
  });
}

export default FraudTopology;
