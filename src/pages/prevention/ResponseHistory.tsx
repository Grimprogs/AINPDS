import React from 'react';
import { ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export const ResponseHistory: React.FC = () => {
  const historyLogs = [
    { id: 'LOG-881', time: '11:40:02', action: 'IP_AUTO_BLOCK', target: '185.220.101.45', trigger: 'DDoS SYN Flood Threshold Exceeded (>10k pps)', result: 'SUCCESS' },
    { id: 'LOG-880', time: '11:25:14', action: 'FIREWALL_DROP_RULE', target: '45.154.255.88', trigger: 'SQLi Signature Rule FW-101 Hit', result: 'SUCCESS' },
    { id: 'LOG-879', time: '10:55:40', action: 'SSH_RATE_LIMIT', target: '193.163.125.12', trigger: 'SSH Brute Force Burst (>100 fails/min)', result: 'SUCCESS' }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">2.4 IPS Response & Prevention History Log</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Immutable audit record of automated and manual threat mitigation execution
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="space-y-2">
          {historyLogs.map(log => (
            <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <span>{log.time}</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-emerald-400">{log.action}</span>
                  <span className="text-slate-500">&rarr;</span>
                  <span className="text-rose-300">{log.target}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">{log.trigger}</div>
              </div>

              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                {log.result}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
