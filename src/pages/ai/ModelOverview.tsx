import React from 'react';
import { MLModelInfo } from '../../types';
import { BrainCircuit, CheckCircle, Play, Cpu, Layers } from 'lucide-react';
import { activateModelApi } from '../../services/api';

interface ModelOverviewProps {
  models: MLModelInfo[];
  onRefresh: () => void;
}

export const ModelOverview: React.FC<ModelOverviewProps> = ({ models, onRefresh }) => {
  const handleActivate = async (id: string) => {
    await activateModelApi(id);
    onRefresh();
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131316] border border-white/10 p-5 rounded-xl shadow-lg">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h1 className="text-base font-bold text-white uppercase tracking-wider">
              AI & ML Model Inventory & Deployment Registry
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Deployable machine learning models trained for network intrusion classification and zero-day anomaly detection
          </p>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {models.map(m => (
          <div
            key={m.id}
            className={`bg-[#131316] border rounded-xl p-5 space-y-4 transition-all shadow-md ${
              m.status === 'PRODUCTION'
                ? 'border-orange-500/50'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs text-slate-400 font-bold tracking-wider">{m.algorithm}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  m.status === 'PRODUCTION'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : 'bg-white/5 text-slate-400 border border-white/10'
                }`}
              >
                {m.status}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{m.name}</h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">Benchmark Dataset: {m.datasetUsed}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-[#0A0A0B] p-3 rounded-lg border border-white/5 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">ACCURACY</span>
                <span className="text-emerald-400 font-bold">{(m.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">F1 SCORE</span>
                <span className="text-emerald-400 font-bold">{(m.f1Score * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">PRECISION</span>
                <span className="text-slate-200">{(m.precision * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">LATENCY</span>
                <span className="text-slate-200">{m.latencyMs} ms</span>
              </div>
            </div>

            {m.status !== 'PRODUCTION' && (
              <button
                onClick={() => handleActivate(m.id)}
                className="w-full bg-white/5 hover:bg-orange-600 text-slate-200 hover:text-white border border-white/10 hover:border-orange-500/40 py-2 rounded-md text-xs font-bold transition-all cursor-pointer font-mono"
              >
                Deploy to Production Engine
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
