import React, { useState } from 'react';
import { Settings, Save, CheckCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [bindInterface, setBindInterface] = useState('eth0 (Cloud Run Container)');
  const [geminiStatus, setGeminiStatus] = useState('Connected via process.env.GEMINI_API_KEY');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">3.4 Core NIDPS System Configuration</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Network interface binding, AI API keys, and log storage parameters
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-w-2xl text-xs">
        {saved && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Settings Saved!</span>
          </div>
        )}

        <div>
          <label className="text-slate-300 font-bold block mb-1">Network Interface Binding:</label>
          <input
            type="text"
            value={bindInterface}
            onChange={e => setBindInterface(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
          />
        </div>

        <div>
          <label className="text-slate-300 font-bold block mb-1">Gemini AI API Key Integration:</label>
          <input
            type="text"
            readOnly
            value={geminiStatus}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-emerald-400 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};
