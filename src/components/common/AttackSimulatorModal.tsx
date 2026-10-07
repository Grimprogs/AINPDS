import React, { useState, useEffect, useRef } from 'react';
import { Zap, ShieldAlert, X, AlertTriangle, CheckCircle, Server, Activity } from 'lucide-react';
import { triggerSimulatedAttackApi } from '../../services/api';

interface AttackSimulatorModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onAttackTriggered: (alert: any) => void;
}

export const AttackSimulatorModal: React.FC<AttackSimulatorModalProps> = ({
  isOpen = true,
  onClose,
  onAttackTriggered
}) => {
  if (!isOpen) return null;

  const [attackType, setAttackType] = useState('DDoS_SYN_FLOOD_VOLUMETRIC');
  const [srcIp, setSrcIp] = useState('185.220.101.45');
  const [dstPort, setDstPort] = useState(80);
  const [isAttackActive, setIsAttackActive] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const progressTimerRef = useRef<any>(null);

  interface AttackProfile {
    id: string;
    layer: string;
    name: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    intensityPercent: number;
    threatScore: number;
    burstRate: string;
    desc: string;
    defaultIp: string;
    defaultPort: number;
    detectionSignature: string;
  }

  // Focus exclusively on TCP SYN Flood (Layer 4 Transport Layer) attack vectors & profiles
  const attacks: AttackProfile[] = [
    {
      id: 'DDoS_SYN_FLOOD_VOLUMETRIC',
      layer: 'Layer 4 (Transport)',
      name: '1. Volumetric TCP SYN Flood (High-Rate DoS)',
      severity: 'CRITICAL',
      intensityPercent: 96,
      threatScore: 9.8,
      burstRate: '16,400 pps',
      desc: 'Floods server with high-velocity half-open TCP SYN requests without completing the 3-way handshake. Rapidly exhausts the kernel TCB (Transmission Control Block) socket backlog queue.',
      defaultIp: '185.220.101.45',
      defaultPort: 80,
      detectionSignature: 'Abnormal SYN-to-ACK ratio (>99.4%), 14,000+ pps burst, empty 64-byte payload framing'
    },
    {
      id: 'DDoS_SYN_FLOOD_SPOOFED',
      layer: 'Layer 4 (Transport)',
      name: '2. Distributed Spoofed-Source TCP SYN Flood',
      severity: 'CRITICAL',
      intensityPercent: 92,
      threatScore: 9.5,
      burstRate: '24,800 pps',
      desc: 'Generates randomized, spoofed source IP addresses sending TCP SYN packets across multiple threads to bypass naive per-IP rate limits and starve server memory.',
      defaultIp: '194.26.29.110',
      defaultPort: 443,
      detectionSignature: 'High entropy in source IP distribution combined with zero ACK return traffic and fixed MSS=1460'
    },
    {
      id: 'DDoS_SYN_FLOOD_STEALTH',
      layer: 'Layer 4 (Transport)',
      name: '3. Low-Rate Stealth TCP SYN Accumulation',
      severity: 'HIGH',
      intensityPercent: 72,
      threatScore: 7.6,
      burstRate: '3,800 pps',
      desc: 'Transmits paced TCP SYN packets timed just below standard volume thresholds to silently hold connections in SYN_RECV state, slowly bleeding connection slots.',
      defaultIp: '45.154.255.88',
      defaultPort: 8080,
      detectionSignature: 'Persistent half-open TCP socket holding time, 0% ACK completion rate over rolling 10-second window'
    }
  ];

  const currentAttack = attacks.find(a => a.id === attackType) || attacks[0];

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  const handleSelectAttack = (attack: typeof attacks[0]) => {
    setAttackType(attack.id);
    setSrcIp(attack.defaultIp);
    setDstPort(attack.defaultPort);
  };

  const handleLaunch = async () => {
    setIsAttackActive(true);
    setResultMessage(null);
    setSimulationProgress(0);

    const totalDuration = 2600;
    const intervalMs = 40;
    const step = 100 / (totalDuration / intervalMs);

    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }

    progressTimerRef.current = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 98) return 98;
        return Math.min(100, +(prev + step).toFixed(1));
      });
    }, intervalMs);

    try {
      const startTime = Date.now();
      const res = await triggerSimulatedAttackApi(attackType, srcIp, Number(dstPort));
      
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(totalDuration - elapsed, 1000);

      setTimeout(() => {
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
        }
        setSimulationProgress(100);
        setIsAttackActive(false);
        if (res.success) {
          setResultMessage(res.message);
          onAttackTriggered(res.alert);
        } else {
          setResultMessage("Failed to execute simulated attack request.");
        }
      }, remainingTime);
    } catch (err) {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      setIsAttackActive(false);
      setResultMessage("Failed to execute simulated attack request.");
    }
  };

  // Dynamic Threat Intensity & Color Calculation:
  // Shifts continuously from Yellow (Hue ~ 52 deg) to Crimson Red (Hue ~ 0 deg)
  // When active: scales dynamically with simulation progress towards peak intensity
  // When idle: reflects the calibrated threat intensity of the selected attack
  const activeIntensity = isAttackActive
    ? Math.round(Math.min(100, Math.max(10, (simulationProgress / 100) * currentAttack.intensityPercent)))
    : currentAttack.intensityPercent;

  // Calculate dynamic hue shift:
  // Yellow (Medium / start): hue 52 (vibrant yellow #eab308)
  // Orange (High / mid): hue 28 (vibrant orange #f97316)
  // Red (Critical / peak): hue 0 (pure red #ef4444)
  const severityMaxShift = currentAttack.severity === 'CRITICAL' ? 52 : currentAttack.severity === 'HIGH' ? 36 : 18;
  const progressRatio = (isAttackActive ? simulationProgress : currentAttack.intensityPercent) / 100;
  const threatHue = Math.max(0, Math.round(52 - progressRatio * severityMaxShift));

  const dynamicThreatColor = `hsl(${threatHue}, 100%, 50%)`;
  const dynamicThreatBg = `hsla(${threatHue}, 100%, 50%, 0.14)`;
  const dynamicGlowColor = `hsla(${threatHue}, 100%, 50%, 0.6)`;

  let threatLevelBadge = {
    label: 'MODERATE SYN FLOOD',
    levelClass: 'text-yellow-400',
    borderClass: 'border-yellow-500/50',
    description: 'Elevated TCP SYN rate; kernel connection buffers filling'
  };
  if (currentAttack.severity === 'CRITICAL' || activeIntensity >= 85) {
    threatLevelBadge = {
      label: 'CRITICAL SYN SATURATION',
      levelClass: 'text-red-400',
      borderClass: 'border-red-500/60',
      description: 'Severe socket backlog exhaustion & automated iptables DROP engaged'
    };
  } else if (currentAttack.severity === 'HIGH' || activeIntensity >= 60) {
    threatLevelBadge = {
      label: 'HIGH-RATE SYN SPIKE',
      levelClass: 'text-orange-400',
      borderClass: 'border-orange-500/60',
      description: 'Persistent half-open TCP states & memory starvation risk'
    };
  }

  return (
    <div
      id="attack-simulator-backdrop"
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 transition-all duration-300 ${
        isAttackActive
          ? 'bg-rose-950/85 backdrop-blur-md animate-pulse'
          : 'bg-black/80 backdrop-blur-sm'
      }`}
    >
      <div
        id="attack-simulator-modal-card"
        className={`relative bg-zinc-950 rounded-xl sm:rounded-lg w-full max-w-xl max-h-[94vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isAttackActive
            ? 'border-2 border-rose-500 shadow-[0_0_60px_rgba(244,63,94,0.5)] ring-4 ring-rose-500/25'
            : 'border border-zinc-800'
        } animate-in fade-in zoom-in duration-200`}
      >
        {/* Living Pulse Background Effect when Attack Simulation is Active */}
        {isAttackActive && (
          <div
            id="attack-active-pulse-bg"
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
          >
            {/* Radial crimson pulse glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.35)_0%,_rgba(159,18,57,0.18)_50%,_transparent_100%)] animate-pulse" />
            {/* Energetic scanline pulse */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(244,63,94,0.12)_50%,transparent_100%)] bg-[length:100%_8px] animate-pulse" />
            {/* Inset perimeter pulse */}
            <div className="absolute inset-0 ring-inset ring-2 ring-rose-500/40 animate-pulse" />
          </div>
        )}

        {/* Active Attack Pulse Status Banner */}
        {isAttackActive && (
          <div
            id="attack-simulation-pulse-banner"
            className="bg-rose-950/95 border-b border-rose-500/60 px-3 sm:px-5 py-2 sm:py-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2 text-xs font-mono text-rose-200 animate-pulse relative z-10 shadow-lg shrink-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span className="font-bold text-rose-100 uppercase tracking-wider shrink-0 text-[11px] sm:text-xs">
                ATTACK ACTIVE:
              </span>
              <span className="text-[10px] sm:text-[11px] text-rose-300 truncate">
                Bursting malicious packets into gateway...
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] bg-rose-900/90 px-2 py-0.5 rounded border border-rose-500 font-bold uppercase tracking-widest text-rose-100 shrink-0">
              <Zap className="w-3 h-3 text-rose-300 animate-bounce" />
              <span>PULSING ACTIVE</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-black/90 px-3.5 sm:px-5 py-2.5 sm:py-3.5 border-b border-zinc-800 flex items-center justify-between shrink-0 relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 transition-colors ${
              isAttackActive
                ? 'bg-rose-500/30 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-rose-500/20 border-rose-500/30 text-rose-400'
            }`}>
              <Zap className={`w-4 h-4 fill-current ${isAttackActive ? 'animate-bounce text-rose-300' : 'animate-pulse'}`} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 truncate">
                <span className="truncate">TCP SYN Flood Simulator</span>
                {isAttackActive && (
                  <span className="text-[9px] sm:text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-mono font-bold animate-pulse shrink-0">
                    FLOODING
                  </span>
                )}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate">
                Simulate Transport Layer (L4) RFC 793 half-open connection floods
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded hover:bg-zinc-900 cursor-pointer shrink-0 ml-2"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Educational Scope Banner */}
        <div className="bg-zinc-900/60 border-b border-zinc-800 px-3.5 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-[11px] flex items-center justify-between font-mono shrink-0 relative z-10">
          <span className="text-emerald-400 font-semibold truncate">Target: TCP Transmission Control Block (TCB)</span>
          <span className="text-zinc-400 shrink-0 ml-2">Layer 4 (Transport / RFC 793)</span>
        </div>

        {/* Form Body - Scrollable on Mobile & Tablet */}
        <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-4 relative z-10 overflow-y-auto flex-1 min-h-0">
          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2 uppercase tracking-wider">
              Select TCP SYN Flood Vector Profile:
            </label>
            <div className="space-y-2 sm:space-y-2.5">
              {attacks.map(a => {
                const isSelected = attackType === a.id;
                return (
                  <div
                    key={a.id}
                    onClick={() => !isAttackActive && handleSelectAttack(a)}
                    className={`p-2.5 sm:p-3 rounded border text-xs transition-all ${
                      isAttackActive ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
                    } ${
                      isSelected
                        ? isAttackActive
                          ? 'bg-rose-950/40 border-rose-500 text-white shadow-sm'
                          : 'bg-zinc-900 border-white text-white shadow-sm'
                        : 'bg-black/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-bold mb-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="font-mono text-white text-xs">{a.name}</span>
                        <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0">
                          {a.layer}
                        </span>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold self-start sm:self-auto shrink-0 ${
                        a.severity === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                          : a.severity === 'HIGH'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          : 'bg-yellow-950 text-yellow-300 border border-yellow-800/60'
                      }`}>
                        {a.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed mb-1.5">{a.desc}</p>
                    <div className="text-[10px] font-mono text-zinc-500 bg-zinc-950/80 p-1.5 rounded border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="line-clamp-2 sm:line-clamp-none">
                        <span className="text-zinc-400 font-semibold">AI Signature:</span> {a.detectionSignature}
                      </div>
                      <span className="text-zinc-400 shrink-0 font-semibold">
                        Rate: {a.burstRate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Threat Intensity & Attack Simulation Progress Bar */}
          <div
            id="threat-intensity-progress-section"
            className="p-3 sm:p-3.5 bg-zinc-950/90 border border-zinc-800/90 rounded-lg space-y-2 sm:space-y-2.5 font-mono shadow-md"
          >
            {/* Header: Label, Live Color Indicator Badge, and Numeric Intensity Score */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Threat Intensity:</span>
                </span>
                {/* Dynamic 'threat intensity' color indicator shifting from yellow to red */}
                <div
                  id="dynamic-threat-intensity-indicator"
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold border transition-all duration-300"
                  style={{
                    backgroundColor: dynamicThreatBg,
                    borderColor: dynamicThreatColor,
                    color: dynamicThreatColor,
                    boxShadow: `0 0 10px ${dynamicGlowColor}`
                  }}
                >
                  <span
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isAttackActive ? 'animate-ping' : ''
                    }`}
                    style={{ backgroundColor: dynamicThreatColor }}
                  />
                  <span>{threatLevelBadge.label}</span>
                </div>
              </div>

              {/* Dynamic Score & Impact percentage */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-500 text-[10px]">
                  {isAttackActive ? `Simulating: ${Math.round(simulationProgress)}%` : 'Target Impact:'}
                </span>
                <span
                  className="font-bold text-sm transition-colors duration-300"
                  style={{ color: dynamicThreatColor }}
                >
                  {activeIntensity}%
                </span>
              </div>
            </div>

            {/* Dynamic Progress Bar Container */}
            <div className="space-y-1.5">
              <div className="h-4 bg-black rounded-full border border-zinc-800 p-0.5 relative overflow-hidden shadow-inner">
                {/* Dynamic Progress Bar Fill shifting from Yellow to Red */}
                <div
                  id="threat-intensity-progress-bar-fill"
                  className="h-full rounded-full transition-all duration-150 relative overflow-hidden flex items-center justify-end"
                  style={{
                    width: `${isAttackActive ? simulationProgress : activeIntensity}%`,
                    background: `linear-gradient(90deg, #facc15 0%, #f97316 50%, #ef4444 100%)`,
                    boxShadow: `0 0 16px ${dynamicGlowColor}`
                  }}
                >
                  {/* Sheen animation while attack simulation runs */}
                  {isAttackActive && (
                    <div className="absolute inset-0 bg-white/30 animate-pulse" />
                  )}
                  {/* Dynamic Glowing Threat Head Pointer */}
                  <div
                    className="w-3 h-3 rounded-full mr-0.5 transition-colors duration-200 shrink-0"
                    style={{
                      backgroundColor: dynamicThreatColor,
                      boxShadow: `0 0 8px 2px ${dynamicThreatColor}`
                    }}
                  />
                </div>
              </div>

              {/* Spectrum Reference Markers: Yellow (Medium) -> Orange (High) -> Red (Critical) */}
              <div className="grid grid-cols-3 text-[9px] sm:text-[10px] text-zinc-500 pt-0.5">
                <span className="flex items-center justify-start gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
                  <span className={currentAttack.severity === 'MEDIUM' ? 'text-yellow-300 font-bold' : ''}>
                    Yellow (Med)
                  </span>
                </span>
                <span className="flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                  <span className={currentAttack.severity === 'HIGH' ? 'text-orange-300 font-bold' : ''}>
                    Orange (High)
                  </span>
                </span>
                <span className="flex items-center justify-end gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                  <span className={currentAttack.severity === 'CRITICAL' ? 'text-red-300 font-bold' : ''}>
                    Red (Critical)
                  </span>
                </span>
              </div>
            </div>

            {/* Dynamic Status Detail Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-900 gap-1">
              <span className="truncate">{threatLevelBadge.description}</span>
              <span className="text-zinc-500 shrink-0 font-mono">
                Threat Score: <strong className="text-zinc-300">{currentAttack.threatScore}</strong> / 10
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
                Source Attacker IP:
              </label>
              <input
                type="text"
                disabled={isAttackActive}
                value={srcIp}
                onChange={e => setSrcIp(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded px-2.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-white disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-semibold text-zinc-300 mb-1 uppercase tracking-wider">
                Target Gateway Port:
              </label>
              <input
                type="number"
                disabled={isAttackActive}
                value={dstPort}
                onChange={e => setDstPort(Number(e.target.value))}
                className="w-full bg-black border border-zinc-800 rounded px-2.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-white disabled:opacity-60"
              />
            </div>
          </div>

          {resultMessage && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-700/80 rounded space-y-1.5 text-xs text-emerald-300 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold text-emerald-200">{resultMessage}</span>
              </div>
              <p className="text-[11px] text-emerald-300/80 pl-6">
                Packet burst logged to First-Layer Detection engine. Firewall rule auto-enforced and SOC dashboard telemetry updated.
              </p>
            </div>
          )}
        </div>

        {/* Modal Actions Footer - Responsive Stacking on Mobile */}
        <div className="bg-black/90 px-3.5 sm:px-5 py-2.5 sm:py-3 border-t border-zinc-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0 relative z-10">
          <span className="text-[10px] font-mono text-zinc-500 text-center sm:text-left">
            {isAttackActive
              ? `⚡ Active packet injection (${Math.round(simulationProgress)}%)...`
              : 'Triggers Real-time ML Inference + Firewall Auto-Block'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-3.5 py-2 sm:py-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer rounded border border-zinc-800 sm:border-transparent text-center min-h-[44px] sm:min-h-0 flex items-center justify-center"
            >
              {resultMessage ? 'Close' : 'Cancel'}
            </button>
            <button
              id="launch-simulated-attack-btn"
              onClick={handleLaunch}
              disabled={isAttackActive}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 sm:py-1.5 rounded font-mono text-xs font-bold transition-all cursor-pointer min-h-[44px] sm:min-h-0 ${
                isAttackActive
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 animate-pulse cursor-wait'
                  : 'bg-white hover:bg-zinc-200 text-black shadow-sm'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 fill-current ${isAttackActive ? 'animate-bounce text-yellow-300' : ''}`} />
              <span>
                {isAttackActive
                  ? `Simulating SYN Burst (${Math.round(simulationProgress)}%)...`
                  : 'Launch TCP SYN Flood'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
