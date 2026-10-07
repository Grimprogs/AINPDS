import React, { useState } from 'react';
import { Database, Download, Upload, CheckCircle } from 'lucide-react';

export const BackupRestore: React.FC = () => {
  const [backedUp, setBackedUp] = useState(false);

  const handleBackup = () => {
    setBackedUp(true);
    setTimeout(() => setBackedUp(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">7.2 System Backup & Rules Restore</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Snapshot firewall rules, ML model weights, and Snort signature files
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-100">Create System Backup Snapshot</h3>
          <p className="text-slate-400 font-sans">Exports current firewall rules, model checkpoints, and user configs into a secure JSON file.</p>
          <button
            onClick={handleBackup}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Generate Backup Snapshot</span>
          </button>
          {backedUp && (
            <div className="text-emerald-400 flex items-center gap-1.5 pt-1">
              <CheckCircle className="w-4 h-4" /> Backup created successfully!
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-100">Restore System Configuration</h3>
          <p className="text-slate-400 font-sans">Upload a previously generated NIDPS JSON snapshot file to restore state.</p>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Select Snapshot File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
