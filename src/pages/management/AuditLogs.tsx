import React from 'react';
import { Terminal, Shield } from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const auditEntries = [
    { id: 'AUD-901', time: '11:39:10', user: 'A3 (Admin)', action: 'Firewall Rule Added', details: 'Added FW-101 DROP policy for 185.220.100.0/22' },
    { id: 'AUD-900', time: '11:15:22', user: 'Elena Rostova (Analyst)', action: 'Gemini XAI Analysis Triggered', details: 'Ran XAI evaluation on Alert ALT-9041' },
    { id: 'AUD-899', time: '10:42:00', user: 'System Kernel Daemon', action: 'ML Model Auto-Deploy', font: 'NIDPS Random Forest Ensemble v3.4 deployed to engine' }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">3.5 System Audit Trail & Security Logs</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Immutable log stream recording administrative edits, model updates, and security policy modifications
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 text-xs">
        {auditEntries.map(entry => (
          <div key={entry.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <span className="text-slate-400">{entry.time}</span>
                <span className="text-slate-500">|</span>
                <span className="text-purple-300">{entry.user}</span>
                <span className="text-slate-500">&rarr;</span>
                <span className="text-emerald-400">{entry.action}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">{entry.details}</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{entry.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
