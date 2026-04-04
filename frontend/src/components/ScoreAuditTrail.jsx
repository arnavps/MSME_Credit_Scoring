import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  Clock,
  Hash,
  Shield,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Download,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8001";

// Source type icons and colors
const sourceTypeConfig = {
  gst_filing: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'GST Filing' },
  eway_bill: { icon: ExternalLink, color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'E-Way Bill' },
  upi_transaction: { icon: ArrowUpRight, color: 'text-green-400', bg: 'bg-green-400/10', label: 'UPI Transaction' },
  circular_transaction: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Circular Txn' },
  compliance_update: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Compliance' },
  cibil_update: { icon: Shield, color: 'text-amber-400', bg: 'bg-amber-400/10', label: 'CIBIL Update' },
  manual_override: { icon: Scale, color: 'text-orange-400', bg: 'bg-orange-400/10', label: 'Manual' },
  amnesty_application: { icon: Shield, color: 'text-teal-400', bg: 'bg-teal-400/10', label: 'Amnesty' },
  fraud_detection: { icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-400/10', label: 'Fraud Alert' },
  sentinel_signal: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Sentinel' }
};

const ScoreAuditTrail = ({ gstin }) => {
  const [history, setHistory] = useState([]);
  const [deltas, setDeltas] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSource, setSelectedSource] = useState('all');
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline'); // timeline, summary, judicial

  useEffect(() => {
    if (gstin) {
      fetchAuditData();
    }
  }, [gstin, selectedSource]);

  const fetchAuditData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch history
      const historyUrl = `${API_BASE_URL}/api/v1/risk/${gstin}/score-history?limit=50${selectedSource !== 'all' ? `&source_type=${selectedSource}` : ''}`;
      const historyRes = await fetch(historyUrl);
      if (!historyRes.ok) throw new Error('Failed to fetch score history');
      const historyData = await historyRes.json();
      setHistory(historyData.events || []);

      // Fetch deltas
      const deltasRes = await fetch(`${API_BASE_URL}/api/v1/risk/${gstin}/score-deltas`);
      if (deltasRes.ok) {
        const deltasData = await deltasRes.json();
        setDeltas(deltasData);
      }

      // Fetch judicial report
      const reportRes = await fetch(`${API_BASE_URL}/api/v1/risk/${gstin}/score-report`);
      if (reportRes.ok) {
        const reportData = await reportRes.json();
        setReport(reportData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadJudicialReport = () => {
    if (!report) return;
    
    const reportJson = JSON.stringify(report, null, 2);
    const blob = new Blob([reportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `judicial_report_${gstin}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeltaIcon = (delta) => {
    if (delta > 0) return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
    if (delta < 0) return <ArrowDownRight className="w-4 h-4 text-rose-400" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const getDeltaColor = (delta) => {
    if (delta > 0) return 'text-emerald-400';
    if (delta < 0) return 'text-rose-400';
    return 'text-slate-400';
  };

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-[32px] border border-white/5 p-8">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400" />
          <span className="ml-3 text-slate-400">Loading audit trail...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 rounded-[32px] border border-white/5 p-8">
        <div className="flex items-center justify-center h-48 text-center">
          <div>
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <p className="text-rose-400 font-medium">Failed to load audit trail</p>
            <p className="text-slate-500 text-sm mt-2">{error}</p>
            <button 
              onClick={fetchAuditData}
              className="mt-4 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 rounded-[32px] border border-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Scale className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Score Audit Trail</h2>
              <p className="text-sm text-slate-400">Judicial traceability for credit score changes</p>
            </div>
          </div>
          <button
            onClick={downloadJudicialReport}
            disabled={!report}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export Report</span>
          </button>
        </div>

        {/* Summary Cards */}
        {deltas && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-2xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Total Changes</p>
              <p className="text-2xl font-bold text-white mt-1">{deltas.total_changes}</p>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Net Change</p>
              <p className={`text-2xl font-bold mt-1 ${deltas.net_score_change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {deltas.net_score_change > 0 ? '+' : ''}{deltas.net_score_change}
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Avg Magnitude</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">±{deltas.avg_change_magnitude}</p>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Volatility</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">
                {report?.summary?.score_volatility || 0}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs & Filter */}
      <div className="bg-slate-900 rounded-[32px] border border-white/5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {[
              { id: 'timeline', label: 'Timeline', icon: Clock },
              { id: 'summary', label: 'Summary', icon: FileText },
              { id: 'judicial', label: 'Judicial Report', icon: Scale }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
          
          {activeTab === 'timeline' && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="bg-slate-800 text-slate-300 text-sm rounded-xl px-3 py-2 border border-white/10 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="all">All Sources</option>
                {Object.entries(sourceTypeConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-slate-900 rounded-[32px] border border-white/5 p-6">
        {activeTab === 'timeline' && (
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No score changes recorded yet</p>
                <p className="text-slate-500 text-sm mt-2">
                  Score changes will be logged as transactions occur
                </p>
              </div>
            ) : (
              history.map((event, index) => {
                const config = sourceTypeConfig[event.source_type] || sourceTypeConfig.manual_override;
                const Icon = config.icon;
                const isExpanded = expandedEvent === index;
                
                return (
                  <div 
                    key={index}
                    className={`rounded-2xl border transition-all ${
                      isExpanded 
                        ? 'bg-slate-800/50 border-emerald-500/30' 
                        : 'bg-slate-800/30 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedEvent(isExpanded ? null : index)}
                      className="w-full p-4 flex items-center gap-4"
                    >
                      {/* Source Icon */}
                      <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      
                      {/* Event Info */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{config.label}</span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-400">{formatTimestamp(event.timestamp)}</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{event.source_description}</p>
                      </div>
                      
                      {/* Score Delta */}
                      <div className="text-right">
                        <div className={`flex items-center gap-1 text-lg font-bold ${getDeltaColor(event.score_delta)}`}>
                          {getDeltaIcon(event.score_delta)}
                          <span>{event.score_delta > 0 ? '+' : ''}{event.score_delta}</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {event.previous_score} → {event.new_score}
                        </p>
                      </div>
                      
                      {/* Expand Icon */}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    
                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-white/5">
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Transaction ID</p>
                            <div className="flex items-center gap-2 bg-slate-900 rounded-xl px-3 py-2">
                              <Hash className="w-4 h-4 text-slate-400" />
                              <code className="text-sm text-slate-300 font-mono">{event.source_id}</code>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Evidence Hash</p>
                            <div className="flex items-center gap-2 bg-slate-900 rounded-xl px-3 py-2">
                              <Shield className="w-4 h-4 text-emerald-400" />
                              <code className="text-sm text-slate-400 font-mono truncate">
                                {event.evidence_hash?.slice(0, 16)}...
                              </code>
                            </div>
                          </div>
                        </div>
                        
                        {Object.keys(event.feature_deltas || {}).length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Affected Metrics</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {Object.entries(event.feature_deltas).map(([feature, delta]) => (
                                <div key={feature} className="bg-slate-900 rounded-xl px-3 py-2">
                                  <p className="text-xs text-slate-500">{feature.replace(/_/g, ' ')}</p>
                                  <p className={`text-sm font-medium ${delta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {delta > 0 ? '+' : ''}{typeof delta === 'number' ? delta.toFixed(3) : delta}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-4 mt-4 text-xs text-slate-500">
                          <span>Risk Band: <span className="text-slate-300">{event.risk_band}</span></span>
                          <span>Reliability: <span className="text-slate-300">{event.reliability_status}</span></span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'summary' && deltas && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Score Change Summary</h3>
              <div className="bg-slate-800/30 rounded-2xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">GSTIN</p>
                    <p className="text-white font-mono">{deltas.gstin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Total Events</p>
                    <p className="text-white font-bold text-2xl">{deltas.total_changes}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Net Score Change</p>
                    <p className={`text-xl font-bold ${deltas.net_score_change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {deltas.net_score_change > 0 ? '+' : ''}{deltas.net_score_change}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Avg Change Magnitude</p>
                    <p className="text-xl font-bold text-amber-400">±{deltas.avg_change_magnitude}</p>
                  </div>
                </div>
              </div>
            </div>

            {Object.keys(deltas.changes_by_source || {}).length > 0 && (
              <div>
                <h4 className="text-md font-bold text-white mb-3">Changes by Source</h4>
                <div className="space-y-2">
                  {Object.entries(deltas.changes_by_source).map(([source, data]) => {
                    const config = sourceTypeConfig[source] || sourceTypeConfig.manual_override;
                    return (
                      <div key={source} className="flex items-center justify-between bg-slate-800/30 rounded-xl p-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                            <config.icon className={`w-4 h-4 ${config.color}`} />
                          </div>
                          <div>
                            <p className="text-white font-medium">{config.label}</p>
                            <p className="text-xs text-slate-500">{data.count} events</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${data.total_delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {data.total_delta > 0 ? '+' : ''}{data.total_delta.toFixed(1)}
                          </p>
                          <p className="text-xs text-slate-500">avg: {data.avg_delta > 0 ? '+' : ''}{data.avg_delta.toFixed(1)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'judicial' && report && (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Scale className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-400 font-medium">Judicial Compliance Note</p>
                  <p className="text-sm text-slate-400 mt-1">
                    {report.compliance_note}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-4">Judicial Score Report</h3>
              <div className="bg-slate-800/30 rounded-2xl p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Report Type</p>
                    <p className="text-white">{report.report_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Generated At</p>
                    <p className="text-white">{formatTimestamp(report.generated_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">GSTIN</p>
                    <p className="text-white font-mono">{report.gstin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Evidence Integrity</p>
                    <p className="text-emerald-400">{report.evidence_integrity}</p>
                  </div>
                </div>

                {report.summary && (
                  <div className="border-t border-white/5 pt-4">
                    <p className="text-xs text-slate-500 uppercase mb-2">Summary</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-slate-900 rounded-xl p-3">
                        <p className="text-xs text-slate-500">Total Events</p>
                        <p className="text-xl font-bold text-white">{report.summary.total_events}</p>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-3">
                        <p className="text-xs text-slate-500">Volatility</p>
                        <p className="text-xl font-bold text-amber-400">{report.summary.score_volatility}</p>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-3">
                        <p className="text-xs text-slate-500">Initial Score</p>
                        <p className="text-xl font-bold text-slate-300">{report.summary.initial_score || 'N/A'}</p>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-3">
                        <p className="text-xs text-slate-500">Current Score</p>
                        <p className="text-xl font-bold text-emerald-400">{report.summary.current_score || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {report.current_state && (
                  <div className="border-t border-white/5 pt-4">
                    <p className="text-xs text-slate-500 uppercase mb-2">Current State</p>
                    <div className="flex gap-4">
                      <div className="bg-slate-900 rounded-xl px-4 py-2">
                        <span className="text-slate-400 text-sm">Score: </span>
                        <span className="text-white font-bold">{report.current_state.credit_score}</span>
                      </div>
                      <div className="bg-slate-900 rounded-xl px-4 py-2">
                        <span className="text-slate-400 text-sm">Risk Band: </span>
                        <span className="text-white font-bold">{report.current_state.risk_band}</span>
                      </div>
                      <div className="bg-slate-900 rounded-xl px-4 py-2">
                        <span className="text-slate-400 text-sm">CMR: </span>
                        <span className="text-white font-bold">{report.current_state.cmr_equivalent}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {report.timeline && report.timeline.length > 0 && (
              <div>
                <h4 className="text-md font-bold text-white mb-3">Event Timeline</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {report.timeline.map((event, idx) => (
                    <div key={idx} className="bg-slate-800/30 rounded-xl p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">#{event.event_sequence}</span>
                          <span className="text-slate-300">{formatTimestamp(event.timestamp)}</span>
                        </div>
                        <div className={`flex items-center gap-1 ${event.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {event.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          <span className="font-bold">{event.change > 0 ? '+' : ''}{event.change}</span>
                        </div>
                      </div>
                      <p className="text-slate-400 mt-1">{event.cause.description}</p>
                      <div className="flex gap-3 mt-2 text-xs text-slate-500">
                        <span>Score: {event.score_before} → {event.score_after}</span>
                        <span>•</span>
                        <span>Source: {event.cause.type}</span>
                        <span>•</span>
                        <span>ID: {event.cause.id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreAuditTrail;
