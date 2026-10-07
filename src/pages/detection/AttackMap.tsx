import React from 'react';
import { Globe, ShieldAlert, Zap, MapPin, Radio } from 'lucide-react';

export const AttackMap: React.FC = () => {
  const attackOrigins = [
    { country: 'Russia (RU)', ip: '185.220.101.45', attacksCount: 16400, vector: 'Volumetric SYN Flood', severity: 'CRITICAL', status: 'Blocked' },
    { country: 'Germany (DE)', ip: '45.154.255.88', attacksCount: 8250, vector: 'HTTPS Port 443 SYN Flood', severity: 'HIGH', status: 'Mitigated' },
    { country: 'Romania (RO)', ip: '193.163.125.12', attacksCount: 6420, vector: 'Paced Stealth SYN Flood', severity: 'HIGH', status: 'Blocked' },
    { country: 'China (CN)', ip: '114.119.160.22', attacksCount: 12890, vector: 'Spoofed Botnet SYN Flood', severity: 'CRITICAL', status: 'Filtered' },
    { country: 'United States (US)', ip: '194.26.29.110', attacksCount: 24200, vector: 'Distributed SYN Flood', severity: 'CRITICAL', status: 'Blocked' }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">1.3 Real-Time Global Attack Map</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Geographic visual tracking of incoming cyber threats targeting NIDPS protected subnets
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-emerald-400">
          <Radio className="w-4 h-4 animate-pulse text-emerald-500" />
          <span>Live Radar Feed Active</span>
        </div>
      </div>

      {/* Visual Canvas Simulation Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden h-96 flex flex-col justify-between shadow-2xl">
        {/* World Grid Lines Simulation */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

        {/* Attack Origin Markers Overlay */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {attackOrigins.map(origin => (
            <div
              key={origin.ip}
              className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl backdrop-blur-sm hover:border-rose-500/50 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold">{origin.country}</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              </div>
              <p className="text-xs text-rose-300 font-bold">{origin.ip}</p>
              <div className="text-[10px] text-slate-400 font-sans">{origin.vector}</div>
              <div className="flex items-center justify-between text-[9px] pt-1 border-t border-slate-800">
                <span className="text-slate-500">{origin.attacksCount.toLocaleString()} pkts</span>
                <span className="text-emerald-400 font-bold">{origin.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Center Target Protected Gateway Node */}
        <div className="relative z-10 self-center bg-slate-900 border-2 border-emerald-500/80 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl shadow-emerald-950/40">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <div className="text-xs font-bold text-emerald-400 font-mono">
              TARGET: NIDPS Gateway Node (10.0.1.100)
            </div>
            <div className="text-[10px] text-slate-400">
              Protected by IPS Auto-Block Shield & Random Forest Classifier
            </div>
          </div>
        </div>
      </div>

      {/* Top Attack Origins Ranking Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-100 font-mono">
          Top Geographic Attack Vectors & Origin Subnets
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Origin Country</th>
                <th className="p-3">Source IP</th>
                <th className="p-3">Primary Attack Vector</th>
                <th className="p-3">Volume (Packets)</th>
                <th className="p-3">Severity</th>
                <th className="p-3">IPS Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {attackOrigins.map(a => (
                <tr key={a.ip} className="hover:bg-slate-950/50">
                  <td className="p-3 font-bold text-slate-200">{a.country}</td>
                  <td className="p-3 text-rose-400 font-mono">{a.ip}</td>
                  <td className="p-3 text-slate-300">{a.vector}</td>
                  <td className="p-3 text-slate-400">{a.attacksCount.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 font-bold">
                      {a.severity}
                    </span>
                  </td>
                  <td className="p-3 text-emerald-400 font-bold">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
