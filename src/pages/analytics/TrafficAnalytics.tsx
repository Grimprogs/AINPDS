import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const TrafficAnalytics: React.FC = () => {
  const data = [
    { hour: '00:00', mbps: 450 },
    { hour: '04:00', mbps: 220 },
    { hour: '08:00', mbps: 890 },
    { hour: '12:00', mbps: 1420 },
    { hour: '16:00', mbps: 1850 },
    { hour: '20:00', mbps: 980 }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">5.1 Historical Traffic Analytics</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Bandwidth consumption trends and protocol time-series analysis
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-100">24-Hour Bandwidth Throughput (Mbps)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '11px' }} />
              <Area type="monotone" dataKey="mbps" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
