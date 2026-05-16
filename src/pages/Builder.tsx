import { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type Node,
  type Edge,
  type NodeTypes,
  Handle,
  Position,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Brain,
  CheckSquare,
  Info,
  Plus,
  Trash2,
  Play,
  Save,
  ChevronDown,
  MessageSquare,
  Globe,
  Cpu,
  CreditCard,
  FileText,
  User,
  Settings,
  Terminal,
  Activity,
  Code,
  X,
  Key,
  Database,
} from "lucide-react";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import ky from "ky";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CustomNodeData {
  label: string;
  type: "trigger" | "logic" | "action";
  description: string;
  executing?: boolean;
  success?: boolean;
  error?: boolean;
  config?: Record<string, any>;
  [key: string]: unknown;
}

function getNodeIcon(label: string, defaultIcon: any) {
  const labelLower = label.toLowerCase();
  if (labelLower.includes("slack")) return MessageSquare;
  if (labelLower.includes("discord")) return MessageSquare;
  if (labelLower.includes("openai") || labelLower.includes("claude") || labelLower.includes("gemini") || labelLower.includes("gpt")) return Cpu;
  if (labelLower.includes("http") || labelLower.includes("webhook")) return Globe;
  if (labelLower.includes("stripe") || labelLower.includes("payment")) return CreditCard;
  if (labelLower.includes("form")) return FileText;
  if (labelLower.includes("manual")) return User;
  return defaultIcon;
}

function TriggerNode({ data }: { data: CustomNodeData }) {
  const Icon = getNodeIcon(data.label, Zap);
  return (
    <div
      className={`node-trigger rounded-xl px-4 py-3 min-w-[160px] transition-all duration-300 ${data.executing ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-[#0a0c12] scale-105 shadow-[0_0_20px_rgba(251,191,36,0.4)]" : ""
        } ${data.success ? "border-yellow-400/50" : ""}`}
    >
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${data.executing ? "animate-pulse" : ""}`}
          style={{ background: "rgba(251,191,36,0.2)" }}
        >
          <Icon className="w-3.5 h-3.5 text-yellow-400" />
        </div>
        <div>
          <p className="text-xs font-bold text-yellow-300">{data.label}</p>
          <p className="text-[10px] text-yellow-400/60">{data.description}</p>
        </div>
        {data.executing && (
          <div className="ml-auto">
            <span className="flex h-2 w-2 rounded-full bg-yellow-400 animate-ping" />
          </div>
        )}
      </div>
    </div>
  );
}

function LogicNode({ data }: { data: CustomNodeData }) {
  const Icon = getNodeIcon(data.label, Brain);
  return (
    <div
      className={`node-logic rounded-xl px-4 py-3 min-w-[160px] transition-all duration-300 ${data.executing ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0a0c12] scale-105 shadow-[0_0_20px_rgba(56,139,253,0.4)]" : ""
        }`}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${data.executing ? "animate-pulse" : ""}`}
          style={{ background: "rgba(56,139,253,0.2)" }}
        >
          <Icon className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <div>
          <p className="text-xs font-bold text-blue-300">{data.label}</p>
          <p className="text-[10px] text-blue-400/60">{data.description}</p>
        </div>
        {data.executing && (
          <div className="ml-auto">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping" />
          </div>
        )}
      </div>
    </div>
  );
}

function ActionNode({ data }: { data: CustomNodeData }) {
  const Icon = getNodeIcon(data.label, CheckSquare);
  return (
    <div
      className={`node-action rounded-xl px-4 py-3 min-w-[160px] transition-all duration-300 ${data.executing ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0a0c12] scale-105 shadow-[0_0_20px_rgba(52,211,153,0.4)]" : ""
        }`}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${data.executing ? "animate-pulse" : ""}`}
          style={{ background: "rgba(52,211,153,0.2)" }}
        >
          <Icon className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-300">{data.label}</p>
          <p className="text-[10px] text-emerald-400/60">{data.description}</p>
        </div>
        {data.executing && (
          <div className="ml-auto">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
        )}
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  trigger: TriggerNode as any,
  logic: LogicNode as any,
  action: ActionNode as any,
};

const initialNodes: Node[] = [
  {
    id: "1", type: "trigger", position: { x: 80, y: 180 },
    data: { label: "Owl Receipt", type: "trigger", description: "New parchment received" },
  },
  {
    id: "2", type: "logic", position: { x: 320, y: 120 },
    data: { label: "Decipher Scroll", type: "logic", description: "Analyze & classify intent" },
  },
  {
    id: "3", type: "logic", position: { x: 320, y: 240 },
    data: { label: "Magical Filter", type: "logic", description: "Check ward conditions" },
  },
  {
    id: "4", type: "action", position: { x: 560, y: 180 },
    data: { label: "Enchant Quill", type: "action", description: "Draft automated response" },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
  { id: "e2-4", source: "2", target: "4", animated: true },
  { id: "e3-4", source: "3", target: "4", animated: true },
];

const BLOCK_TYPES = [
  {
    type: "trigger" as const, label: "Incantation", description: "Starting condition",
    icon: Zap, color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)",
    options: ["Wand Flick (Manual)", "Owl Arrival (Webhook)"],
  },
  {
    type: "logic" as const, label: "Cognitive Charm", description: "AI processing core",
    icon: Brain, color: "#58a6ff", bg: "rgba(56,139,253,0.1)", border: "rgba(56,139,253,0.25)",
    options: ["Oracle of Gemini", "Swift-Thought (Groq)"],
  },
  {
    type: "action" as const, label: "Manifestation", description: "Real-world magical output",
    icon: CheckSquare, color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)",
    options: ["Floo Broadcast (Slack)", "Patronus Messenger (Discord)", "Dispatch Owl (Webhook)"],
  },
];

const topologicalSort = (nodes: Node[], edges: Edge[]): Node[] => {
  const sorted: Node[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  const visit = (node: Node) => {
    if (visiting.has(node.id)) throw new Error("Cycle detected");
    if (visited.has(node.id)) return;

    visiting.add(node.id);
    const outgoingEdges = edges.filter((e) => e.source === node.id);
    for (const edge of outgoingEdges) {
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (targetNode) visit(targetNode);
    }
    visiting.delete(node.id);
    visited.add(node.id);
    sorted.unshift(node);
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) visit(node);
  }

  return sorted; // Removed .reverse() because unshift already produces topological order
};

export function Builder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Load initial state from localStorage
  useEffect(() => {
    const savedNodes = localStorage.getItem("agent_nodes");
    const savedEdges = localStorage.getItem("agent_edges");
    if (savedNodes) setNodes(JSON.parse(savedNodes));
    if (savedEdges) setEdges(JSON.parse(savedEdges));
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem("agent_nodes", JSON.stringify(nodes));
    localStorage.setItem("agent_edges", JSON.stringify(edges));
  }, [nodes, edges]);

  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<null | "running" | "success" | "error">(null);
  const [logs, setLogs] = useState<{ time: string; msg: string; type: "info" | "success" | "error" }[]>([]);
  const [apiKeys, setApiKeys] = useState<{ openai: string; gemini: string; anthropic: string; groq: string }>(() => {
    const saved = localStorage.getItem("agent_api_keys");
    return saved ? JSON.parse(saved) : { openai: "", gemini: "", anthropic: "", groq: "" };
  });
  const [showApiSettings, setShowApiSettings] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const saveApiKeys = (keys: typeof apiKeys) => {
    setApiKeys(keys);
    localStorage.setItem("agent_api_keys", JSON.stringify(keys));
    setShowApiSettings(false);
  };

  const addLog = (msg: string, type: "info" | "success" | "error" = "info") => {
    setLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
  };

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    [setEdges]
  );

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNodeId(node.id);
  };

  const deleteNode = (id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNodeId(null);
    addLog("Node deleted", "info");
  };

  const addNode = (type: "trigger" | "logic" | "action", label: string) => {
    const descriptions: Record<string, Record<string, string>> = {
      trigger: {
        "Wand Flick (Manual)": "Start with custom intent",
        "Owl Arrival (Webhook)": "Listen for incoming magical signals"
      },
      logic: {
        "Oracle of Gemini": "Multimodal Divination (Google)",
        "Swift-Thought (Groq)": "Ultra-fast cognition (Groq)"
      },
      action: {
        "Floo Broadcast (Slack)": "Speak into the Floo Network",
        "Patronus Messenger (Discord)": "Send a Patronus to a server",
        "Dispatch Owl (Webhook)": "Send data to any magical endpoint"
      },
    };

    const newNode: Node = {
      id: `${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: {
        x: 150 + Math.random() * 300,
        y: 100 + Math.random() * 200,
      },
      data: {
        label,
        type,
        description: descriptions[type]?.[label] || "Action step",
        config: {
          prompt: "",
          input: "",
          model: label.includes("Gemini") ? "gemini-1.5-flash" : label.includes("Claude") ? "claude-3-5-sonnet-20240620" : label.includes("Groq") ? "llama-3.1-8b-instant" : "gpt-4o",
        },
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setExpandedBlock(null);
  };

  const updateNodeConfig = (nodeId: string, config: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } };
        }
        return node;
      })
    );
  };

  const handleRun = async () => {
    setRunStatus("running");
    setLogs([]);
    addLog("Initializing agent workflow...", "info");

    let context = ""; // This will hold the "conversation" or data flow

    try {
      const sortedNodes = topologicalSort(nodes, edges);
      addLog(`Traversing graph: ${sortedNodes.map(n => n.data.label).join(" -> ")}`, "info");

      for (const node of sortedNodes) {
        addLog(`Executing: ${node.data.label}...`, "info");

        setNodes((nds) =>
          nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, executing: true, success: false, error: false } } : n))
        );

        const label = node.data.label.toLowerCase();
        const config = node.data.config || {};

        if (label.includes("manual trigger")) {
          context = config.input || "No input provided";
          addLog(`Trigger Data: ${context.substring(0, 50)}...`, "info");
          await new Promise(r => setTimeout(r, 800));
        }
        else if (label.includes("openai") || label.includes("gpt") || label.includes("claude") || label.includes("gemini") || label.includes("groq") || label.includes("analyze") || label.includes("summarize")) {
          const systemPrompt = config.prompt || "You are a helpful assistant.";
          const userPrompt = context; // Directly use the context as the AI's instruction

          let resultText = "";

          try {
            if (label.includes("openai") || label.includes("gpt")) {
              if (!apiKeys.openai) throw new Error("OpenAI API Key missing");
              addLog("Calling OpenAI API...", "info");
              const { text } = await generateText({
                model: createOpenAI({ apiKey: apiKeys.openai })("gpt-4o"),
                system: systemPrompt,
                prompt: userPrompt,
              });
              resultText = text;
            } else if (label.includes("gemini")) {
              if (!apiKeys.gemini) throw new Error("Gemini API Key missing");
              addLog("Calling Google Gemini API...", "info");
              const { text } = await generateText({
                model: createGoogleGenerativeAI({ apiKey: apiKeys.gemini })(config.model || "gemini-1.5-flash"),
                system: systemPrompt,
                prompt: userPrompt,
              });
              resultText = text;
            } else if (label.includes("groq")) {
              if (!apiKeys.groq) throw new Error("Groq API Key missing");

              // MODEL MIGRATION: Force update old decommissioned models
              let modelId = config.model || "llama-3.1-8b-instant";
              if (modelId === "llama3-8b-8192" || modelId === "llama3-70b-8192") {
                modelId = "llama-3.1-8b-instant";
                addLog(`Auto-migrated old model to ${modelId}`, "info");
              }

              console.log("Groq Model Used:", modelId);
              addLog(`Calling Groq (${modelId}) API...`, "info");

              const { text } = await generateText({
                model: createOpenAI({
                  apiKey: apiKeys.groq,
                  baseURL: "https://api.groq.com/openai/v1"
                })(modelId),
                system: systemPrompt,
                prompt: userPrompt,
              });
              resultText = text;
            } else if (label.includes("claude")) {
              if (!apiKeys.anthropic) throw new Error("Anthropic API Key missing");
              addLog("Calling Anthropic Claude API...", "info");
              const { text } = await generateText({
                model: createAnthropic({ apiKey: apiKeys.anthropic })(config.model || "claude-3-5-sonnet-20240620"),
                system: systemPrompt,
                prompt: userPrompt,
              });
              resultText = text;
            } else {
              addLog(`Simulating ${node.data.label}...`, "info");
              await new Promise(r => setTimeout(r, 2000));
              resultText = `[Simulated Output for ${node.data.label}] based on: ${context.substring(0, 30)}...`;
            }

            context = resultText;
            addLog(`Output: ${resultText.substring(0, 100)}...`, "success");
          } catch (e: any) {
            addLog(`API Error: ${e.message}`, "error");
            throw e;
          }
        }
        else if (label.includes("slack") || label.includes("discord")) {
          const webhookUrl = config.webhookUrl;
          if (!webhookUrl) {
            throw new Error(`${node.data.label}: Webhook URL is missing in properties`);
          }

          addLog(`Sending message to ${node.data.label}...`, "info");
          try {
            // Using FormData instead of JSON for better browser-to-webhook compatibility
            const formData = new FormData();
            if (label.includes("slack")) {
              formData.append('payload', JSON.stringify({ text: context }));
            } else {
              formData.append('content', context);
            }

            await fetch(webhookUrl, {
              method: 'POST',
              body: formData,
              mode: 'no-cors'
            });

            addLog(`Request dispatched to ${node.data.label}`, "success");
          } catch (e: any) {
            addLog(`Delivery Error: ${e.message}`, "error");
          }
          await new Promise(r => setTimeout(r, 800));
        }
        else {
          await new Promise(r => setTimeout(r, 1000));
          addLog(`Step ${node.data.label} processed`, "success");
        }

        setNodes((nds) =>
          nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, executing: false, success: true } } : n))
        );
      }

      setRunStatus("success");
      addLog("Agent completed all tasks successfully!", "success");
    } catch (err: any) {
      addLog(`Critical Failure: ${err.message}`, "error");
      setRunStatus("error");
      // Reset the current node on error
      setNodes((nds) =>
        nds.map((n) => n.data.executing ? { ...n, data: { ...n.data, executing: false, error: true } } : n)
      );
    }

    setTimeout(() => {
      setRunStatus(null);
    }, 10000);
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden aurora-builder relative">
      <div
        className="w-56 h-full flex flex-col shrink-0 border-r border-white/10 dark:border-white/5 overflow-y-auto glass-panel"
      >
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#34d399", boxShadow: "0 0 6px rgba(52,211,153,0.8)" }} />
            <span className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: "rgba(52,211,153,0.6)" }}>Agent Builder</span>
          </div>
          <h2 className="font-display text-sm font-black text-white tracking-tight text-emerge-fast">Building Blocks</h2>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(230,237,243,0.3)" }}>Drag or click to add</p>
        </div>
        <div className="p-3 space-y-2 flex-1">
          {BLOCK_TYPES.map((block) => {
            const Icon = block.icon;
            const isExpanded = expandedBlock === block.type;
            return (
              <div key={block.type}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setExpandedBlock(isExpanded ? null : block.type)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left"
                  style={{
                    background: isExpanded ? block.bg : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isExpanded ? block.border : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: block.bg, border: `1px solid ${block.border}` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: block.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white/90">{block.label}</p>
                    <p className="text-[10px] text-white/35 truncate">{block.description}</p>
                  </div>
                  <ChevronDown
                    className="w-3 h-3 text-white/30 transition-transform shrink-0"
                    style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </motion.button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-1.5 pl-2 space-y-1">
                        {block.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => addNode(block.type, opt)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all hover:bg-white/5"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                          >
                            <Plus className="w-3 h-3 shrink-0" style={{ color: block.color }} />
                            <span className="text-[11px]">{opt}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <div className="p-3 border-t border-white/5 space-y-2">
          <div
            className="px-3 py-2 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <p className="text-[10px] text-white/30 mb-1">Canvas Info</p>
            <p className="text-xs text-white/50">{nodes.length} nodes</p>
            <p className="text-xs text-white/50">{edges.length} connections</p>
          </div>
          <button
            onClick={() => { setNodes(initialNodes); setEdges(initialEdges); }}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <Trash2 className="w-3 h-3" />
            Reset Canvas
          </button>
        </div>
      </div>

      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <div
          className="absolute top-4 right-4 z-10 flex items-center gap-2"
          style={{ pointerEvents: "all" }}
        >
          <button
            onClick={() => {
              if (confirm("Clear workspace and reset graph?")) {
                localStorage.removeItem("agent_nodes");
                localStorage.removeItem("agent_edges");
                window.location.reload();
              }
            }}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all"
            style={{
              background: "rgba(255,0,0,0.05)",
              border: "1px solid rgba(255,0,0,0.1)",
              color: "rgba(255,100,100,0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset
          </button>

          <Dialog open={showApiSettings} onOpenChange={setShowApiSettings}>
            <DialogTrigger asChild>
              <button
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <Key className="w-3.5 h-3.5" />
                API Keys
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a0c12] border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold uppercase tracking-widest text-white/60">AI Provider Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-[10px] text-white/40">GOOGLE GEMINI KEY (Free)</Label>
                  <Input
                    type="password"
                    value={apiKeys.gemini}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, gemini: e.target.value }))}
                    className="bg-white/5 border-white/10"
                    placeholder="AIza..."
                  />
                  <p className="text-[9px] text-blue-400/60">Get it at aistudio.google.com</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] text-white/40">GROQ API KEY (Free & Fast)</Label>
                  <Input
                    type="password"
                    value={apiKeys.groq}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, groq: e.target.value }))}
                    className="bg-white/5 border-white/10"
                    placeholder="gsk_..."
                  />
                  <p className="text-[9px] text-blue-400/60">Get it at console.groq.com</p>
                </div>
                <Button
                  onClick={() => saveApiKeys(apiKeys)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-xs mt-2"
                >
                  Save Keys
                </Button>
                <p className="text-[9px] text-white/20 text-center italic">Keys are stored locally in your browser</p>
              </div>
            </DialogContent>
          </Dialog>

          <button
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleRun}
            disabled={runStatus === "running"}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-all"
            style={{
              background: runStatus === "success"
                ? "linear-gradient(135deg, #34d399, #059669)"
                : runStatus === "error"
                  ? "linear-gradient(135deg, #ef4444, #b91c1c)"
                  : "linear-gradient(135deg, #388bfd, #1f6feb)",
              color: "white",
              boxShadow: runStatus === "success"
                ? "0 0 16px rgba(52,211,153,0.3)"
                : runStatus === "error"
                  ? "0 0 16px rgba(239,68,68,0.3)"
                  : "0 0 16px rgba(56,139,253,0.3)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Play className="w-3.5 h-3.5" />
            {runStatus === "running" ? "Conjuring..." : runStatus === "success" ? "Manifested!" : runStatus === "error" ? "Spell Failed" : "Cast Spell"}
          </motion.button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="rgba(255,255,255,0.06)"
          />
          <Controls showFitView showInteractive />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === "trigger") return "#fbbf24";
              if (n.type === "logic") return "#58a6ff";
              return "#34d399";
            }}
            maskColor="rgba(0,0,0,0.6)"
          />
        </ReactFlow>

        {/* Console Panel */}
        <AnimatePresence>
          {logs.length > 0 && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="absolute bottom-0 left-0 right-0 h-40 border-t border-white/10 dark:border-white/5 z-30 glass-panel"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Execution Console</span>
                </div>
                <button
                  onClick={() => setLogs([])}
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <ScrollArea className="h-32 p-4">
                <div className="space-y-1.5">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-3 text-[11px] font-mono">
                      <span className="text-white/20 shrink-0">{log.time}</span>
                      <span className={
                        log.type === "success" ? "text-emerald-400" :
                          log.type === "error" ? "text-red-400" :
                            "text-white/70"
                      }>
                        {log.type === "info" && "› "}
                        {log.msg}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {runStatus === "running" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-20"
              style={{
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(6px)",
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-2xl p-8 text-center"
                style={{
                  background: "rgba(13,17,23,0.9)",
                  border: "1px solid rgba(56,139,253,0.3)",
                  boxShadow: "0 0 40px rgba(56,139,253,0.2)",
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 rounded-full mx-auto mb-4"
                  style={{
                    border: "2px solid rgba(56,139,253,0.2)",
                    borderTopColor: "#388bfd",
                  }}
                />
                <p className="text-sm font-bold text-white mb-1">Weaving Enchantment...</p>
<p className="text-xs text-white/40">Channeling magical energies</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Sidebar: Properties Panel */}
      <AnimatePresence>
        {selectedNodeId && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            className="w-80 h-full flex flex-col shrink-0 border-l border-white/10 dark:border-white/5 z-40 glass-panel"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-white/40" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Properties</h3>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4 text-white/30" />
              </button>
            </div>

            <ScrollArea className="flex-1 p-4">
              {nodes.find(n => n.id === selectedNodeId) && (() => {
                const node = nodes.find(n => n.id === selectedNodeId)!;
                const Icon = getNodeIcon(node.data.label, Activity);

                return (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Icon className="w-5 h-5 text-white/60" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{node.data.label}</h4>
                        <p className="text-[10px] text-white/40">{node.data.description}</p>
                      </div>
                    </div>

                    <Separator className="bg-white/5" />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-white/40">Step Name</Label>
                        <Input
                          value={node.data.label}
                          onChange={(e) => {
                            setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, label: e.target.value } } : n));
                          }}
                          className="bg-white/5 border-white/10 text-xs h-9 focus-visible:ring-blue-500"
                        />
                      </div>

                      {/* Dynamic Config Fields based on Node Type */}
                      {node.data.label.toLowerCase().includes("manual trigger") && (
                        <div className="space-y-2 pt-2">
                          <Label className="text-[10px] uppercase tracking-widest text-white/40">Initial Input Data</Label>
                          <Textarea
                            placeholder="Data to start the workflow with..."
                            value={node.data.config?.input || ""}
                            onChange={(e) => updateNodeConfig(node.id, { input: e.target.value })}
                            className="bg-white/5 border-white/10 text-xs min-h-[100px] focus-visible:ring-blue-500"
                          />
                        </div>
                      )}

                      {(node.data.label.includes("AI") || node.data.label.includes("GPT") || node.data.label.includes("Claude") || node.data.label.includes("Gemini") || node.data.label.includes("Groq")) && (
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-white/40">Model Selection</Label>
                            <Select
                              value={node.data.config?.model || (node.data.label.includes("Groq") ? "llama3-8b-8192" : "gemini-1.5-flash")}
                              onValueChange={(val) => updateNodeConfig(node.id, { model: val })}
                            >
                              <SelectTrigger className="bg-white/5 border-white/10 text-xs h-9">
                                <SelectValue placeholder="Select model" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#0a0c12] border-white/10 text-white">
                                {node.data.label.includes("Gemini") ? (
                                  <>
                                    <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                                    <SelectItem value="gemini-1.5-flash-latest">Gemini 1.5 Flash (Latest)</SelectItem>
                                    <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                                    <SelectItem value="gemini-pro">Gemini Pro (Legacy)</SelectItem>
                                  </>
                                ) : (
                                  <>
                                    <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B (Instant)</SelectItem>
                                    <SelectItem value="llama-3.1-70b-versatile">Llama 3.1 70B (Versatile)</SelectItem>
                                    <SelectItem value="llama-3.3-70b-versatile">Llama 3.3 70B (Latest)</SelectItem>
                                    <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B (Groq)</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-white/40">System Prompt</Label>
                            <Textarea
                              placeholder="Instructions for the AI..."
                              value={node.data.config?.prompt || ""}
                              onChange={(e) => updateNodeConfig(node.id, { prompt: e.target.value })}
                              className="bg-white/5 border-white/10 text-xs min-h-[100px] focus-visible:ring-blue-500"
                            />
                          </div>
                        </div>
                      )}

                      {(node.data.label.includes("Slack") || node.data.label.includes("Discord")) && (
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-white/40">Webhook URL</Label>
                            <Input
                              placeholder="https://hooks.slack.com/..."
                              value={node.data.config?.webhookUrl || ""}
                              onChange={(e) => updateNodeConfig(node.id, { webhookUrl: e.target.value })}
                              className="bg-white/5 border-white/10 text-xs h-9 focus-visible:ring-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </ScrollArea>

            <div className="p-4 border-t border-white/5 space-y-2">
              <Button
                className="w-full text-xs h-9 bg-blue-600 hover:bg-blue-500 text-white font-bold"
                onClick={() => {
                  const node = nodes.find(n => n.id === selectedNodeId);
                  const nodeLabel = node?.data?.label || "Node";
                  addLog(`Configuration saved for ${nodeLabel}`, "success");
                  setSelectedNodeId(null); // Close sidebar after saving
                }}
              >
                Save Configuration
              </Button>
              <Button
                variant="outline"
                className="w-full text-xs h-9 bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400"
                onClick={() => deleteNode(selectedNodeId!)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Delete Block
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
