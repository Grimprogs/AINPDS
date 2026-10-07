import React, { useState } from 'react';
import { mockShapFeatures } from '../../data/mockData';
import { BrainCircuit, Sparkles, BarChart2, Info } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const ShapAnalysis: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState(mockShapFeatures[0]);

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">6.3 SHAP Explainable AI (XAI) Engine</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Shapley Additive exPlanations (SHAP) feature attribution breakdown for model decision transparency
          </p>
        </div>
      </div>

      {/* SHAP Global Importance Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 font-mono">
            Global SHAP Feature Importance (|&Delta;SHAP| Impact)
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={mockShapFeatures}>
                <XAxis type="number" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <YAxis dataKey="displayName" type="category" stroke="#64748b" fontSize={11} width={140} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Bar dataKey="importanceValue" fill="#f97316" radius={[0, 8, 8, 0]}>
                  {mockShapFeatures.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#f43f5e' : '#f97316'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Feature Interpretation Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Info className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold text-slate-100">Feature Interpretation</h3>
          </div>

          <div className="space-y-3 text-xs">
            {mockShapFeatures.map(f => (
              <div
                key={f.feature}
                onClick={() => setSelectedFeature(f)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedFeature.feature === f.feature
                    ? 'bg-orange-500/10 border-orange-500 text-slate-100'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex justify-between font-bold mb-1">
                  <span>{f.displayName}</span>
                  <span className="text-orange-400">{f.featureActualValue}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
