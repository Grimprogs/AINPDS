import React from 'react';
import { mockVulnerabilities } from '../../data/mockData';
import { ShieldAlert, AlertTriangle, CheckCircle, Search, RefreshCw } from 'lucide-react';

export const Vulnerabilities: React.FC = () => {
  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">1.5 Network Vulnerability Assessment</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Automated port scanning & CVSS risk scoring for open infrastructure daemons
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Run Vulnerability Scan</span>
        </button>
      </div>

      {/* Vulnerabilities Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-100 font-mono">Discovered CVE Flaws & Remediation</h3>

        <div className="space-y-3">
          {mockVulnerabilities.map(v => (
            <div key={v.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-rose-400 text-xs">{v.cveId}</span>
                  <span className="text-slate-400 text-xs">({v.service} on Port {v.port})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded text-[10px] font-bold">
                    CVSS {v.cvssScore} / 10.0
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.status === 'OPEN' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-200 font-sans">{v.title}</h4>
              <p className="text-xs text-emerald-400 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/30">
                <span className="font-bold">Recommended Mitigation:</span> {v.solution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
