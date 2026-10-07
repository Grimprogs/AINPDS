import React from 'react';
import { Activity } from 'lucide-react';

export const TopTalkers: React.FC = () => {
  const talkers = [
    { ip: '185.220.101.45', country: 'RU', bandwidth: '45.2 GB', packets: '14,200,000', status: 'BLOCKED' },
    { ip: '10.0.1.100', country: 'US (Internal)', bandwidth: '18.4 GB', packets: '8,400,000', status: 'ALLOW' },
    { ip: '45.154.255.88', country: 'DE', bandwidth: '6.1 GB', packets: '1,850,000', status: 'MITIGATED' }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">5.3 Top Talkers & Port Traffic Statistics</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Highest bandwidth consumer IP addresses and destination port rankings
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Source IP</th>
              <th className="p-3">Location</th>
              <th className="p-3">Volume</th>
              <th className="p-3">Packets</th>
              <th className="p-3">IPS Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {talkers.map(t => (
              <tr key={t.ip} className="hover:bg-slate-950/50">
                <td className="p-3 font-bold text-slate-100">{t.ip}</td>
                <td className="p-3 text-slate-400">{t.country}</td>
                <td className="p-3 text-emerald-400 font-bold">{t.bandwidth}</td>
                <td className="p-3 text-slate-400">{t.packets}</td>
                <td className="p-3 font-bold">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
