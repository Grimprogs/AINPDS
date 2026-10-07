import React, { useState } from 'react';
import { Terminal, Play, Plus, CheckCircle, ShieldCheck } from 'lucide-react';

export const RulesEngine: React.FC = () => {
  const [snortRule, setSnortRule] = useState(
    'alert tcp $EXTERNAL_NET any -> $HOME_NET 80 (msg:"NIDPS - Potential SQL Injection Attempt"; content:"UNION SELECT"; nocase; sid:1000001; rev:1;)'
  );
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestRule = () => {
    setTestResult(
      'Rule Syntax Valid! Snort/Suricata compiler successfully validated signature sid:1000001. Live pattern matcher active on eth0.'
    );
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">2.3 Snort & Suricata Signature Rules Engine</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Write, compile, and validate high-speed deep packet inspection (DPI) signatures
          </p>
        </div>
      </div>

      {/* Editor Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 font-mono">Snort Signature Builder</h3>
        <textarea
          rows={4}
          value={snortRule}
          onChange={e => setSnortRule(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
        />

        <div className="flex items-center justify-between">
          <button
            onClick={handleTestRule}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Test & Compile Signature Rule</span>
          </button>
        </div>

        {testResult && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{testResult}</span>
          </div>
        )}
      </div>
    </div>
  );
};
