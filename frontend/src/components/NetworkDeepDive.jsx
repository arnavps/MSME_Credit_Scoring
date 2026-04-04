import React, { useState, useEffect, useRef } from 'react';
import { Map, ZoomIn, ZoomOut, RotateCcw, Search, AlertTriangle, Info } from 'lucide-react';

// Mock fraud network data - Spread out more for better visibility
const mockNodes = [
  { id: '27AAAPC1234A1Z1', name: 'ABC Traders', type: 'suspicious', x: 200, y: 250 },
  { id: '29BBBDE5678B2Z2', name: 'XYZ Enterprises', type: 'fraudulent', x: 600, y: 150 },
  { id: '33CCCFH9012C3Z3', name: 'LMN Corporation', type: 'suspicious', x: 550, y: 450 },
  { id: '07DDDGJ3456D4Z4', name: 'PQR Services', type: 'normal', x: 100, y: 400 },
  { id: '19EEEIK7890E5Z5', name: 'STU Logistics', type: 'normal', x: 900, y: 300 },
  { id: '24FFFFL2345F6Z6', name: 'VWX Imports', type: 'suspicious', x: 350, y: 650 },
  { id: '12GGGGN6789G7Z7', name: 'YZA Exports', type: 'fraudulent', x: 750, y: 550 },
  { id: '08HHHHP0123H8Z8', name: 'BCD Manufacturing', type: 'normal', x: 50, y: 600 },
];

const mockEdges = [
  { from: '27AAAPC1234A1Z1', to: '29BBBDE5678B2Z2', value: 150000, circular: true },
  { from: '29BBBDE5678B2Z2', to: '33CCCFH9012C3Z3', value: 120000, circular: true },
  { from: '33CCCFH9012C3Z3', to: '27AAAPC1234A1Z1', value: 180000, circular: true },
  { from: '07DDDGJ3456D4Z4', to: '27AAAPC1234A1Z1', value: 50000, circular: false },
  { from: '19EEEIK7890E5Z5', to: '29BBBDE5678B2Z2', value: 75000, circular: false },
  { from: '24FFFFL2345F6Z6', to: '12GGGGN6789G7Z7', value: 200000, circular: true },
  { from: '12GGGGN6789G7Z7', to: '24FFFFL2345F6Z6', value: 180000, circular: true },
  { from: '08HHHHP0123H8Z8', to: '07DDDGJ3456D4Z4', value: 30000, circular: false },
];

const nodeColors = {
  normal: '#3b82f6',
  suspicious: '#f59e0b',
  fraudulent: '#ef4444'
};

function NetworkDeepDive() {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // Draw edges
    mockEdges.forEach(edge => {
      const fromNode = mockNodes.find(n => n.id === edge.from);
      const toNode = mockNodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = edge.circular ? '#ef4444' : '#475569';
      ctx.lineWidth = edge.circular ? 3 : 1;
      ctx.stroke();

      // Draw arrow
      const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
      const arrowLength = 10;
      const arrowX = toNode.x - Math.cos(angle) * 25;
      const arrowY = toNode.y - Math.sin(angle) * 25;

      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle - Math.PI / 6),
        arrowY - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle + Math.PI / 6),
        arrowY - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.strokeStyle = edge.circular ? '#ef4444' : '#64748b';
      ctx.stroke();
    });

    // Draw nodes
    mockNodes.forEach(node => {
      const isHovered = hoveredNode?.id === node.id;
      const isSelected = selectedNode?.id === node.id;
      const nodeRadius = isHovered || isSelected ? 28 : 24;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = nodeColors[node.type];
      ctx.fill();

      // Glow effect for fraudulent nodes
      if (node.type === 'fraudulent' || isSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius + 10, 0, Math.PI * 2);
        ctx.strokeStyle = node.type === 'fraudulent' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Node label - larger font and better positioned
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y + 4);

      // GSTIN below name - smaller and faded
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText(node.id.slice(0, 12) + '...', node.x, node.y + 40);
    });

    ctx.restore();
  }, [scale, offset, hoveredNode, selectedNode]);

  // Mouse handlers
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    // Check if clicking on a node
    const clickedNode = mockNodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 30;
    });

    if (clickedNode) {
      setSelectedNode(clickedNode);
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    // Check hover
    const hovered = mockNodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 30;
    });
    setHoveredNode(hovered || null);

    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setScale(s => Math.min(s * 1.2, 3));
  const handleZoomOut = () => setScale(s => Math.max(s / 1.2, 0.5));
  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="h-[calc(100vh-120px)] min-h-[700px] flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Map className="text-primary" size={28} />
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tighter">ATLAS // Network Deep Dive</h1>
            <p className="text-slate-500 text-sm">Interactive Fraud Topology Visualization</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 bg-white rounded-xl px-4 py-2 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-slate-600">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-600">Suspicious</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-slate-600">Fraudulent</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={handleZoomIn} className="p-2 bg-white rounded-lg shadow-sm hover:bg-slate-50 text-slate-600">
          <ZoomIn size={20} />
        </button>
        <button onClick={handleZoomOut} className="p-2 bg-white rounded-lg shadow-sm hover:bg-slate-50 text-slate-600">
          <ZoomOut size={20} />
        </button>
        <button onClick={handleReset} className="p-2 bg-white rounded-lg shadow-sm hover:bg-slate-50 text-slate-600">
          <RotateCcw size={20} />
        </button>
        <span className="text-sm text-slate-500 ml-2">Zoom: {Math.round(scale * 100)}%</span>

        {selectedNode && (
          <div className="ml-auto flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg">
            <Search size={16} />
            <span className="text-sm font-semibold">Selected: {selectedNode.name}</span>
          </div>
        )}
      </div>

      {/* Canvas Container */}
      <div className="flex-1 relative bg-slate-900 rounded-2xl overflow-hidden min-h-[500px]">
        <canvas
          ref={canvasRef}
          width={1400}
          height={800}
          className="cursor-move w-full h-full object-contain"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* Circular Loop Alert */}
        <div className="absolute top-4 right-4 bg-red-500/90 text-white px-4 py-3 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} />
            <span className="font-bold text-sm">2 Circular Loops Detected</span>
          </div>
          <p className="text-xs text-red-100">Total Value: ₹4.3L in circular transactions</p>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-slate-800/90 text-slate-300 px-4 py-3 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Info size={14} />
            <span className="text-xs font-bold uppercase">Controls</span>
          </div>
          <p className="text-xs text-slate-400">Drag to pan • Click nodes to select • Scroll to zoom</p>
        </div>
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="mt-4 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`
                  text-[10px] font-bold px-2 py-0.5 rounded uppercase
                  ${selectedNode.type === 'fraudulent' ? 'bg-red-100 text-red-700' :
                    selectedNode.type === 'suspicious' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'}
                `}>
                  {selectedNode.type}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">{selectedNode.name}</h3>
              <p className="text-sm text-slate-500 font-mono">{selectedNode.id}</p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
            <div>
              <div className="text-xs text-slate-400 uppercase">Total Transactions</div>
              <div className="text-lg font-bold text-slate-800">1,247</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase">Linked Entities</div>
              <div className="text-lg font-bold text-slate-800">8</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase">Risk Score</div>
              <div className={`
                text-lg font-bold
                ${selectedNode.type === 'fraudulent' ? 'text-red-500' :
                  selectedNode.type === 'suspicious' ? 'text-amber-500' :
                    'text-blue-500'}
              `}>
                {selectedNode.type === 'fraudulent' ? '92/100' :
                  selectedNode.type === 'suspicious' ? '67/100' :
                    '23/100'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NetworkDeepDive;
