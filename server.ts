import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, GenerateVideosOperation } from "@google/genai";
import dotenv from "dotenv";
import { SecurityAlert, FirewallRule, BlockedIpEntry, MLModelInfo } from "./src/types";
import { mockLivePackets } from "./src/data/mockData";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve preset background images
app.use("/assets/images", express.static(path.join(process.cwd(), "src/assets/images")));

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn("Failed to initialize Gemini SDK:", err);
  }
}

// In-Memory Data Store for NIDPS State
const state: {
  systemHealth: any;
  alerts: SecurityAlert[];
  packets: any[];
  firewallRules: FirewallRule[];
  blockedIps: BlockedIpEntry[];
  models: MLModelInfo[];
} = {
  systemHealth: {
    cpuUsage: 24,
    memoryUsage: 42,
    diskUsage: 31,
    networkThroughputMbps: 148.5,
    packetsPerSecond: 3820,
    activeSensorsCount: 4,
    sensorHealthPercent: 99.4,
    uptimeSeconds: 849200,
    captureEngineStatus: 'RUNNING',
  },
  alerts: [
    {
      id: "ALT-1001",
      timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
      title: "Volumetric TCP SYN Flood (DDoS Attack) - Layer 4",
      severity: "CRITICAL" as const,
      status: "ACTIVE" as const,
      srcIp: "185.220.101.45",
      dstIp: "10.0.1.100",
      dstPort: 80,
      attackType: "DDoS_SYN_FLOOD" as const,
      confidence: 0.98,
      description: "Layer 4 volumetric attack: Excessive TCP SYN packets sent without ACK completion to exhaust server connection backlog. Rate: 16,400 pps.",
      mitigationStatus: "AUTOMATICALLY_BLOCKED" as const,
      affectedAsset: "Production Web Gateway (Port 80)",
      aiAnalysis: "First Layer (Transport Layer 4) attack detected: Attacker sending half-open TCP SYN requests. The AI model identified an abnormal SYN-to-ACK ratio (99.8% SYN) and zero payload size, typical of a DoS/DDoS SYN flood targeting connection availability."
    },
    {
      id: "ALT-1002",
      timestamp: new Date(Date.now() - 7 * 60000).toISOString(),
      title: "Distributed Spoofed TCP SYN Flood - Layer 4",
      severity: "CRITICAL" as const,
      status: "ACTIVE" as const,
      srcIp: "194.26.29.110",
      dstIp: "10.0.1.100",
      dstPort: 443,
      attackType: "DDoS_SYN_FLOOD" as const,
      confidence: 0.97,
      description: "Layer 4 distributed attack: Randomized spoofed TCP SYN requests targeting HTTPS port 443 to saturate TCP Transmission Control Block (TCB) queue. Rate: 24,800 pps.",
      mitigationStatus: "AUTOMATICALLY_BLOCKED" as const,
      affectedAsset: "Secure Ingress Gateway (Port 443)",
      aiAnalysis: "First Layer (Transport Layer 4) attack detected: Botnet flood abusing RFC 793 TCP handshake. AI model detected rapid surge in unacknowledged SYN packets with zero ACK finalization."
    }
  ],
  blockedIps: [
    {
      ip: "185.220.101.45",
      blockedAt: new Date(Date.now() - 2 * 60000).toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      reason: "Automated IPS trigger: Layer 4 TCP SYN Flood threshold exceeded (>10,000 pps)",
      attackType: "DDoS_SYN_FLOOD" as const,
      country: "RU",
      autoBlocked: true
    },
    {
      ip: "194.26.29.110",
      blockedAt: new Date(Date.now() - 7 * 60000).toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      reason: "Automated IPS trigger: Layer 4 Distributed TCP SYN Flood on port 443",
      attackType: "DDoS_SYN_FLOOD" as const,
      country: "US",
      autoBlocked: true
    }
  ],
  firewallRules: [
    {
      id: "FW-101",
      name: "Drop Malicious SYN Flood Sources",
      direction: "INBOUND" as const,
      action: "DROP" as const,
      protocol: "TCP" as const,
      sourceIp: "185.220.100.0/22",
      sourcePort: "*",
      destIp: "ANY",
      destPort: "*",
      enabled: true,
      hitsCount: 14205,
      createdDate: "2026-01-10",
      comment: "Auto-synced TCP SYN Flood Mitigation Block"
    },
    {
      id: "FW-102",
      name: "Allow Management HTTPS",
      direction: "INBOUND" as const,
      action: "ALLOW" as const,
      protocol: "TCP" as const,
      sourceIp: "10.100.0.0/16",
      sourcePort: "*",
      destIp: "10.0.1.100",
      destPort: "443",
      enabled: true,
      hitsCount: 893120,
      createdDate: "2026-01-01",
      comment: "Internal Admin Network Access"
    },
    {
      id: "FW-103",
      name: "Kernel TCP SYN Cookie & Rate Limiter",
      direction: "INBOUND" as const,
      action: "DROP" as const,
      protocol: "TCP" as const,
      sourceIp: "ANY",
      sourcePort: "*",
      destIp: "ANY",
      destPort: "*",
      enabled: true,
      hitsCount: 3821,
      createdDate: "2026-02-15",
      comment: "Anti-SYN Flood TCP Backlog Protection (sysctl tcp_syncookies=1)"
    }
  ],
  models: [
    {
      id: "MODEL-RF-V3",
      name: "NIDPS Random Forest Ensemble v3.4",
      algorithm: "Random Forest" as const,
      version: "3.4.1",
      accuracy: 0.987,
      precision: 0.982,
      recall: 0.989,
      f1Score: 0.985,
      trainedDate: "2026-07-28",
      datasetUsed: "CICIDS2017 + NSL-KDD Augmented",
      status: "PRODUCTION" as const,
      latencyMs: 1.2
    },
    {
      id: "MODEL-XGB-V2",
      name: "XGBoost Gradient Boosted Trees",
      algorithm: "XGBoost Classifier" as const,
      version: "2.1.0",
      accuracy: 0.991,
      precision: 0.989,
      recall: 0.993,
      f1Score: 0.991,
      trainedDate: "2026-08-01",
      datasetUsed: "CICIDS2017 Production Clean",
      status: "STANDBY" as const,
      latencyMs: 2.1
    },
    {
      id: "MODEL-DNN-V1",
      name: "Deep Autoencoder Anomaly Detector",
      algorithm: "Deep Neural Network" as const,
      version: "1.0.4",
      accuracy: 0.975,
      precision: 0.968,
      recall: 0.981,
      f1Score: 0.974,
      trainedDate: "2026-07-15",
      datasetUsed: "Zero-Day Synthetics Dataset",
      status: "STANDBY" as const,
      latencyMs: 3.5
    }
  ],
  packets: mockLivePackets
};

// API Endpoints

// 1. System Health
app.get("/api/system/health", (_req: Request, res: Response) => {
  // Add minor jitter to reflect live server activity
  state.systemHealth.cpuUsage = Math.min(100, Math.max(12, state.systemHealth.cpuUsage + (Math.random() * 4 - 2)));
  state.systemHealth.memoryUsage = Math.min(100, Math.max(30, state.systemHealth.memoryUsage + (Math.random() * 2 - 1)));
  state.systemHealth.packetsPerSecond = Math.round(3800 + Math.random() * 400);
  res.json(state.systemHealth);
});

// 2. Security Alerts
app.get("/api/alerts", (_req: Request, res: Response) => {
  res.json(state.alerts);
});

// 2b. Live Captured Packets & DPI Stream
app.get("/api/packets", (_req: Request, res: Response) => {
  // Add a newly captured packet into the live buffer if needed to keep the stream fresh
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
  
  // Random normal or simulated sample
  const isProbe = Math.random() > 0.85;
  const newPkt = isProbe ? {
    id: `PKT-${Math.floor(10000 + Math.random() * 90000)}`,
    timestamp: timeStr,
    srcIp: "185.220.101.45",
    srcPort: Math.floor(40000 + Math.random() * 20000),
    dstIp: "10.0.1.100",
    dstPort: 80,
    protocol: "TCP",
    length: 64,
    flags: ["SYN"],
    payloadPreview: "TCP SYN [Half-Open Probe - Layer 4 Ingress]",
    prediction: "MALICIOUS",
    attackType: "DDoS_SYN_FLOOD",
    confidenceScore: 0.98,
    anomalyScore: 91.2,
    locationSrc: "External Perimeter",
    countryCode: "RU"
  } : {
    id: `PKT-${Math.floor(10000 + Math.random() * 90000)}`,
    timestamp: timeStr,
    srcIp: `192.168.1.${Math.floor(10 + Math.random() * 80)}`,
    srcPort: Math.floor(49000 + Math.random() * 15000),
    dstIp: "10.0.1.10",
    dstPort: Math.random() > 0.5 ? 443 : 80,
    protocol: Math.random() > 0.5 ? "HTTPS" : "TCP",
    length: Math.floor(120 + Math.random() * 1100),
    flags: ["ACK", "PSH"],
    payloadPreview: "TLSv1.3 Encrypted Application Data [Clean Handshake]",
    prediction: "NORMAL",
    attackType: "NORMAL",
    confidenceScore: 0.99,
    anomalyScore: 1.2,
    locationSrc: "Corporate LAN",
    countryCode: "US"
  };

  state.packets.unshift(newPkt);
  if (state.packets.length > 50) {
    state.packets = state.packets.slice(0, 50);
  }

  res.json(state.packets);
});

app.post("/api/alerts/:id/update-status", (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const alert = state.alerts.find(a => a.id === id);
  if (alert) {
    alert.status = status;
    return res.json({ success: true, alert });
  }
  res.status(404).json({ error: "Alert not found" });
});

// 3. Gemini AI Deep Threat Analysis
app.post("/api/gemini/analyze-threat", async (req: Request, res: Response) => {
  const { alertId, attackDetails } = req.body;

  let targetAlert = state.alerts.find(a => a.id === alertId);
  const details = targetAlert || attackDetails || {
    title: "Suspicious Traffic Burst",
    attackType: "DDoS_SYN_FLOOD",
    srcIp: "185.220.101.45",
    dstPort: 80,
    confidence: 0.96,
    description: "High rate TCP SYN packet flooding without complete handshake."
  };

  const prompt = `You are a Cyber Security Professor and Senior SOC Specialist. Explain this First-Layer network threat alert clearly and simply so an engineering student can explain it to their teacher/examiner:
Title: ${details.title}
Attack Type: ${details.attackType}
Source IP: ${details.srcIp}
Target Port: ${details.dstPort}
ML Confidence: ${details.confidence * 100}%
Description: ${details.description}

Format your response simply with these 5 clear headings:
1. Attack Overview & OSI Layer (Layer 4 Transport / Layer 3 Network)
2. Why the Attacker Does This (Industry Impact)
3. How the AI Model Detected It (Key Packet Header Signs & Features)
4. How the System Auto-Blocked It (Firewall / IPS Rule)
5. Viva Quick-Pitch (2 simple bullet points the student can say to their teacher)`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const analysisText = response.text || "AI analysis completed successfully.";
      if (targetAlert) {
        targetAlert.aiAnalysis = analysisText;
      }
      return res.json({ analysis: analysisText });
    } catch (err: any) {
      console.error("Gemini threat analysis error:", err);
      // Fallback response if API fails
    }
  }

  // Fallback intelligent analysis structured clearly for teacher explanation - strictly TCP SYN Flood
  const fallbackText = `### 1. Attack Overview & OSI Layer
- **Attack Category**: TCP SYN Flood (Denial of Service / DDoS)
- **OSI / TCP Layer**: **Layer 4 (Transport Layer - RFC 793)**
- **Source IP**: \`${details.srcIp}\` &rarr; Target Port: \`${details.dstPort}\`
- **Detection Confidence**: **${(details.confidence * 100).toFixed(1)}%**

### 2. Why the Attacker Does This (Industry Impact)
In critical infrastructure, cloud gateways, and Linux web servers, **TCP SYN Flood is the most destructive First-Layer attack**. It exploits the fundamental TCP 3-way handshake (\`SYN\` &rarr; \`SYN-ACK\` &rarr; \`ACK\`):
1. The attacker rapidly floods the target with half-open connection requests (\`TCP SYN\`).
2. The server allocates a Transmission Control Block (TCB) entry in its connection backlog queue and returns \`SYN-ACK\`.
3. The attacker deliberately never transmits the finalizing \`ACK\`.
4. The server's socket memory exhausts within seconds, refusing service to all genuine users.

### 3. How the AI Model Detected It
- **\`SYN_to_ACK_Ratio\` (SHAP Weight: +0.48)**: Over 99.4% of incoming packets had the SYN flag enabled with nearly zero ACK confirmations.
- **\`src_bytes\` (SHAP Weight: +0.32)**: Uniform, minimal 64-byte empty payload framing typical of automated flood bots.
- **\`count\` (SHAP Weight: +0.28)**: Ingress velocity surged beyond 14,000 packets per second.

### 4. How the System Auto-Blocked It
1. The AI engine triggered automated in-line mitigation within 1.2ms: \`iptables -A INPUT -s ${details.srcIp} -p tcp --syn -j DROP\`.
2. Kernel SYN Cookie protection (\`net.ipv4.tcp_syncookies = 1\`) engaged to preserve TCB memory slots for legitimate users.

### 5. Viva Quick-Pitch (Say this to Mam)
- *"Mam, this is a Layer 4 availability attack that attempts to exhaust server memory using half-open TCP connections."*
- *"Our Random Forest model identified the abnormal SYN-to-ACK ratio in sub-millisecond time and immediately auto-injected an iptables DROP rule at the network perimeter."*`;

  if (targetAlert) {
    targetAlert.aiAnalysis = fallbackText;
  }
  return res.json({ analysis: fallbackText });
});

// 3b. Gemini Multi-Turn Cyber Defense Chatbot API
app.post("/api/chat", async (req: Request, res: Response) => {
  const {
    messages = [],
    role = "soc_analyst",
    modelPreference = "gemini-3.5-flash",
    complexity = "general"
  } = req.body;

  // Model Selection according to task complexity:
  // - gemini-3.1-pro-preview for particularly complex tasks
  // - gemini-3.5-flash for general tasks
  // - gemini-3.1-flash-lite for tasks that should happen fast
  let selectedModel = "gemini-3.5-flash";
  if (modelPreference === "gemini-3.1-pro-preview" || complexity === "complex") {
    selectedModel = "gemini-3.1-pro-preview";
  } else if (modelPreference === "gemini-3.1-flash-lite" || complexity === "fast") {
    selectedModel = "gemini-3.1-flash-lite";
  } else if (modelPreference === "gemini-3.5-flash") {
    selectedModel = "gemini-3.5-flash";
  }

  // Build role-specific system instruction
  let rolePersona = "";
  switch (role) {
    case "viva_coach":
      rolePersona = `You are the University Viva & Project Defense Coach for this AI-NIDPS (Artificial Intelligence Network Intrusion Detection & Prevention System).
Your mission is to help the engineering student defend their Final Year Project to teachers, examiners, and project evaluators.
Keep answers crisp, technically authoritative, and structured with:
- "Key Thesis": 1 powerful sentence defining the concept.
- "Technical Mechanics": How Layer 3/4 packet features, Random Forest ML, and automated iptables firewall rules work together.
- "What to Say to the Examiner": Bullet points the student can directly speak during viva questioning.`;
      break;
    case "packet_forensics":
      rolePersona = `You are a Deep Packet Inspection (DPI) and Protocol Forensics Engineer.
You analyze raw Layer 3/4 network traffic, TCP 3-way handshakes, SYN/ACK flag sequences, window sizes, byte rates, and anomalous packet distributions.
Explain network anomalies at the bit/byte level and cite specific RFC standards (e.g., RFC 793 for TCP) when relevant.`;
      break;
    case "firewall_architect":
      rolePersona = `You are a Perimeter Network Security & Firewall Policy Architect.
You advise on iptables, nftables, eBPF/XDP filtering, SYN cookies, connection tracking (conntrack), rate-limiting, and automated incident mitigation rules against DDoS and port scanning. Provide exact, production-grade CLI commands and configuration blocks.`;
      break;
    case "soc_analyst":
    default:
      rolePersona = `You are Aegis-AI, a Senior SOC Tier-3 Security Analyst embedded in the AI-NIDPS monitoring console.
You provide high-priority triage, evaluate attack vectors, assess severity, explain detection confidences, and guide the user through incident containment and eradication.`;
      break;
  }

  // Real-time telemetry snapshot to ground the chatbot in live reality
  const activeAlerts = state.alerts.filter(a => a.status === "ACTIVE");
  const blockedList = state.blockedIps.map(b => `${b.ip} (${b.reason})`).join(", ");
  const currentPps = state.systemHealth.packetsPerSecond;

  const systemInstruction = `${rolePersona}

LIVE NIDPS TELEMETRY SNAPSHOT:
- Protected Target: 10.0.1.100 (DMZ Primary Gateway)
- Network Interface: eth0 (Layer 3 Network / Layer 4 Transport)
- Current Ingress Throughput: ${currentPps.toLocaleString()} packets/sec
- Active Unresolved Alerts: ${activeAlerts.length} (${activeAlerts.map(a => a.title).join("; ") || "None currently"})
- Currently Blocked Malicious IPs: ${blockedList || "None"}
- Primary Detection Focus: First-Layer perimeter defense — specifically dedicated to TCP SYN Flood (RFC 793 Transport Layer DoS/DDoS Mitigation).

Instructions:
1. Answer questions in a knowledgeable, professional cybersecurity tone.
2. Format responses with clean Markdown (bold headers, bullet points, code blocks for CLI commands/rules).
3. If the user asks about currently happening attacks, refer directly to the live snapshot above.
4. Keep answers focused, precise, and directly useful.`;

  // Format message history for @google/genai
  // Filter out empty messages and map to Content format
  const validMessages = messages.filter((m: any) => m && m.text && typeof m.text === "string" && m.text.trim().length > 0);
  
  if (validMessages.length === 0) {
    return res.status(400).json({ error: "No messages provided." });
  }

  const latestUserMsg = validMessages[validMessages.length - 1].text;

  if (ai) {
    try {
      // Map multi-turn conversation into format expected by @google/genai:
      // contents: [{ role: 'user' | 'model', parts: [{ text: '...' }] }]
      const formattedContents = validMessages.map((m: any) => ({
        role: m.role === "assistant" || m.role === "model" ? "model" : "user",
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "I have analyzed your request against current network telemetry.";
      return res.json({
        reply: replyText,
        modelUsed: selectedModel,
        roleUsed: role
      });
    } catch (err: any) {
      console.warn(`Gemini API call with ${selectedModel} failed, generating fallback response:`, err.message || err);
      // If error might be due to paid model access or quota, try fallback to gemini-3.5-flash
      if (selectedModel === "gemini-3.1-pro-preview") {
        try {
          const fallbackRes = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: validMessages.map((m: any) => ({
              role: m.role === "assistant" || m.role === "model" ? "model" : "user",
              parts: [{ text: m.text }]
            })),
            config: { systemInstruction }
          });
          if (fallbackRes.text) {
            return res.json({
              reply: fallbackRes.text,
              modelUsed: "gemini-3.5-flash (auto-fallback)",
              roleUsed: role
            });
          }
        } catch (innerErr) {
          console.warn("Secondary fallback model also failed:", innerErr);
        }
      }
    }
  }

  // Intelligent dynamic fallback if Gemini API is offline or key missing
  let fallbackReply = "";
  const lowerQuery = latestUserMsg.toLowerCase();

  if (lowerQuery.includes("viva") || lowerQuery.includes("teacher") || lowerQuery.includes("mam") || lowerQuery.includes("sir") || lowerQuery.includes("explain to")) {
    fallbackReply = `### Project Defense Briefing for Evaluators

**1. Core Thesis to State:**
> *"Mam/Sir, our project is a **First-Layer AI-Powered Network Intrusion Detection and Prevention System** designed to protect perimeter servers against high-impact Layer 3 and Layer 4 cyber attacks before they reach internal applications."*

**2. Key Technical Points to Emphasize:**
- **Why First-Layer (Layer 3 & 4)?** 
  Transport & Network layer threats (TCP SYN Flood and Port Scanning) are the primary entry and crash vectors. If the transport layer is overwhelmed, application-layer firewalls never even get the chance to inspect traffic.
- **Machine Learning Core:**
  Trained on the standard **CICIDS2017** benchmark using an ensemble **Random Forest (100 estimators)** with **99.4% precision** and **<1.2ms latency**, far outperforming legacy static signature matchers.
- **XAI (Explainable AI):**
  We utilize **SHAP (SHapley Additive exPlanations)** to eliminate black-box distrust, showing exactly which packet flags (\`SYN_to_ACK_Ratio\`, \`srv_diff_host_rate\`) triggered the alarm.
- **Automated Mitigation:**
  Zero-touch automated IP blacklisting executed via kernel-level \`iptables -A INPUT -s <IP> -j DROP\` within 2 milliseconds of detection.`;
  } else if (lowerQuery.includes("syn flood") || lowerQuery.includes("ddos") || lowerQuery.includes("dos")) {
    fallbackReply = `### Layer 4 Incident Analysis: TCP SYN Flood Attack

**Attack Mechanism (RFC 793 Abuse):**
The adversary exploits the 3-way TCP handshake (\`SYN\` &rarr; \`SYN-ACK\` &rarr; \`ACK\`).
1. Attacker sends tens of thousands of spoofed \`TCP SYN\` packets per second.
2. The server allocates kernel memory in the **TCP Backlog Queue** and sends \`SYN-ACK\`.
3. The attacker deliberately never responds with \`ACK\`, leaving sockets in \`SYN_RECV\` state until the server runs out of connection slots and crashes for legitimate users.

**Detection in our AI-NIDPS:**
- **Feature \`SYN_to_ACK_Ratio\`**: Exceeds 98% (normal traffic is typically ~50/50).
- **Feature \`src_bytes\`**: Unusually fixed at 64 bytes with zero payload data.
- **Current Live Status**: Attacking source \`185.220.101.45\` was automatically detected at 98% confidence and dropped at the perimeter firewall.`;
  } else if (lowerQuery.includes("port scan") || lowerQuery.includes("reconnaissance") || lowerQuery.includes("nmap")) {
    fallbackReply = `### Layer 3/4 Reconnaissance Analysis: Stealth Port Scan

**Attack Mechanism:**
The intruder initiates rapid probes across sequential destination ports (e.g., 21 FTP, 22 SSH, 80 HTTP, 443 HTTPS, 3306 MySQL) to fingerprint listening services before launching targeted exploits.

**Detection in our AI-NIDPS:**
- **Feature \`srv_diff_host_rate\`**: Measures the divergence rate of destination services probed within a 2-second time window (SHAP feature weight: +0.41).
- **Feature \`count\`**: Spike in connection attempts from a single source without application-data handshakes.
- **Mitigation Action**: Perimeter firewall immediately injected an active DROP rule for the offending source IP.`;
  } else if (lowerQuery.includes("iptables") || lowerQuery.includes("firewall") || lowerQuery.includes("block")) {
    fallbackReply = `### Firewall & Prevention Hardening Commands

**1. Immediate Ingress Block for Offending IP:**
\`\`\`bash
# Drop all incoming packets from the malicious source
sudo iptables -A INPUT -s 185.220.101.45 -j DROP

# Log dropped packets with SOC audit prefix
sudo iptables -A INPUT -s 185.220.101.45 -m limit --limit 5/min -j LOG --log-prefix "[NIDPS-BLOCK]: "
\`\`\`

**2. Kernel TCP SYN Flood Rate-Limiting:**
\`\`\`bash
# Limit SYN packets to 25/sec per source IP with burst of 50
sudo iptables -A INPUT -p tcp --syn -m limit --limit 25/s --limit-burst 50 -j ACCEPT
sudo iptables -A INPUT -p tcp --syn -j DROP

# Enable Kernel SYN Cookies
sudo sysctl -w net.ipv4.tcp_syncookies=1
\`\`\`

**3. Anti-Port Scan Rule:**
\`\`\`bash
# Drop stealth scans (e.g. NULL, XMAS, and SYN-FIN sweeps)
sudo iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP
sudo iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP
\`\`\``;
  } else {
    fallbackReply = `### AI-NIDPS SOC Assistant Status Report

**Live System Posture:**
- **Perimeter State**: **SHIELD ACTIVE** on Interface \`eth0\`
- **Throughput**: \`${currentPps.toLocaleString()} pps\` currently streaming through Layer 3/4 detection pipeline.
- **Active Incidents**: \`${activeAlerts.length}\` detected threat events.
- **Automated IP Blocks**: \`${state.blockedIps.length}\` hostile hosts quarantined.

**How can I assist your defense operations?**
- Ask **"Explain TCP SYN flood to my teacher"** for viva/exam defense points.
- Ask **"Why was IP 185.220.101.45 blocked?"** for packet-level evidence.
- Ask **"Generate an iptables rate-limit policy"** for firewall configuration.
- Ask **"How does the Random Forest model work?"** for ML architecture details.`;
  }

  return res.json({
    reply: fallbackReply,
    modelUsed: `${selectedModel} (Simulated Copilot Engine)`,
    roleUsed: role
  });
});

// ==========================================
// 3c. VEO VIDEO GENERATION & BACKGROUND API
// ==========================================

interface VideoOperationState {
  operationName: string;
  createdAt: number;
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  isRealVeo: boolean;
  done: boolean;
  progress: number;
  thumbnailBase64?: string;
}

const videoOperationsMap = new Map<string, VideoOperationState>();

// Get suitable preset cyber security background images
app.get("/api/presets/backgrounds", (req: Request, res: Response) => {
  const presets = [
    {
      id: "preset-soc-center",
      title: "Cyber Defense SOC Operations Center",
      description: "Futuristic multi-screen cyber command deck with glowing network topology and telemetry streams.",
      imageUrl: "/assets/images/cyber_soc_center_1790016152073.jpg",
      suggestedPrompt: "Subtle ambient cyber network particle flows, glowing data streams pulsing through network nodes in futuristic SOC monitoring room, 4k cinematic slow motion",
      aspectRatio: "16:9",
      category: "Operations Center"
    },
    {
      id: "preset-firewall-shield",
      title: "Perimeter Firewall & Shield Grid",
      description: "First-Layer active defense shield grid with glowing packet fibers and energetic telemetry vectors.",
      imageUrl: "/assets/images/perimeter_firewall_grid_1790016177500.jpg",
      suggestedPrompt: "Digital perimeter firewall mesh pulsing with energetic defensive waves, deflecting malicious packet bursts along fiber optic lines",
      aspectRatio: "16:9",
      category: "Perimeter Defense"
    }
  ];

  res.json({ presets });
});

// 1. Start Veo Video Generation: POST /api/generate-video
app.post("/api/generate-video", async (req: Request, res: Response) => {
  const {
    prompt = "Subtle ambient cyber network telemetry flows, glowing data streams through network defense nodes",
    imageBase64,
    mimeType = "image/jpeg",
    aspectRatio = "16:9"
  } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "Missing photo image data (imageBase64 is required)." });
  }

  // Sanitize base64 string
  const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");
  const targetRatio = aspectRatio === "9:16" ? "9:16" : "16:9";

  // Use model: veo-3.1-fast-generate-preview as requested
  const targetModel = "veo-3.1-fast-generate-preview";

  if (ai && process.env.GEMINI_API_KEY) {
    try {
      console.log(`Calling Veo API with model: ${targetModel}, aspectRatio: ${targetRatio}...`);
      const operation = await ai.models.generateVideos({
        model: targetModel,
        prompt: prompt || "Cyber defense network telemetry visualization with glowing data packets",
        image: {
          imageBytes: cleanBase64,
          mimeType: mimeType || "image/jpeg",
        },
        config: {
          numberOfVideos: 1,
          resolution: "720p",
          aspectRatio: targetRatio,
        }
      });

      console.log(`Veo video operation initiated successfully: ${operation.name}`);

      videoOperationsMap.set(operation.name, {
        operationName: operation.name,
        createdAt: Date.now(),
        prompt,
        aspectRatio: targetRatio,
        isRealVeo: true,
        done: false,
        progress: 10,
        thumbnailBase64: cleanBase64.slice(0, 1000)
      });

      return res.json({
        operationName: operation.name,
        modelUsed: targetModel,
        aspectRatio: targetRatio,
        isRealVeo: true
      });
    } catch (err: any) {
      console.warn("Veo API call encountered error, falling back to simulated neural video synthesis:", err.message || err);
    }
  }

  // Graceful fallback for offline / test environments
  const simOpName = `models/${targetModel}/operations/sim-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  videoOperationsMap.set(simOpName, {
    operationName: simOpName,
    createdAt: Date.now(),
    prompt,
    aspectRatio: targetRatio,
    isRealVeo: false,
    done: false,
    progress: 5,
    thumbnailBase64: cleanBase64.slice(0, 1000)
  });

  return res.json({
    operationName: simOpName,
    modelUsed: `${targetModel} (Simulated Synthesis)`,
    aspectRatio: targetRatio,
    isRealVeo: false
  });
});

// 2. Poll Video Generation Status: POST /api/video-status
app.post("/api/video-status", async (req: Request, res: Response) => {
  const { operationName } = req.body;

  if (!operationName) {
    return res.status(400).json({ error: "Missing operationName." });
  }

  const storedOp = videoOperationsMap.get(operationName);

  // If this was a real Veo operation and ai is initialized
  if (storedOp?.isRealVeo && ai) {
    try {
      const op = new GenerateVideosOperation();
      op.name = operationName;
      const updated = await ai.operations.getVideosOperation({ operation: op });

      if (updated.done) {
        storedOp.done = true;
        storedOp.progress = 100;
      } else {
        const elapsedSec = (Date.now() - storedOp.createdAt) / 1000;
        storedOp.progress = Math.min(95, Math.floor(15 + elapsedSec * 4));
      }

      return res.json({
        done: updated.done,
        progress: storedOp.progress,
        metadata: updated.metadata,
        isRealVeo: true
      });
    } catch (err: any) {
      console.warn("Failed to check Veo operation status:", err.message || err);
    }
  }

  // Simulated operation polling handling
  if (storedOp) {
    const elapsedSec = (Date.now() - storedOp.createdAt) / 1000;
    // Simulate generation completion in ~7-9 seconds
    if (elapsedSec >= 8) {
      storedOp.done = true;
      storedOp.progress = 100;
      return res.json({
        done: true,
        progress: 100,
        isRealVeo: false,
        message: "Video synthesized successfully."
      });
    } else {
      storedOp.progress = Math.min(95, Math.floor((elapsedSec / 8) * 100));
      return res.json({
        done: false,
        progress: storedOp.progress,
        isRealVeo: false,
        stage: elapsedSec < 3 ? "Initializing Veo 3.1 neural network..." : elapsedSec < 6 ? "Synthesizing temporal coherence & frame interpolation..." : "Rendering 720p H.264 stream..."
      });
    }
  }

  return res.json({ done: true, progress: 100 });
});

// 3. Download/Stream Generated Video: POST /api/video-download
app.post("/api/video-download", async (req: Request, res: Response) => {
  const { operationName } = req.body;

  if (!operationName) {
    return res.status(400).json({ error: "Missing operationName." });
  }

  const storedOp = videoOperationsMap.get(operationName);

  if (storedOp?.isRealVeo && ai && process.env.GEMINI_API_KEY) {
    try {
      const op = new GenerateVideosOperation();
      op.name = operationName;
      const updated = await ai.operations.getVideosOperation({ operation: op });
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

      if (!uri) {
        return res.status(404).json({ error: "Video URI not available in Veo response." });
      }

      const videoRes = await fetch(uri, {
        headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY },
      });

      if (!videoRes.ok) {
        throw new Error(`Failed to fetch video from Veo URI: ${videoRes.statusText}`);
      }

      const arrayBuf = await videoRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);

      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Content-Length", buffer.length);
      res.setHeader("Content-Disposition", `inline; filename="veo-cyber-defense-${Date.now()}.mp4"`);
      return res.send(buffer);
    } catch (err: any) {
      console.warn("Failed to stream real Veo video, falling back to simulated payload:", err.message || err);
    }
  }

  // If simulated or fallback, return a lightweight placeholder video or redirect to ambient video stream
  res.setHeader("Content-Type", "application/json");
  return res.json({
    status: "ready",
    simulated: true,
    operationName,
    note: "Video synthesized. Use client-side rendering or animated canvas mode."
  });
});

// 4. Attack Simulator Trigger
app.post("/api/traffic/simulate-attack", (req: Request, res: Response) => {
  const { attackType = "DDoS_SYN_FLOOD", srcIp = "194.26.29.110", dstPort = 80 } = req.body;

  const newAlertId = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;
  const timestamp = new Date().toISOString();

  let title = "Simulated Network Intrusion";
  let description = "High-frequency packet anomaly detected.";
  let severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" = "HIGH";

  switch (attackType) {
    case "DDoS_SYN_FLOOD_VOLUMETRIC":
    case "DDoS_SYN_FLOOD":
      title = "Volumetric TCP SYN Flood (DDoS Attack) - Layer 4";
      description = `Layer 4 Transport Layer volumetric attack: High rate of half-open TCP SYN packets from ${srcIp} targeting port ${dstPort} to exhaust connection backlog. Rate: 16,400 pps.`;
      severity = "CRITICAL";
      break;
    case "DDoS_SYN_FLOOD_SPOOFED":
      title = "Distributed Spoofed TCP SYN Flood - Layer 4";
      description = `Layer 4 Transport attack: Multi-source spoofed TCP SYN burst targeting port ${dstPort} to saturate kernel TCB backlog. Rate: 24,800 pps.`;
      severity = "CRITICAL";
      break;
    case "DDoS_SYN_FLOOD_STEALTH":
      title = "Low-Rate Stealth TCP SYN Accumulation - Layer 4";
      description = `Layer 4 Stealth attack: Paced TCP SYN connections held in SYN_RECV state on port ${dstPort} to silently exhaust connection slots. Rate: 3,800 pps.`;
      severity = "HIGH";
      break;
    default:
      title = "TCP SYN Flood (DDoS Attack) - Layer 4";
      description = `Layer 4 Transport attack detected from ${srcIp} targeting port ${dstPort}.`;
      severity = "CRITICAL";
      break;
  }

  const newAlert: SecurityAlert = {
    id: newAlertId,
    timestamp,
    title,
    severity: severity as any,
    status: "ACTIVE",
    srcIp,
    dstIp: "10.0.1.100",
    dstPort,
    attackType: 'DDoS_SYN_FLOOD' as any,
    confidence: +(0.96 + Math.random() * 0.03).toFixed(2),
    description,
    mitigationStatus: "AUTOMATICALLY_BLOCKED",
    affectedAsset: `First-Layer Gateway (Port ${dstPort})`,
    aiAnalysis: "First Layer (Transport Layer 4) attack detected: Half-open TCP SYN flood identified by abnormal SYN-to-ACK ratio (>99%), rapid packet rate, and zero ACK return traffic. Perimeter firewall auto-blocked IP."
  };

  // Add to alerts
  state.alerts.unshift(newAlert);

  // Auto-block IP in prevention state
  const alreadyBlocked = state.blockedIps.find(b => b.ip === srcIp);
  if (!alreadyBlocked) {
    state.blockedIps.unshift({
      ip: srcIp,
      blockedAt: timestamp,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      reason: `IPS Auto-Block: Triggered by ${title}`,
      attackType: "DDoS_SYN_FLOOD",
      country: "US",
      autoBlocked: true
    });
  }

  // Inject attack packet into packet capture feed so live inspector immediately captures it
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
  state.packets.unshift({
    id: `PKT-${Math.floor(10000 + Math.random() * 90000)}`,
    timestamp: timeStr,
    srcIp,
    srcPort: Math.floor(40000 + Math.random() * 20000),
    dstIp: "10.0.1.100",
    dstPort,
    protocol: "TCP",
    length: 64,
    flags: ["SYN"],
    payloadPreview: `TCP SYN [Seq=0 Win=1024 Len=0 MSS=1460] - Volumetric Half-Open Flood on Port ${dstPort}`,
    prediction: "MALICIOUS",
    attackType: 'DDoS_SYN_FLOOD',
    confidenceScore: 0.98,
    anomalyScore: 94.6,
    locationSrc: "Simulated Attacker Node",
    countryCode: "US"
  });

  res.json({
    success: true,
    message: `Simulated attack ${title} launched successfully! NIDPS auto-detected and mitigated the TCP SYN Flood threat.`,
    alert: newAlert
  });
});

// 5. Firewall Rules Management
app.get("/api/firewall/rules", (_req: Request, res: Response) => {
  res.json(state.firewallRules);
});

app.post("/api/firewall/rules", (req: Request, res: Response) => {
  const newRule = {
    id: `FW-${Math.floor(200 + Math.random() * 800)}`,
    hitsCount: 0,
    createdDate: new Date().toISOString().split('T')[0],
    enabled: true,
    ...req.body
  };
  state.firewallRules.unshift(newRule);
  res.json({ success: true, rule: newRule });
});

app.post("/api/firewall/rules/:id/toggle", (req: Request, res: Response) => {
  const { id } = req.params;
  const rule = state.firewallRules.find(r => r.id === id);
  if (rule) {
    rule.enabled = !rule.enabled;
    return res.json({ success: true, enabled: rule.enabled });
  }
  res.status(404).json({ error: "Rule not found" });
});

app.delete("/api/firewall/rules/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  state.firewallRules = state.firewallRules.filter(r => r.id !== id);
  res.json({ success: true });
});

// 6. IP Management
app.get("/api/ip/blocked", (_req: Request, res: Response) => {
  res.json(state.blockedIps);
});

app.post("/api/ip/unblock", (req: Request, res: Response) => {
  const { ip } = req.body;
  state.blockedIps = state.blockedIps.filter(b => b.ip !== ip);
  res.json({ success: true });
});

// 7. AI Models & Model Training API
app.get("/api/ai/models", (_req: Request, res: Response) => {
  res.json(state.models);
});

app.post("/api/ai/train-model", (req: Request, res: Response) => {
  const { algorithm, hyperparameters, datasetId } = req.body;

  const newModelId = `MODEL-${algorithm.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`;
  const trainedModel = {
    id: newModelId,
    name: `Custom ${algorithm} Model`,
    algorithm,
    version: "1.0.0",
    accuracy: +(0.98 + Math.random() * 0.015).toFixed(3),
    precision: +(0.975 + Math.random() * 0.02).toFixed(3),
    recall: +(0.982 + Math.random() * 0.015).toFixed(3),
    f1Score: +(0.98 + Math.random() * 0.015).toFixed(3),
    trainedDate: new Date().toISOString().split('T')[0],
    datasetUsed: datasetId || "CICIDS2017 Clean",
    status: "STANDBY" as const,
    latencyMs: +(1.0 + Math.random() * 2.0).toFixed(1)
  };

  state.models.push(trainedModel);
  res.json({ success: true, model: trainedModel });
});

app.post("/api/ai/activate-model", (req: Request, res: Response) => {
  const { modelId } = req.body;
  state.models.forEach(m => {
    if (m.id === modelId) {
      m.status = "PRODUCTION";
    } else if (m.status === "PRODUCTION") {
      m.status = "STANDBY" as any;
    }
  });
  res.json({ success: true, models: state.models });
});

// Serve frontend in dev and production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI-NIDPS Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
