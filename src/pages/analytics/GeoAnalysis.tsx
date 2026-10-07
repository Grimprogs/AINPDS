import React from 'react';
import { Globe } from 'lucide-react';

export const GeoAnalysis: React.FC = () => {
  const geoData = [
    { country: 'Russia (RU)', packets: '14,200,000', percentage: '45%', threatLevel: 'CRITICAL' },
    { country: 'United States (US)', packets: '8,400,000', percentage: '28%', threatLevel: 'NORMAL' },
    { country: 'Germany (DE)', packets: '3,800,000', percentage: '12%', threatLevel: 'MEDIUM' },
    { country: 'China (CN)', packets: '2,100,000', percentage: '7%', threatLevel: 'HIGH' }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Globe className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">5.5 Geographic Origin Attack Analytics</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Threat volume ranking broken down by source Autonomous System Numbers (ASN) and country codes
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Country Code</th>
              <th className="p-3">Total Ingress Packets</th>
              <th className="p-3">Share of Traffic</th>
              <th className="p-3">Threat Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {geoData.map(g => (
              <tr key={g.country} className="hover:bg-slate-950/50">
                <td className="p-3 font-bold text-slate-100">{g.country}</td>
                <td className="p-3 text-slate-300">{g.packets}</td>
                <td className="p-3 text-teal-400 font-bold">{g.percentage}</td>
                <td className="p-3 font-bold">{g.threatLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
