import React, { useState } from 'react';
import { PacketData } from '../../types';
import {
  Activity,
  Play,
  Pause,
  Download,
  Filter,
  Search,
  CheckCircle,
  AlertTriangle,
  FileCode
} from 'lucide-react';

interface LiveTrafficProps {
  packets: PacketData[];
}

export const LiveTraffic: React.FC<LiveTrafficProps> = ({ packets }) => {
  const [isLive, setIsLive] = useState(true);
  const [protocolFilter, setProtocolFilter] = useState('ALL');
  const [predictionFilter, setPredictionFilter] = useState('ALL');
  const [selectedPacket, setSelectedPacket] = useState<PacketData | null>(packets[0] || null);

  const filtered = packets.filter(p => {
    if (protocolFilter !== 'ALL' && p.protocol !== protocolFilter) return false;
    if (predictionFilter !== 'ALL' && p.prediction !== predictionFilter) return false;
    return true;
  });

  const handleExportPcap = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(packets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nidps_pcap_capture_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 text-zinc-300 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-4 rounded-lg shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-bold text-xs font-mono">
              <Activity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h1 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Live Packet Capture & Deep Packet Inspection
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time Layer 3/4 packet stream captured at the network perimeter interface (eth0)
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
              isLive
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700'
            }`}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLive ? 'Capturing Live' : 'Capture Paused'}</span>
          </button>

          <button
            onClick={handleExportPcap}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 px-3 py-1.5 rounded text-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PCAP</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Stream Table + DPI Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Packet Stream Table (2 cols) */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-3 shadow-sm">
          {/* Filters */}
          <div className="flex items-center justify-between text-xs pb-3 border-b border-zinc-800 font-mono">
            <div className="flex items-center gap-2">
              <select
                value={protocolFilter}
                onChange={e => setProtocolFilter(e.target.value)}
                className="bg-black border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded text-xs focus:outline-none focus:border-white"
              >
                <option value="ALL">All Protocols</option>
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="HTTP">HTTP</option>
                <option value="HTTPS">HTTPS</option>
                <option value="DNS">DNS</option>
                <option value="SSH">SSH</option>
              </select>

              <select
                value={predictionFilter}
                onChange={e => setPredictionFilter(e.target.value)}
                className="bg-black border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded text-xs focus:outline-none focus:border-white"
              >
                <option value="ALL">All Classifications</option>
                <option value="NORMAL">Normal</option>
                <option value="MALICIOUS">Malicious</option>
              </select>
            </div>
            <span className="text-zinc-500 text-[11px]">{filtered.length} Packets Captured</span>
          </div>

          {/* Packet Rows */}
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 font-mono text-xs border border-dashed border-zinc-800 rounded-lg">
                No captured packets matching the current filters. Live sensor is listening on eth0...
              </div>
            ) : (
              filtered.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPacket(p)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between font-mono ${
                    selectedPacket?.id === p.id
                      ? 'bg-zinc-800 border-white text-white shadow-sm'
                      : p.prediction === 'MALICIOUS'
                      ? 'bg-rose-950/20 border-rose-800/60 text-rose-200 hover:bg-rose-950/30'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-zinc-500">{p.timestamp}</span>
                      <span className="font-bold text-white">{p.srcIp}:{p.srcPort}</span>
                      <span className="text-zinc-600">&rarr;</span>
                      <span className="font-bold text-zinc-300">{p.dstIp}:{p.dstPort}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate max-w-sm">
                      {p.payloadPreview}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-bold border border-zinc-700">
                      {p.protocol}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.prediction === 'MALICIOUS'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                      }`}
                    >
                      {p.prediction}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* DPI Packet Inspector Details (1 col) */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-800">
            <FileCode className="w-4 h-4 text-white" />
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Deep Packet Inspection (DPI)
            </h3>
          </div>

          {selectedPacket ? (
            <div className="space-y-3 text-xs font-mono">
              <div className="bg-black p-3 rounded border border-zinc-800 space-y-1.5">
                <div className="flex justify-between text-zinc-400 text-[10px]">
                  <span>PACKET ID</span>
                  <span className="font-bold text-white">{selectedPacket.id}</span>
                </div>
                <div className="flex justify-between text-zinc-400 text-[10px]">
                  <span>CLASSIFICATION</span>
                  <span
                    className={
                      selectedPacket.prediction === 'MALICIOUS' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'
                    }
                  >
                    {selectedPacket.prediction} ({selectedPacket.attackType})
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400 text-[10px]">
                  <span>CONFIDENCE</span>
                  <span className="text-white font-bold">{((selectedPacket.confidenceScore || 0.98) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-zinc-400 text-[10px]">
                  <span>ANOMALY SCORE</span>
                  <span className="text-rose-400 font-bold">{selectedPacket.anomalyScore} / 100</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">Header Breakdown</span>
                <div className="bg-black p-3 rounded border border-zinc-800 text-[11px] space-y-1 text-zinc-300">
                  <div>Src Address: <strong className="text-white">{selectedPacket.srcIp}:{selectedPacket.srcPort}</strong></div>
                  <div>Dst Address: <strong className="text-white">{selectedPacket.dstIp}:{selectedPacket.dstPort}</strong></div>
                  <div>Protocol: <span className="text-zinc-200">{selectedPacket.protocol}</span></div>
                  <div>Packet Length: <span className="text-zinc-200">{selectedPacket.length} bytes</span></div>
                  <div>Origin: <span className="text-zinc-200">{selectedPacket.locationSrc || 'External Ingress'}</span></div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">Hex / String Payload Frame</span>
                <div className="bg-black p-3 rounded border border-zinc-800 text-[10px] text-emerald-400 break-all leading-relaxed font-mono">
                  {selectedPacket.payloadPreview}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500 font-mono text-xs">
              Select a packet from the ingress stream to inspect DPI frame
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
