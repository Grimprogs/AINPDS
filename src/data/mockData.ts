import {
  PacketData,
  ThreatFeedItem,
  VulnerabilityItem,
  ShapFeatureImportance,
  DatasetInfo,
  UserRole
} from '../types';

export const mockLivePackets: PacketData[] = [
  {
    id: "PKT-10842",
    timestamp: "11:41:02.102",
    srcIp: "185.220.101.45",
    srcPort: 49152,
    dstIp: "10.0.1.100",
    dstPort: 80,
    protocol: "TCP",
    length: 64,
    flags: ["SYN"],
    payloadPreview: "TCP SYN [Seq=0 Win=1024 Len=0 MSS=1460] - Half-Open Burst",
    prediction: "MALICIOUS",
    attackType: "DDoS_SYN_FLOOD",
    confidenceScore: 0.98,
    anomalyScore: 92.4,
    locationSrc: "Moscow, Russia",
    countryCode: "RU"
  },
  {
    id: "PKT-10841",
    timestamp: "11:41:01.890",
    srcIp: "192.168.1.52",
    srcPort: 54102,
    dstIp: "10.0.1.10",
    dstPort: 443,
    protocol: "HTTPS",
    length: 1240,
    flags: ["ACK", "PSH"],
    payloadPreview: "TLSv1.3 Application Data [Seq=1024 Ack=2048] - Verified Session",
    prediction: "NORMAL",
    attackType: "NORMAL",
    confidenceScore: 0.99,
    anomalyScore: 1.8,
    locationSrc: "Internal LAN",
    countryCode: "US"
  },
  {
    id: "PKT-10840",
    timestamp: "11:41:01.210",
    srcIp: "194.26.29.110",
    srcPort: 38210,
    dstIp: "10.0.1.100",
    dstPort: 443,
    protocol: "TCP",
    length: 64,
    flags: ["SYN"],
    payloadPreview: "TCP SYN [Seq=28491 Win=1024 Len=0 MSS=1460] - Half-Open SYN on Port 443",
    prediction: "MALICIOUS",
    attackType: "DDoS_SYN_FLOOD",
    confidenceScore: 0.97,
    anomalyScore: 89.4,
    locationSrc: "Frankfurt, Germany",
    countryCode: "DE"
  },
  {
    id: "PKT-10839",
    timestamp: "11:40:59.601",
    srcIp: "10.0.1.15",
    srcPort: 53110,
    dstIp: "8.8.8.8",
    dstPort: 53,
    protocol: "DNS",
    length: 128,
    flags: [],
    payloadPreview: "Standard Query 0x3a12 A gateway.internal.lan",
    prediction: "NORMAL",
    attackType: "NORMAL",
    confidenceScore: 0.99,
    anomalyScore: 1.2,
    locationSrc: "Internal LAN",
    countryCode: "US"
  },
  {
    id: "PKT-10838",
    timestamp: "11:40:58.412",
    srcIp: "185.220.101.45",
    srcPort: 38209,
    dstIp: "10.0.1.100",
    dstPort: 80,
    protocol: "TCP",
    length: 64,
    flags: ["SYN"],
    payloadPreview: "TCP SYN [Seq=10920 Win=1024 Len=0 MSS=1460] - Volumetric SYN Wave on Port 80",
    prediction: "MALICIOUS",
    attackType: "DDoS_SYN_FLOOD",
    confidenceScore: 0.98,
    anomalyScore: 93.1,
    locationSrc: "Moscow, Russia",
    countryCode: "RU"
  }
];

export const mockThreatFeeds: ThreatFeedItem[] = [
  {
    id: "TF-801",
    source: "AlienVault OTX",
    threatName: "Mirai Botnet Command Endpoint",
    indicator: "185.220.101.45",
    type: "IP",
    severity: "CRITICAL",
    firstSeen: "2026-08-04",
    riskScore: 95,
    description: "Active exit node participating in automated SYN flood attacks across Asia-Pacific and US Cloud Infrastructure."
  },
  {
    id: "TF-802",
    source: "AbuseIPDB",
    threatName: "Automated SQLi Probe Infrastructure",
    indicator: "45.154.255.88",
    type: "IP",
    severity: "HIGH",
    firstSeen: "2026-08-01",
    riskScore: 88,
    description: "Reported over 1,400 times for exploit attempt payloads targeting Nginx and Apache Web Servers."
  },
  {
    id: "TF-803",
    source: "NVD MITRE CVE",
    threatName: "CVE-2026-21804 (Remote Code Execution in Web Listener)",
    indicator: "CVE-2026-21804",
    type: "CVE",
    severity: "CRITICAL",
    firstSeen: "2026-07-29",
    riskScore: 98,
    description: "Unauthenticated deserialization flaw in legacy API gateway listeners allows remote shell execution."
  },
  {
    id: "TF-804",
    source: "MISP Threat Sharing",
    threatName: "LockBit 4.0 C2 Domain Callback",
    indicator: "c2.blackhat-sec.org",
    type: "DOMAIN",
    severity: "HIGH",
    firstSeen: "2026-08-03",
    riskScore: 92,
    description: "Encrypted HTTPS beaconing target identified in recent enterprise ransomware campaign."
  }
];

export const mockVulnerabilities: VulnerabilityItem[] = [
  {
    id: "VULN-301",
    cveId: "CVE-2026-1042",
    service: "OpenSSH Daemon (v8.2)",
    port: 22,
    cvssScore: 7.8,
    severity: "HIGH",
    title: "Key Exchange Timing Side-Channel Vulnerability",
    solution: "Upgrade OpenSSH package to version 9.1p1 or higher, enforce ED25519 public key auth.",
    status: "OPEN"
  },
  {
    id: "VULN-302",
    cveId: "CVE-2025-4819",
    service: "Internal Nginx Reverse Proxy",
    port: 80,
    cvssScore: 8.5,
    severity: "HIGH",
    title: "HTTP/2 Rapid Reset Request Exhaustion Flaw",
    solution: "Apply limit_req_zone directive and update Nginx binary build to patch release.",
    status: "OPEN"
  },
  {
    id: "VULN-303",
    cveId: "CVE-2024-3094",
    service: "xz-utils Compression Library",
    port: 443,
    cvssScore: 10.0,
    severity: "CRITICAL",
    title: "Malicious Backdoor in Upstream xz Tarball",
    solution: "Downgrade xz-utils to version 5.4.5 or replace liblzma runtime library.",
    status: "FIXED"
  }
];

export const mockShapFeatures: ShapFeatureImportance[] = [
  {
    feature: "syn_to_ack_ratio",
    displayName: "SYN-to-ACK Ratio",
    importanceValue: 0.342,
    localValue: +0.485,
    featureActualValue: "99.8%",
    description: "Extreme deviation where over 99% of packets are TCP SYN requests with virtually zero ACK completions."
  },
  {
    feature: "src_bytes",
    displayName: "Source Bytes Volume",
    importanceValue: 0.285,
    localValue: +0.412,
    featureActualValue: "64 bytes",
    description: "Unusually low source payload size relative to TCP packet headers indicates automated SYN flood framing."
  },
  {
    feature: "count",
    displayName: "5-Sec Connection Rate",
    importanceValue: 0.241,
    localValue: +0.380,
    featureActualValue: "16,400 pps",
    description: "Number of half-open connections to target host is 14x higher than normal baseline standard deviation."
  },
  {
    feature: "same_srv_rate",
    displayName: "Same Service Ratio",
    importanceValue: 0.124,
    localValue: +0.145,
    featureActualValue: "0.98",
    description: "Percentage of connections targeting the exact same port (Port 80 HTTP / Port 443 HTTPS)."
  },
  {
    feature: "dst_bytes",
    displayName: "Destination Bytes Response",
    importanceValue: 0.098,
    localValue: -0.052,
    featureActualValue: "0 bytes",
    description: "Zero bytes returned by server confirms TCP 3-way handshake was never finalized (Half-Open TCB State)."
  }
];

export const mockDatasets: DatasetInfo[] = [
  {
    id: "DS-CIC2017",
    name: "CICIDS2017 Clean Benchmark Dataset",
    recordsCount: 2830743,
    featuresCount: 78,
    normalCount: 2273097,
    maliciousCount: 557646,
    fileSize: "1.2 GB",
    lastUpdated: "2026-07-20",
    description: "Industry-standard full network packet capture dataset containing DDoS, Brute Force, SQLi, and Botnet traffic."
  },
  {
    id: "DS-NSLKDD",
    name: "NSL-KDD Refined Intrusions Dataset",
    recordsCount: 148517,
    featuresCount: 41,
    normalCount: 77054,
    maliciousCount: 71463,
    fileSize: "185 MB",
    lastUpdated: "2026-06-15",
    description: "Selected subset solving duplicate record bias of original KDD Cup 99, optimal for lightweight benchmarking."
  },
  {
    id: "DS-CUSTOM",
    name: "Live Cloud Run Campus Subnet Capture 2026",
    recordsCount: 512000,
    featuresCount: 54,
    normalCount: 480000,
    maliciousCount: 32000,
    fileSize: "340 MB",
    lastUpdated: "2026-08-04",
    description: "Custom PCAP dataset extracted from live edge sensor nodes during final project evaluation runs."
  }
];

export const mockUsers: UserRole[] = [
  {
    id: "USR-01",
    name: "A3",
    email: "a3@engineering.edu",
    role: "Admin",
    lastActive: "Just now",
    status: "ACTIVE"
  },
  {
    id: "USR-02",
    name: "Elena Rostova",
    email: "elena.rostova@soc-lab.org",
    role: "Security Analyst",
    lastActive: "12 mins ago",
    status: "ACTIVE"
  },
  {
    id: "USR-03",
    name: "David Chen",
    email: "d.chen@incident-response.com",
    role: "Incident Responder",
    lastActive: "2 hours ago",
    status: "ACTIVE"
  },
  {
    id: "USR-04",
    name: "Prof. Marcus Thorne",
    email: "m.thorne@engineering.edu",
    role: "Auditor",
    lastActive: "Yesterday",
    status: "ACTIVE"
  }
];
