import {
  SecurityAlert,
  FirewallRule,
  BlockedIpEntry,
  MLModelInfo,
  SystemHealthMetrics,
  AlertStatus
} from '../types';
import { mockLivePackets } from '../data/mockData';

export async function fetchSystemHealthApi(): Promise<SystemHealthMetrics> {
  try {
    const res = await fetch('/api/system/health');
    if (!res.ok) throw new Error('Health fetch failed');
    return await res.json();
  } catch (err) {
    return {
      cpuUsage: 28,
      memoryUsage: 44,
      diskUsage: 32,
      networkThroughputMbps: 152.4,
      packetsPerSecond: 3950,
      activeSensorsCount: 4,
      sensorHealthPercent: 99.4,
      uptimeSeconds: 850120,
      captureEngineStatus: 'RUNNING'
    };
  }
}

export async function fetchAlertsApi(): Promise<SecurityAlert[]> {
  try {
    const res = await fetch('/api/alerts');
    if (!res.ok) throw new Error('Alerts fetch failed');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function fetchPacketsApi(): Promise<any[]> {
  try {
    const res = await fetch('/api/packets');
    if (!res.ok) throw new Error('Packets fetch failed');
    return await res.json();
  } catch (err) {
    return mockLivePackets;
  }
}

export async function updateAlertStatusApi(id: string, status: AlertStatus) {
  const res = await fetch(`/api/alerts/${id}/update-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return await res.json();
}

export async function triggerSimulatedAttackApi(attackType: string, srcIp?: string, dstPort?: number) {
  const res = await fetch('/api/traffic/simulate-attack', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ attackType, srcIp, dstPort })
  });
  return await res.json();
}

export async function fetchFirewallRulesApi(): Promise<FirewallRule[]> {
  try {
    const res = await fetch('/api/firewall/rules');
    if (!res.ok) throw new Error('Firewall rules fetch failed');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function createFirewallRuleApi(rule: Partial<FirewallRule>) {
  const res = await fetch('/api/firewall/rules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rule)
  });
  return await res.json();
}

export async function toggleFirewallRuleApi(id: string) {
  const res = await fetch(`/api/firewall/rules/${id}/toggle`, {
    method: 'POST'
  });
  return await res.json();
}

export async function deleteFirewallRuleApi(id: string) {
  const res = await fetch(`/api/firewall/rules/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

export async function fetchBlockedIpsApi(): Promise<BlockedIpEntry[]> {
  try {
    const res = await fetch('/api/ip/blocked');
    if (!res.ok) throw new Error('Blocked IPs fetch failed');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function unblockIpApi(ip: string) {
  const res = await fetch('/api/ip/unblock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ip })
  });
  return await res.json();
}

export async function fetchModelsApi(): Promise<MLModelInfo[]> {
  try {
    const res = await fetch('/api/ai/models');
    if (!res.ok) throw new Error('AI Models fetch failed');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function trainModelApi(algorithm: string, hyperparameters: any, datasetId: string) {
  const res = await fetch('/api/ai/train-model', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ algorithm, hyperparameters, datasetId })
  });
  return await res.json();
}

export async function activateModelApi(modelId: string) {
  const res = await fetch('/api/ai/activate-model', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modelId })
  });
  return await res.json();
}

export async function analyzeThreatWithGeminiApi(alertId?: string, attackDetails?: any) {
  const res = await fetch('/api/gemini/analyze-threat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alertId, attackDetails })
  });
  return await res.json();
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

export async function sendChatMessageApi(params: {
  messages: ChatMessage[];
  role: string;
  modelPreference?: string;
  complexity?: 'fast' | 'general' | 'complex';
}): Promise<{ reply: string; modelUsed: string; roleUsed: string }> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to get response from Gemini Copilot');
  }
  return await res.json();
}

// ==========================================
// VEO VIDEO GENERATION & BACKGROUND API
// ==========================================

export interface BackgroundPreset {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  suggestedPrompt: string;
  aspectRatio: '16:9' | '9:16';
  category: string;
}

export interface VeoGenerateResponse {
  operationName: string;
  modelUsed: string;
  aspectRatio: '16:9' | '9:16';
  isRealVeo: boolean;
}

export interface VeoStatusResponse {
  done: boolean;
  progress: number;
  stage?: string;
  metadata?: any;
  isRealVeo?: boolean;
}

export async function getBackgroundPresetsApi(): Promise<{ presets: BackgroundPreset[] }> {
  const res = await fetch('/api/presets/backgrounds');
  if (!res.ok) {
    return {
      presets: [
        {
          id: 'preset-soc-center',
          title: 'Cyber Defense SOC Operations Center',
          description: 'Futuristic multi-screen cyber command deck with glowing network topology.',
          imageUrl: '/assets/images/cyber_soc_center_1790016152073.jpg',
          suggestedPrompt: 'Subtle ambient cyber network particle flows, glowing data streams pulsing through network nodes',
          aspectRatio: '16:9',
          category: 'Operations Center'
        },
        {
          id: 'preset-firewall-shield',
          title: 'Perimeter Firewall & Shield Grid',
          description: 'First-Layer active defense shield grid with glowing packet fibers.',
          imageUrl: '/assets/images/perimeter_firewall_grid_1790016177500.jpg',
          suggestedPrompt: 'Digital perimeter firewall mesh pulsing with energetic defensive waves along fiber optic lines',
          aspectRatio: '16:9',
          category: 'Perimeter Defense'
        }
      ]
    };
  }
  return await res.json();
}

export async function generateVeoVideoApi(params: {
  prompt: string;
  imageBase64: string;
  mimeType?: string;
  aspectRatio: '16:9' | '9:16';
}): Promise<VeoGenerateResponse> {
  const res = await fetch('/api/generate-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to start Veo video generation');
  }
  return await res.json();
}

export async function checkVeoVideoStatusApi(operationName: string): Promise<VeoStatusResponse> {
  const res = await fetch('/api/video-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operationName })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to check Veo status');
  }
  return await res.json();
}

export async function downloadVeoVideoBlobApi(operationName: string): Promise<Blob> {
  const res = await fetch('/api/video-download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operationName })
  });
  if (!res.ok) {
    throw new Error('Failed to download video stream');
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    // Simulated JSON response fallback
    const data = await res.json();
    // Return a dummy empty blob with simulated flag
    return new Blob([JSON.stringify(data)], { type: 'application/json' });
  }
  return await res.blob();
}

