import React from 'react';
import { Radio, CheckCircle2 } from 'lucide-react';

export const SensorsStatus: React.FC = () => {
  const sensors = [
    { name: 'Sensor Node US-East-1', ip: '10.0.1.10', status: 'HEALTHY', pps: 3400, version: 'NIDPS-Sensor v2.1' },
    { name: 'Sensor Node EU-Central-1', ip: '10.0.2.10', status: 'HEALTHY', pps: 1850, version: 'NIDPS-Sensor v2.1' },
    { name: 'Sensor Node APAC-Tokyo-1', ip: '10.0.3.10', status: 'HEALTHY', pps: 920, version: 'NIDPS-Sensor v2.1' }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Radio className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">4.5 Edge Sensor Probe Fleet</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Distributed sensor tap nodes transmitting PCAP streams to central AI engine
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {sensors.map(s => (
          <div key={s.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100">{s.name}</span>
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                {s.status}
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400">IP: {s.ip}</div>
              <div className="text-slate-400">Live Traffic: {s.pps.toLocaleString()} pps</div>
              <div className="text-slate-500 text-[10px]">{s.version}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
