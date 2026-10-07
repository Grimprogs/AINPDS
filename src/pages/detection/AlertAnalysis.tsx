import React, { useState } from 'react';
import { SecurityAlert, AlertStatus } from '../../types';
import {
  ShieldAlert,
  Sparkles,
  CheckCircle,
  Filter,
  Clock,
  Search,
  ExternalLink,
  Ban
} from 'lucide-react';
import { updateAlertStatusApi } from '../../services/api';

interface AlertAnalysisProps {
  alerts: SecurityAlert[];
  onOpenGeminiXAI: (alert: SecurityAlert) => void;
  onRefresh: () => void;
}

export const AlertAnalysis: React.FC<AlertAnalysisProps> = ({
  alerts,
  onOpenGeminiXAI,
  onRefresh
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = alerts.filter(a => {
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        a.title.toLowerCase().includes(term) ||
        a.srcIp.toLowerCase().includes(term) ||
        a.attackType.toLowerCase().includes(term) ||
        a.id.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleUpdateStatus = async (id: string, newStatus: AlertStatus) => {
    await updateAlertStatusApi(id, newStatus);
    onRefresh();
  };

  return (
    <div className="space-y-5 text-zinc-300 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-4 rounded-lg shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-bold text-xs font-mono">
              L4
            </div>
            <h1 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              1st Layer TCP SYN Flood Alerts & Incident Triage
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Focus: Layer 4 (Transport / RFC 793) packet inspection — Dedicated TCP SYN Flood & Socket Backlog events
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-2.5 font-mono">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search alert ID, IP..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-black border border-zinc-800 text-xs text-white pl-8 pr-3 py-1.5 rounded focus:outline-none focus:border-white"
            />
          </div>

          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="bg-black border border-zinc-800 text-xs text-white px-3 py-1.5 rounded focus:outline-none focus:border-white cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>
        </div>
      </div>

      {/* Alerts Table / Cards */}
      <div className="space-y-3">
        {filtered.map(alert => (
          <div
            key={alert.id}
            className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-3 shadow-sm hover:border-zinc-700 transition-colors"
          >
            {/* Alert Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                      : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                  }`}
                >
                  {alert.severity}
                </span>
                <span className="text-xs font-bold text-white font-mono">{alert.title}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                  Layer 4 Transport (SYN Flood)
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">({alert.id})</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-zinc-500 text-[11px]">STATUS:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    alert.status === 'ACTIVE'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                  }`}
                >
                  {alert.status}
                </span>
              </div>
            </div>

            {/* Alert Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-black p-3 rounded border border-zinc-800/80 font-mono">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Source Attacker IP</span>
                <span className="text-white font-bold">{alert.srcIp}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Target Asset</span>
                <span className="text-zinc-300">{alert.affectedAsset}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">AI Confidence</span>
                <span className="text-emerald-400 font-bold">{((alert.confidence || 0.95) * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">IPS Mitigation Action</span>
                <span className="text-white font-bold">{alert.mitigationStatus}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans">{alert.description}</p>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenGeminiXAI(alert)}
                  className="flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black px-3 py-1.5 rounded transition-all cursor-pointer font-bold text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Explain to Mam (Gemini XAI)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {alert.status !== 'MITIGATED' && (
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'MITIGATED')}
                    className="bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-700 px-3 py-1 rounded transition-all cursor-pointer text-xs"
                  >
                    Mark Mitigated
                  </button>
                )}
                {alert.status !== 'FALSE_POSITIVE' && (
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'FALSE_POSITIVE')}
                    className="bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 px-3 py-1 rounded transition-all cursor-pointer text-xs"
                  >
                    Mark False Positive
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
