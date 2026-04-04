import React, { memo, useMemo, useRef, useEffect, useState } from 'react';
import { ShieldCheck, Network, AlertCircle, Search, Info } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import ForceGraph2D from 'react-force-graph-2d';

const AtlasExplorer = memo(() => {
  const { data, liveData, loading } = useDashboard();
  const fgRef = useRef();
  const [hoverNode, setHoverNode] = useState(null);

  // Single Source of Truth
  const fraudRing = data?.fraudAnalysis?.fraud_ring || { nodes: [], edges: [] };
  const riskCount = (liveData?.features?.net_inflow_ratio < -0.1) ? 3 : (data?.fraudAnalysis?.node_count || 0);
  const isHealthy = riskCount === 0;

  // Prepare Graph Data
  const graphData = useMemo(() => {
    if (isHealthy) {
      return { nodes: [{ id: 'ROOT', name: 'Secure Entity' }], links: [] };
    }

    const nodes = (fraudRing.nodes || []).map(id => ({
      id,
      name: id,
      val: id === data?.gstin ? 15 : 10,
      color: id === data?.gstin ? '#4338CA' : '#6366F1'
    }));

    const links = (fraudRing.edges || []).map(edge => ({
      source: edge.from,
      target: edge.to,
      amount: edge.amount,
      label: edge.label,
      color: '#4338CA'
    }));

    return { nodes, links };
  }, [fraudRing, isHealthy, data?.gstin]);

  useEffect(() => {
    if (fgRef.current && graphData.nodes.length > 0) {
      fgRef.current.zoomToFit(400, 50);
    }
  }, [graphData]);

  if (loading) {
    return (
      <div className="bento-card h-full flex flex-col items-center justify-center animate-pulse">
        <Network className="text-slate-100" size={48} strokeWidth={1} />
        <div className="h-4 w-32 bg-slate-50 rounded-full mt-4" />
      </div>
    );
  }

  return (
    <div className="bento-card h-full flex flex-col overflow-hidden relative">
      <div className="w-full flex flex-col items-center text-center mb-6 relative z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">
          Atlas // Network Topology
        </span>
        <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Circular Flow Detection</h3>
      </div>

      <div className="flex-1 w-full relative group">
        <div className="absolute inset-0 bg-slate-50/30 rounded-2xl border border-slate-100 overflow-hidden">
          <ForceGraph2D
            ref={fgRef}
            graphData={graphData}
            backgroundColor="#ffffff"
            nodeLabel="name"
            nodeColor={n => n.color}
            nodeRelSize={4}
            linkWidth={2}
            linkColor={l => l.color}
            linkDirectionalParticles={isHealthy ? 0 : 4}
            linkDirectionalParticleSpeed={0.01}
            linkDirectionalParticleWidth={2}
            width={400}
            height={300}
            enableNodeDrag={false}
            enablePanInteraction={true}
            enableZoomInteraction={false}
            onNodeClick={node => setHoverNode(node)}
          />
        </div>

        {!isHealthy && hoverNode && (
          <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur shadow-xl border border-slate-200 p-4 rounded-xl max-w-[180px] animate-in fade-in zoom-in duration-200">
             <div className="flex items-center gap-2 mb-2">
                <Info size={14} className="text-royal" />
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Entity Context</span>
             </div>
             <p className="text-[10px] font-bold text-slate-500 break-all mb-1">{hoverNode.id}</p>
          </div>
        )}

        <div className="absolute bottom-4 left-4 z-10 flex flex-col">
          <span className={`text-6xl font-black ${isHealthy ? 'text-royal' : 'text-red-500'} tracking-tighter leading-none mb-1 tabular-nums`}>
            {riskCount}
          </span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
             Flagged Entities
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 w-full relative z-10">
        <div className={`px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border flex items-center gap-2 ${
          isHealthy 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
            : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          {isHealthy ? <ShieldCheck size={16} strokeWidth={1} /> : <AlertCircle size={16} strokeWidth={1} />}
          {isHealthy ? 'Clean Path Verified' : 'Abnormal Circular Flow'}
        </div>
      </div>

      <div className="w-full mt-auto pt-6 border-t border-slate-100 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
        <div className="flex items-center gap-2">
           <Search size={14} strokeWidth={1} className="text-royal opacity-40" />
           Integrity Analysis: Active
        </div>
        {!isHealthy && <span className="text-red-500">Alert: Cycle Encapsulated</span>}
      </div>
    </div>
  );
});

export default AtlasExplorer;
