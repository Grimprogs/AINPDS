import React from 'react';
import { Activity, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const TrafficMonitor: React.FC = () => {
  const protocolBreakdown = [
    { protocol: 'TCP SYN Ingress (Half-Open)', pps: 2840, volumeMb: 124.5 },
    { protocol: 'TCP Established (ACK Verified)', pps: 980, volumeMb: 88.2 },
    { protocol: 'TCP RST (Host Dropped)', pps: 410, volumeMb: 12.1 },
    { protocol: 'TCP FIN (Clean Teardown)', pps: 230, volumeMb: 8.4 }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">4.2 Live Network Traffic Monitor</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            In-depth protocol rate distribution, bandwidth allocation, and TCP SYN/ACK handshake ratios
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-100">Protocol Packet Rate Breakdown (PPS)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={protocolBreakdown}>
              <XAxis dataKey="protocol" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '11px' }} />
              <Bar dataKey="pps" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Packets / Sec" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
