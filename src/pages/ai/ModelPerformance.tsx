import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const ModelPerformance: React.FC = () => {
  const confusionMatrix = [
    { class: 'Normal', trueNormal: 45200, falseAttack: 120, precision: '99.7%' },
    { class: 'DoS / DDoS', trueNormal: 80, trueAttack: 14800, precision: '99.5%' },
    { class: 'Probe / Scan', trueNormal: 140, trueAttack: 3820, precision: '96.5%' },
    { class: 'R2L / SQLi', trueNormal: 95, trueAttack: 1240, precision: '92.8%' }
  ];

  const rocData = [
    { fpr: 0.0, tpr: 0.0 },
    { fpr: 0.02, tpr: 0.85 },
    { fpr: 0.05, tpr: 0.96 },
    { fpr: 0.1, tpr: 0.987 },
    { fpr: 0.2, tpr: 0.995 },
    { fpr: 1.0, tpr: 1.0 }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">6.2 AI Model Performance Evaluation</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Confusion matrix, ROC AUC metrics, and cross-validation performance across attack classes
          </p>
        </div>
      </div>

      {/* Confusion Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-100 font-mono">Confusion Matrix & Per-Class Precision</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Attack Category</th>
                <th className="p-3">True Positive (TP)</th>
                <th className="p-3">False Positive (FP)</th>
                <th className="p-3">Class Precision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {confusionMatrix.map(row => (
                <tr key={row.class} className="hover:bg-slate-950/50">
                  <td className="p-3 font-bold text-slate-200">{row.class}</td>
                  <td className="p-3 text-emerald-400 font-bold">{row.trueNormal || row.trueAttack}</td>
                  <td className="p-3 text-rose-400">{row.falseAttack || 80}</td>
                  <td className="p-3 text-orange-400 font-bold">{row.precision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
