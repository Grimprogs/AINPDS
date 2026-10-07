import React from 'react';
import { mockThreatFeeds } from '../../data/mockData';
import { RadioTower, ExternalLink, ShieldAlert, Database, Search } from 'lucide-react';

export const ThreatIntel: React.FC = () => {
  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <RadioTower className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">1.4 Cyber Threat Intelligence Feeds</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Automated synchronization with AlienVault OTX, AbuseIPDB, MISP, and NVD MITRE CVE databases
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer">
            Sync Threat Feeds Now
          </button>
        </div>
      </div>

      {/* Threat Feed List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockThreatFeeds.map(feed => (
          <div key={feed.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-blue-400 font-bold">{feed.source}</span>
              <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded text-[10px] font-bold">
                Risk Score: {feed.riskScore}/100
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-100">{feed.threatName}</h3>
              <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">{feed.description}</p>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500 text-[10px] block">INDICATOR OF COMPROMISE (IOC)</span>
                <span className="text-rose-300 font-bold">{feed.indicator}</span>
              </div>
              <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px]">
                {feed.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
