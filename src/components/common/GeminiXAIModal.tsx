import React, { useState } from 'react';
import { BrainCircuit, X, Sparkles, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { analyzeThreatWithGeminiApi } from '../../services/api';

interface GeminiXAIModalProps {
  isOpen?: boolean;
  onClose: () => void;
  alert: any;
}

export const GeminiXAIModal: React.FC<GeminiXAIModalProps> = ({
  isOpen = true,
  onClose,
  onAlertUpdated,
  alert
}: any) => {
  if (!isOpen || !alert) return null;

  const [loading, setLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState<string | null>(alert.aiAnalysis || null);
  const [copied, setCopied] = useState(false);

  const handleGenerateAnalysis = async () => {
    setLoading(true);
    try {
      const res = await analyzeThreatWithGeminiApi(alert.id, alert);
      setAnalysisText(res.analysis);
      if (onAlertUpdated) {
        onAlertUpdated({ ...alert, aiAnalysis: res.analysis });
      }
    } catch (err) {
      setAnalysisText("Failed to query Gemini AI engine.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (analysisText) {
      navigator.clipboard.writeText(analysisText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in duration-200">
        {/* Header */}
        <div className="bg-black px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Explainable AI (XAI) Analysis
                </h3>
                <span className="bg-zinc-900 text-zinc-300 border border-zinc-700 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Gemini 3.6 Flash
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Plain-language breakdown designed for presentation & viva defense
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-1 rounded hover:bg-zinc-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs flex-1 custom-scrollbar">
          {/* Target Alert Summary Card */}
          <div className="bg-black p-3.5 rounded border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-xs">{alert.title}</span>
                <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded border border-zinc-700">
                  Layer 4 Transport DoS (SYN Flood)
                </span>
              </div>
              <span className="text-zinc-500 font-mono text-[10px]">{alert.id}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
              <div><span className="text-zinc-500 uppercase">Source:</span> {alert.srcIp}</div>
              <div><span className="text-zinc-500 uppercase">Target Port:</span> {alert.dstPort}</div>
              <div><span className="text-zinc-500 uppercase">ML Confidence:</span> {((alert.confidence || 0.95) * 100).toFixed(0)}%</div>
            </div>
          </div>

          {/* Analysis View */}
          {!analysisText && !loading ? (
            <div className="text-center py-8 bg-black rounded border border-dashed border-zinc-800 p-6 space-y-3">
              <BrainCircuit className="w-9 h-9 text-zinc-500 mx-auto" />
              <p className="text-white font-sans text-sm font-semibold">
                Generate 1st Layer Threat Explanation
              </p>
              <p className="text-zinc-400 text-xs max-w-md mx-auto font-sans leading-relaxed">
                Gemini will format the packet anomalies and explain the exact threat mechanics, OSI layer, and mitigation in 5 clean points ready for your teacher.
              </p>
              <button
                onClick={handleGenerateAnalysis}
                className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded text-xs font-bold font-mono transition-all flex items-center gap-2 mx-auto cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Gemini XAI Threat Analysis</span>
              </button>
            </div>
          ) : loading ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-zinc-300 font-semibold font-mono text-xs">
                Generating simple explainable AI summary...
              </p>
            </div>
          ) : (
            <div className="bg-black p-4 rounded border border-zinc-800 text-zinc-300 space-y-3 leading-relaxed whitespace-pre-wrap font-sans text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>XAI Explanation Ready</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
                >
                  {copied ? 'Copied!' : 'Copy Summary'}
                </button>
              </div>
              <div className="text-zinc-300 leading-relaxed space-y-2 font-mono text-xs">
                {analysisText}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-black px-5 py-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>First-Layer NIDPS Explainability</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded transition-colors font-semibold cursor-pointer border border-zinc-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
