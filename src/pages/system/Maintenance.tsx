import React, { useState } from 'react';
import { Wrench, RefreshCw, CheckCircle2 } from 'lucide-react';

export const Maintenance: React.FC = () => {
  const [cleaned, setCleaned] = useState(false);

  const handleClean = () => {
    setCleaned(true);
    setTimeout(() => setCleaned(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Wrench className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">7.5 System Maintenance & PCAP Purge</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Database vacuum, old PCAP capture cache clearing, and daemon restart controls
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-100">Purge Expired Packet Captures</h3>
          <p className="text-slate-400 font-sans">Reclaims disk space by purging raw packet buffers older than 30 days.</p>
          <button
            onClick={handleClean}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Purge Old Captures Now</span>
          </button>
          {cleaned && (
            <div className="text-emerald-400 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4" /> Cleared 14.2 GB of legacy PCAP logs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
