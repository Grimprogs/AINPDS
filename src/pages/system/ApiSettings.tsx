import React from 'react';
import { Key, Copy } from 'lucide-react';

export const ApiSettings: React.FC = () => {
  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">7.4 REST API Credentials & Access Tokens</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Manage programmatic API tokens for external SOC SIEM polling
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
        <span className="text-slate-400 font-bold block">ACTIVE BEARER TOKEN:</span>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-emerald-400">
          <span>nidps_live_bearer_tk_8f9214b901aef</span>
          <button className="text-slate-400 hover:text-slate-200 cursor-pointer">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
