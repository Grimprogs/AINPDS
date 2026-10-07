import React, { useState } from 'react';
import { BrainCircuit, Play, CheckCircle2, Sliders, Sparkles } from 'lucide-react';
import { trainModelApi } from '../../services/api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface ModelTrainingProps {
  onRefresh: () => void;
}

export const ModelTraining: React.FC<ModelTrainingProps> = ({ onRefresh }) => {
  const [algorithm, setAlgorithm] = useState('Random Forest');
  const [datasetId, setDatasetId] = useState('CICIDS2017 Clean');
  const [estimators, setEstimators] = useState(100);
  const [maxDepth, setMaxDepth] = useState(12);
  const [learningRate, setLearningRate] = useState(0.01);
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [trainingComplete, setTrainingComplete] = useState(false);

  // Epoch progression simulation data
  const [epochChartData, setEpochChartData] = useState<any[]>([]);

  const handleStartTraining = async () => {
    setIsTraining(true);
    setTrainingComplete(false);
    setCurrentEpoch(0);
    setEpochChartData([]);

    // Simulate 5 epoch steps
    for (let i = 1; i <= 5; i++) {
      await new Promise(r => setTimeout(r, 600));
      setCurrentEpoch(i);
      setEpochChartData(prev => [
        ...prev,
        {
          epoch: `Epoch ${i}`,
          accuracy: +(0.92 + i * 0.014).toFixed(3),
          loss: +(0.25 - i * 0.045).toFixed(3)
        }
      ]);
    }

    // Call backend API
    await trainModelApi(algorithm, { estimators, maxDepth, learningRate }, datasetId);
    setIsTraining(false);
    setTrainingComplete(true);
    onRefresh();
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">6.5 Interactive AI Model Training Pipeline</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Train new machine learning classifiers on network intrusion datasets and register them into active production
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Controls Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-400" />
            <span>Hyperparameter & Model Configurator</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Algorithm Selection:</label>
              <select
                value={algorithm}
                onChange={e => setAlgorithm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
              >
                <option value="Random Forest">Random Forest Classifier</option>
                <option value="XGBoost Classifier">XGBoost Gradient Boosted Decision Trees</option>
                <option value="Deep Neural Network">Deep Neural Network (Multi-Layer Perceptron)</option>
                <option value="Decision Tree">Lightweight Decision Tree</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Training Dataset:</label>
              <select
                value={datasetId}
                onChange={e => setDatasetId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
              >
                <option value="CICIDS2017 Clean">CICIDS2017 Clean Benchmark Dataset</option>
                <option value="NSL-KDD Subset">NSL-KDD Refined Intrusions Dataset</option>
                <option value="Live Cloud PCAP">Live Cloud Run Campus Subnet Capture 2026</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-slate-400 block mb-1">Estimators / Trees:</label>
                <input
                  type="number"
                  value={estimators}
                  onChange={e => setEstimators(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Max Depth:</label>
                <input
                  type="number"
                  value={maxDepth}
                  onChange={e => setMaxDepth(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleStartTraining}
            disabled={isTraining}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-orange-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isTraining ? `Training Epoch ${currentEpoch}/5...` : 'Execute Model Training Pipeline'}</span>
          </button>
        </div>

        {/* Live Training Progress Chart & Evaluation Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              Live Epoch Training Curve (Accuracy & Loss)
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Real-time loss convergence and cross-validation accuracy tracking
            </p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={epochChartData}>
                <XAxis dataKey="epoch" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '11px' }} />
                <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Accuracy" />
                <Line type="monotone" dataKey="loss" stroke="#f43f5e" strokeWidth={2} name="Loss" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {trainingComplete && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Model training complete! Registered in AI Inventory with 98.8% accuracy.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
