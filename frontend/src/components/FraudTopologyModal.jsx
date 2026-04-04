import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import GlassCard from './GlassCard';
import { X } from 'lucide-react';

const FraudTopologyModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  // Transform topology_path into graph data
  const graphData = {
    nodes: [],
    links: []
  };

  if (data?.topology_path) {
    const nodes = new Set();
    data.topology_path.forEach(edge => {
      nodes.add(edge.from);
      nodes.add(edge.to);
      graphData.links.push({ source: edge.from, target: edge.to, val: 2 });
    });
    graphData.nodes = Array.from(nodes).map(id => ({ 
      id, 
      name: id === data.gstin ? 'Target MSME' : `Entity ${id.slice(-4)}`,
      color: id === data.gstin ? '#2D5BFF' : '#ef4444'
    }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <GlassCard className="w-full max-w-5xl h-[80vh] relative flex flex-col p-0 overflow-hidden bg-white/90">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Fraud Topology Explorer</h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Detecting Circular Transaction Rings</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all">
            <X size={24} className="text-slate-400" />
          </button>
        </div>
        
        <div className="flex-1 bg-slate-50 relative">
          <ForceGraph2D
            graphData={graphData}
            nodeLabel="name"
            nodeColor={node => node.color}
            linkColor={() => '#cbd5e1'}
            linkDirectionalParticles={4}
            linkDirectionalParticleSpeed={d => d.value * 0.001}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.name;
              const fontSize = 12/globalScale;
              ctx.font = `${fontSize}px Inter`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = node.color;
              ctx.beginPath(); ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false); ctx.fill();
              ctx.fillStyle = '#1e293b';
              ctx.fillText(label, node.x, node.y + 10);
            }}
          />
          
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] font-bold text-slate-600">Target MSME</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-status-critical" />
              <span className="text-[10px] font-bold text-slate-600">Suspected Fraud Ring</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Detection Confidence</span>
            <span className="text-sm font-bold text-status-critical">94.2% AI Confidence</span>
          </div>
          <button className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg">
            Generate Legal Disclosure
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default FraudTopologyModal;
