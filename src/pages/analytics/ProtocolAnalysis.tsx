import React from 'react';
import { Network } from 'lucide-react';

export const ProtocolAnalysis: React.FC = () => {
  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Network className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">5.4 Deep Protocol & Cipher Inspector</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            TLS version distribution, HTTP method ratios, and DNS query types
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-slate-400 font-bold">TLS VERSION RATIO</span>
          <div className="space-y-1 pt-2">
            <div className="flex justify-between"><span>TLS 1.3:</span><span className="text-emerald-400 font-bold">78.5%</span></div>
            <div className="flex justify-between"><span>TLS 1.2:</span><span className="text-slate-300">21.0%</span></div>
            <div className="flex justify-between"><span>Deprecated TLS 1.0/1.1:</span><span className="text-rose-400 font-bold">0.5% (Blocked)</span></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-slate-400 font-bold">HTTP METHOD DISTRIBUTION</span>
          <div className="space-y-1 pt-2">
            <div className="flex justify-between"><span>GET:</span><span className="text-slate-300">62%</span></div>
            <div className="flex justify-between"><span>POST:</span><span className="text-slate-300">32%</span></div>
            <div className="flex justify-between"><span>PUT / DELETE:</span><span className="text-slate-300">6%</span></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-slate-400 font-bold">DNS QUERY TYPES</span>
          <div className="space-y-1 pt-2">
            <div className="flex justify-between"><span>A / AAAA Records:</span><span className="text-slate-300">85%</span></div>
            <div className="flex justify-between"><span>TXT (DNS Tunneling):</span><span className="text-amber-400 font-bold">12%</span></div>
            <div className="flex justify-between"><span>MX Records:</span><span className="text-slate-300">3%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
