import React, { useState } from 'react';
import { Sliders, CheckCircle, Save } from 'lucide-react';

export const AutoBlocking: React.FC = () => {
  const [synThreshold, setSynThreshold] = useState(10000);
  const [sshThreshold, setSshThreshold] = useState(100);
  const [blockDurationHours, setBlockDurationHours] = useState(24);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">2.5 Automated IPS Blocking Thresholds</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Set rate limiting sensitivity and threshold limits for immediate machine learning auto-blocking
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md"
        >
          <Save className="w-4 h-4" />
          <span>Save Threshold Configs</span>
        </button>
      </div>

      {/* Threshold Config Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 max-w-2xl">
        {saved && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>IPS Auto-Blocking Policy Updated Successfully!</span>
          </div>
        )}

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-slate-300 font-bold">DDoS SYN Flood Auto-Block Threshold:</label>
              <span className="text-emerald-400 font-bold">{synThreshold.toLocaleString()} pps</span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={synThreshold}
              onChange={e => setSynThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-slate-300 font-bold">SSH Brute Force Fails Threshold:</label>
              <span className="text-emerald-400 font-bold">{sshThreshold} fails / min</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={sshThreshold}
              onChange={e => setSshThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-slate-300 font-bold">Default IP Ban Duration:</label>
              <span className="text-emerald-400 font-bold">{blockDurationHours} Hours</span>
            </div>
            <input
              type="range"
              min="1"
              max="168"
              step="1"
              value={blockDurationHours}
              onChange={e => setBlockDurationHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
