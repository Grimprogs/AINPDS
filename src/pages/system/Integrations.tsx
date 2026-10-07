import React from 'react';
import { Share2, CheckCircle, Plus } from 'lucide-react';

export const Integrations: React.FC = () => {
  const connectors = [
    { name: 'Splunk SIEM Enterprise', type: 'Syslog / HEC', status: 'CONNECTED', eventsSent: '14,200/min' },
    { name: 'Elasticsearch Logstash', type: 'Beats Protocol', status: 'CONNECTED', eventsSent: '8,500/min' },
    { name: 'Slack SOC Alerts Channel', type: 'Incoming Webhook', status: 'CONNECTED', eventsSent: 'On Critical' },
    { name: 'PagerDuty On-Call Incident', type: 'REST API', status: 'CONFIGURED', eventsSent: 'On Critical' }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Share2 className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">7.1 SIEM & Webhook Integrations</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Forward real-time security events to Splunk, Elastic, Webhooks, and PagerDuty
          </p>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer">
          Add Integration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {connectors.map(c => (
          <div key={c.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100">{c.name}</span>
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                {c.status}
              </span>
            </div>
            <p className="text-slate-400 font-sans">{c.type}</p>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              Throughput: {c.eventsSent}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
