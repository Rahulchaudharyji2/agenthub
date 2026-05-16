import {
  CheckCircle2, Clock, AlertCircle, TrendingUp, Play, Pause, RefreshCw, Plus,
  CircleDollarSign, Search, BookOpen // <-- Add these new icons
} from "lucide-react";
import { motion } from "framer-motion";

const MY_AGENTS = [
  {
    id: "1", name: "Refund Finder", 
    icon: CircleDollarSign, // <-- Replaced "💰"
    color: "#34d399",
    status: "completed",
    task: "Scanned 3 months of Amazon orders",
    result: "Found $142 in potential refunds",
    completedAt: "2 hours ago", nitSpent: "15",
  },
  {
    id: "2", name: "Code Reviewer", 
    icon: Search, // <-- Replaced "🔍"
    color: "#58a6ff",
    status: "running",
    task: "Reviewing PR #247 in agenthub/core",
    result: null, completedAt: null, nitSpent: "20",
  },
  {
    id: "3", name: "Syllabus AI", 
    icon: BookOpen, // <-- Replaced "📚"
    color: "#818cf8",
    status: "pending",
    task: "Creating study plan for CS401",
    result: null, completedAt: null, nitSpent: "10",
  },
];

const STATUS_CONFIG = {
  completed: { label: "Completed", icon: CheckCircle2, color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
  running:   { label: "Running",   icon: RefreshCw,   color: "#58a6ff", bg: "rgba(56,139,253,0.08)",  border: "rgba(56,139,253,0.2)"  },
  pending:   { label: "Pending",   icon: Clock,        color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)"  },
  failed:    { label: "Failed",    icon: AlertCircle,  color: "#f43f5e", bg: "rgba(244,63,94,0.08)",   border: "rgba(244,63,94,0.2)"   },
};

export function MyAgents() {
  return (
    <div className="flex-1 overflow-y-auto relative aurora-agents">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      {/* Page header — frosted so aurora bleeds through */}
      <div className="sticky top-0 z-30 relative glass-nav pb-3">
        <div className="max-w-screen-xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">AgentHub</span>
              <span className="text-slate-400">/</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">My Familiars</span>
            </div>
            <button
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all magic-btn-primary"
            >
              <Plus className="w-3.5 h-3.5" />
              Summon Familiar
            </button>
          </div>
        </div>
      </div>

      {/* ── GitHub Actions-style hero ── */}
      <div className="max-w-screen-xl mx-auto px-6 pt-14 pb-10 text-center relative z-10">
        <div className="flex items-center justify-center gap-2.5 mb-5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent-magic)", boxShadow: "0 0 10px var(--accent-glow)" }} />
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-purple-500">My Familiars</span>
        </div>
        <h1 className="font-display text-5xl font-black tracking-tight leading-[1.05] mb-5 animate-emerge text-slate-900 dark:text-white">
          Your enchanted workforce,<br />running 24/7
        </h1>
        <p className="text-base leading-relaxed max-w-lg mx-auto text-slate-600 dark:text-slate-400">
          Track every task, review results, and summon new familiars in one place.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-6 pb-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Tasks Completed", value: "24", icon: CheckCircle2, color: "#34d399", change: "+3 this week" },
            { label: "Running Now",     value: "1",  icon: RefreshCw,    color: "#58a6ff", change: "Active"       },
            { label: "NIT Spent",       value: "387", icon: TrendingUp,  color: "#f59e0b", change: "All time"     },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-xl p-5 glass-panel"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}25` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: stat.color }}>{stat.change}</span>
                </div>
                <p className="font-display text-2xl font-black text-white mb-0.5">{stat.value}</p>
                <p className="text-xs" style={{ color: "rgba(230,237,243,0.4)" }}>{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Section heading */}
        <div
          className="flex items-center gap-3 mb-3 pb-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <h2 className="text-sm font-semibold" style={{ color: "rgba(230,237,243,0.55)" }}>Recent activity</h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "rgba(56,139,253,0.1)",
              border: "1px solid rgba(56,139,253,0.2)",
              color: "#58a6ff",
            }}
          >
            {MY_AGENTS.length}
          </span>
        </div>

        {/* Agent task list */}
        <div className="space-y-3">
          {MY_AGENTS.map((agent, i) => {
            const config = STATUS_CONFIG[agent.status as keyof typeof STATUS_CONFIG];
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="rounded-xl p-4 flex items-center gap-4 group transition-all cursor-pointer glass-panel"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg,${agent.color}20,${agent.color}08)`,
                    border: `1px solid ${agent.color}25`,
                  }}
                 >         
                  <agent.icon className="w-5 h-5" style={{ color: agent.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                    <div
                      className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: config.bg,
                        border: `1px solid ${config.border}`,
                        color: config.color,
                      }}
                    >
                      <StatusIcon className={`w-2.5 h-2.5 ${agent.status === "running" ? "animate-spin" : ""}`} />
                      {config.label}
                    </div>
                  </div>
                  <p className="text-xs truncate" style={{ color: "rgba(230,237,243,0.4)" }}>{agent.task}</p>
                  {agent.result && (
                    <p className="text-xs font-medium mt-0.5" style={{ color: config.color }}>{agent.result}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] mb-0.5" style={{ color: "rgba(230,237,243,0.3)" }}>
                      {agent.completedAt || "In progress..."}
                    </p>
                    <p className="text-xs font-bold" style={{ color: "#f59e0b" }}>{agent.nitSpent} NIT</p>
                  </div>
                  {agent.status === "running" && (
                    <button
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/5"
                      style={{ color: "rgba(230,237,243,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <Pause className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {agent.status === "completed" && (
                    <button
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/5"
                      style={{ color: "rgba(230,237,243,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
