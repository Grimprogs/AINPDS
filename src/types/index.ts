export type ThreatSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type AlertStatus = 'ACTIVE' | 'INVESTIGATING' | 'MITIGATED' | 'FALSE_POSITIVE';

export type AttackType = 
  | 'DDoS_SYN_FLOOD'
  | 'SQL_INJECTION'
  | 'PORT_SCAN'
  | 'SSH_BRUTE_FORCE'
  | 'RANSOMWARE_C2'
  | 'XSS_ATTACK'
  | 'UDP_FLOOD'
  | 'NORMAL';

export interface PacketData {
  id: string;
  timestamp: string;
  srcIp: string;
  srcPort: number;
  dstIp: string;
  dstPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'DNS' | 'SSH';
  length: number;
  flags: string[];
  payloadPreview: string;
  prediction: 'NORMAL' | 'MALICIOUS';
  attackType: AttackType;
  confidenceScore: number; // 0 to 1
  anomalyScore: number;
  locationSrc?: string;
  countryCode?: string;
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  title: string;
  severity: ThreatSeverity;
  status: AlertStatus;
  srcIp: string;
  dstIp: string;
  dstPort: number;
  attackType: AttackType;
  confidence: number;
  description: string;
  mitigationStatus: 'AUTOMATICALLY_BLOCKED' | 'PENDING_REVIEW' | 'RULE_APPLIED' | 'MONITORED';
  affectedAsset: string;
  packetId?: string;
  aiAnalysis?: string;
}

export interface FirewallRule {
  id: string;
  name: string;
  direction: 'INBOUND' | 'OUTBOUND';
  action: 'ALLOW' | 'DENY' | 'DROP' | 'REJECT';
  protocol: 'ALL' | 'TCP' | 'UDP' | 'ICMP';
  sourceIp: string;
  sourcePort: string;
  destIp: string;
  destPort: string;
  enabled: boolean;
  hitsCount: number;
  createdDate: string;
  comment: string;
}

export interface BlockedIpEntry {
  ip: string;
  blockedAt: string;
  expiresAt: string;
  reason: string;
  attackType: AttackType;
  country: string;
  autoBlocked: boolean;
}

export interface MLModelInfo {
  id: string;
  name: string;
  algorithm: 'Random Forest' | 'XGBoost Classifier' | 'Deep Neural Network' | 'Decision Tree' | 'Isolation Forest';
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainedDate: string;
  datasetUsed: string;
  status: 'PRODUCTION' | 'STANDBY' | 'TRAINING' | 'DEPRECATED';
  latencyMs: number;
}

export interface ShapFeatureImportance {
  feature: string;
  displayName: string;
  importanceValue: number; // Global mean |SHAP|
  localValue: number; // Local SHAP value for specific packet
  featureActualValue: string | number;
  description: string;
}

export interface DatasetInfo {
  id: string;
  name: string;
  recordsCount: number;
  featuresCount: number;
  normalCount: number;
  maliciousCount: number;
  fileSize: string;
  lastUpdated: string;
  description: string;
}

export interface SystemHealthMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkThroughputMbps: number;
  packetsPerSecond: number;
  activeSensorsCount: number;
  sensorHealthPercent: number;
  uptimeSeconds: number;
  captureEngineStatus: 'RUNNING' | 'DEGRADED' | 'STOPPED';
}

export interface UserRole {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Security Analyst' | 'Incident Responder' | 'Auditor';
  lastActive: string;
  status: 'ACTIVE' | 'INACTIVE';
  avatarUrl?: string;
}

export interface ThreatFeedItem {
  id: string;
  source: string;
  threatName: string;
  indicator: string;
  type: 'IP' | 'DOMAIN' | 'HASH' | 'CVE';
  severity: ThreatSeverity;
  firstSeen: string;
  riskScore: number;
  description: string;
}

export interface VulnerabilityItem {
  id: string;
  cveId: string;
  service: string;
  port: number;
  cvssScore: number;
  severity: ThreatSeverity;
  title: string;
  solution: string;
  status: 'OPEN' | 'FIXED' | 'MITIGATED' | 'IGNORED';
}
