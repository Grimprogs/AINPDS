import React, { useState } from 'react';
import { Bell, Save } from 'lucide-react';

export const Notifications: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackWebhooks, setSlackWebhooks] = useState(true);

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Bell className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">7.3 Notification & Alert Dispatch Rules</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Configure threshold rules for dispatching instant email, Slack, and SMS alerts
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-w-xl text-xs">
        <div className="flex items-center justify-between">
          <span>Dispatch Email Alerts on Critical Severity:</span>
          <input
            type="checkbox"
            checked={emailAlerts}
            onChange={e => setEmailAlerts(e.target.checked)}
            className="w-4 h-4 accent-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <span>Forward Alerts to Slack Webhook Channel:</span>
          <input
            type="checkbox"
            checked={slackWebhooks}
            onChange={e => setSlackWebhooks(e.target.checked)}
            className="w-4 h-4 accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
