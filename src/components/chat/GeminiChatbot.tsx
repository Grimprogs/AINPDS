import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Brain,
  Shield,
  GraduationCap,
  FileCode,
  Sliders,
  Terminal,
  ChevronDown
} from 'lucide-react';
import { ChatMessage, sendChatMessageApi } from '../../services/api';
import { SystemHealthMetrics } from '../../types';

interface GeminiChatbotProps {
  systemHealth?: SystemHealthMetrics;
  compact?: boolean;
  onClose?: () => void;
}

const ROLES = [
  {
    id: 'soc_analyst',
    label: 'SOC Tier-3 Analyst',
    description: 'High-priority incident triage, threat severity, and containment advice',
    icon: Shield,
    defaultPrompt: 'Analyze current Layer 3/4 threats and evaluate our perimeter defense posture.'
  },
  {
    id: 'viva_coach',
    label: 'Viva & Teacher Coach',
    description: 'Crisp, articulate talking points for professors, evaluators, and viva defense',
    icon: GraduationCap,
    defaultPrompt: 'Prepare a 60-second viva defense pitch for my teacher on why our First-Layer NIDPS is critical.'
  },
  {
    id: 'packet_forensics',
    label: 'Packet Forensics',
    description: 'Deep packet inspection (DPI), TCP handshakes, flag anomalies, and RFC standards',
    icon: Terminal,
    defaultPrompt: 'Dissect the TCP flags and anomalous byte distributions in recent SYN flood packets.'
  },
  {
    id: 'firewall_architect',
    label: 'Firewall Architect',
    description: 'Production-ready iptables/nftables CLI rules, rate-limiting, and SYN cookies',
    icon: FileCode,
    defaultPrompt: 'Generate a hardened iptables configuration to rate-limit SYN packets on port 80 and 443.'
  }
];

const MODELS = [
  {
    id: 'gemini-3.5-flash',
    label: 'gemini-3.5-flash',
    tag: 'General Tasks',
    description: 'Fast, balanced reasoning for SOC incident triage & defense queries',
    icon: Zap,
    complexity: 'general' as const
  },
  {
    id: 'gemini-3.1-pro-preview',
    label: 'gemini-3.1-pro-preview',
    tag: 'Complex Tasks',
    description: 'Deep reasoning, forensic root-cause analysis & custom policy synthesis',
    icon: Brain,
    complexity: 'complex' as const
  },
  {
    id: 'gemini-3.1-flash-lite',
    label: 'gemini-3.1-flash-lite',
    tag: 'Fast Response',
    description: 'Ultra-low latency for quick IP triage, packet lookups & status checks',
    icon: Sparkles,
    complexity: 'fast' as const
  }
];

const QUICK_PROMPTS = [
  { label: 'Explain for Teacher Viva', text: 'Explain the active TCP SYN Flood attack in simple, confident terms so I can present it clearly to my teacher.' },
  { label: 'Why was IP Blocked?', text: 'Why did our system automatically block IP 185.220.101.45? What packet evidence triggered the rule?' },
  { label: 'Generate iptables Rule', text: 'Write production iptables and sysctl rules to mitigate Layer 4 TCP SYN flood on eth0.' },
  { label: 'Random Forest vs Snort', text: 'How is our Machine Learning (Random Forest) detection superior to traditional static Snort signature rules?' },
  { label: 'Explain SHAP Weights', text: 'How do SHAP feature importance scores prove our ML model is not a black box?' }
];

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  systemHealth,
  compact = false,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: `### Welcome to Aegis-AI Cyber Defense Copilot 🛡️
I am your **Gemini-powered multi-turn cybersecurity assistant**, integrated directly into the **AI-NIDPS First-Layer Defense System**.

- **Active Model**: \`gemini-3.5-flash\` (or switch to \`gemini-3.1-pro-preview\` for complex forensics, \`gemini-3.1-flash-lite\` for fast lookups)
- **Interface**: Monitoring \`eth0\` Layer 4 (Transport / RFC 793) — Dedicated TCP SYN Flood Defense
- **Context**: Real-time ingress packet capture & automated firewall state

Ask me about active alerts, packet headers, firewall rules, or select **Viva & Teacher Coach** to get instant exam presentation pitches!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash'
    }
  ]);

  const [input, setInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('soc_analyst');
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const currentRoleObj = ROLES.find(r => r.id === selectedRole) || ROLES[0];
  const currentModelObj = MODELS.find(m => m.id === selectedModel) || MODELS[0];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessageApi({
        messages: newHistory,
        role: selectedRole,
        modelPreference: selectedModel,
        complexity: currentModelObj.complexity
      });

      const assistantMessage: ChatMessage = {
        id: `gemini-${Date.now()}`,
        role: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: response.modelUsed || selectedModel
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `**Incident Communication Notice:**\nUnable to reach Gemini cloud endpoint directly (${err.message || 'Network Timeout'}). Real-time local NIDPS defense rules remain fully active on \`eth0\`. Please retry your prompt or toggle to \`gemini-3.1-flash-lite\`.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'Offline Fallback'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: `Conversation history cleared. I am ready with **${currentRoleObj.label}** role on **${currentModelObj.label}**. Ask anything about your network defense!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel
      }
    ]);
  };

  return (
    <div className={`flex flex-col bg-black border border-zinc-800 rounded-lg overflow-hidden shadow-2xl ${
      compact ? 'h-[600px] w-full' : 'h-[calc(100vh-8.5rem)] w-full'
    }`}>
      {/* Top Bar: Role Selector, Model Switcher, and Controls */}
      <div className="bg-zinc-950 border-b border-zinc-800 p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-white text-black flex items-center justify-center font-bold">
            <Bot className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-white uppercase tracking-wider text-xs">
              <span>Gemini Cyber Copilot</span>
              <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.2 rounded">
                MULTI-TURN AI
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-sans">
              Ground-truth defense intelligence powered by Google Gemini
            </p>
          </div>
        </div>

        {/* Role & Model Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Model Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-black border border-zinc-800 px-2 py-1 rounded">
            <span className="text-[10px] text-zinc-500 uppercase">Model:</span>
            <select
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              className="bg-transparent text-white text-xs font-mono focus:outline-none cursor-pointer"
            >
              {MODELS.map(m => (
                <option key={m.id} value={m.id} className="bg-zinc-900 text-white">
                  {m.label} ({m.tag})
                </option>
              ))}
            </select>
          </div>

          {/* Role Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-black border border-zinc-800 px-2 py-1 rounded">
            <span className="text-[10px] text-zinc-500 uppercase">Role:</span>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="bg-transparent text-white text-xs font-mono focus:outline-none cursor-pointer"
            >
              {ROLES.map(r => (
                <option key={r.id} value={r.id} className="bg-zinc-900 text-white">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear History */}
          <button
            onClick={handleClearHistory}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 rounded transition-colors cursor-pointer"
            title="Clear Conversation History"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 rounded transition-colors cursor-pointer text-xs"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Role Quick Switch Bar */}
      <div className="bg-zinc-950/60 border-b border-zinc-800/80 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono shrink-0">
        <span className="text-zinc-500 uppercase text-[10px] shrink-0 mr-1">Personas:</span>
        {ROLES.map(role => {
          const IconComp = role.icon;
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
              title={role.description}
            >
              <IconComp className="w-3 h-3 shrink-0" />
              <span>{role.label}</span>
            </button>
          );
        })}
      </div>

      {/* Message Thread Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#09090b]">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id || idx}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded shrink-0 flex items-center justify-center font-bold text-xs ${
                  isUser
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'bg-white text-black shadow-sm'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 stroke-[2.5]" />}
              </div>

              {/* Message Bubble Container */}
              <div
                className={`group flex flex-col space-y-1.5 max-w-[85%] rounded-lg p-3.5 text-xs transition-all ${
                  isUser
                    ? 'bg-zinc-900 text-zinc-100 border border-zinc-800 font-mono shadow-sm'
                    : 'bg-zinc-950 text-zinc-200 border border-zinc-800 shadow-md'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-4 font-mono text-[10px] text-zinc-500 pb-1 border-b border-zinc-800/60">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-zinc-300">
                      {isUser ? 'You (Security Analyst)' : 'Aegis-AI Copilot'}
                    </span>
                    {msg.modelUsed && !isUser && (
                      <span className="bg-black text-zinc-400 border border-zinc-800 px-1.5 py-0.2 rounded text-[9px]">
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                        title="Copy message to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Body with Markdown */}
                <div className="markdown-body leading-relaxed space-y-2 text-zinc-300 font-sans">
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading / Generating State Indicator */}
        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-3xl">
            <div className="w-7 h-7 rounded shrink-0 flex items-center justify-center font-bold text-xs bg-white text-black shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-black" />
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-400 font-mono flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Analyzing network telemetry using {selectedModel}...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="bg-zinc-950/80 border-t border-zinc-800 px-3 py-2 flex items-center gap-2 overflow-x-auto text-[11px] font-mono shrink-0">
        <span className="text-zinc-500 uppercase text-[10px] shrink-0">Quick Prompts:</span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.text)}
            disabled={isLoading}
            className="bg-black hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 px-2.5 py-1 rounded whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-zinc-950 border-t border-zinc-800 shrink-0 font-mono">
        <div className="flex items-end gap-2 bg-black border border-zinc-800 rounded-lg p-2 focus-within:border-white transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={`Ask ${currentRoleObj.label} about attacks, packets, firewall rules, or viva questions... (Press Enter to send)`}
            rows={1}
            className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 resize-none focus:outline-none max-h-32 min-h-[36px] py-1"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded bg-white hover:bg-zinc-200 text-black font-bold transition-all disabled:opacity-30 disabled:hover:bg-white cursor-pointer shrink-0 shadow-sm"
            title="Send message (Enter)"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <span>Interface: <strong className="text-zinc-400">eth0</strong></span>
            <span>&bull;</span>
            <span>Task Complexity: <strong className="text-zinc-300 uppercase">{currentModelObj.tag}</strong></span>
          </div>
          <span>Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
};
