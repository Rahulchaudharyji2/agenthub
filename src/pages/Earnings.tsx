import { motion } from "framer-motion";
import {
  Coins, TrendingUp, ArrowUpRight, ArrowDownRight, Archive, Sparkles, Download,
} from "lucide-react";

const TRANSACTIONS = [
  { type: "credit", label: "Commission: Gringotts Auditor",         amount: "+15 Galleons", time: "2h ago",  hash: "0x4a2f" },
  { type: "debit",  label: "Contracted: Rune Decipherer",           amount: "-20 Galleons", time: "5h ago",  hash: "0x9b1c" },
  { type: "credit", label: "Commission: Quick-Quotes Quill",        amount: "+25 Galleons", time: "1d ago",  hash: "0x3e7a" },
  { type: "credit", label: "Merlin Order Stipend (Referral)",       amount: "+50 Galleons", time: "2d ago",  hash: "0xf12d" },
  { type: "debit",  label: "Contracted: Time-Turner Scheduler",     amount: "-10 Galleons", time: "3d ago",  hash: "0x8c0e" },
  { type: "credit", label: "Commission: Arithmancy Analyzer",       amount: "+18 Galleons", time: "4d ago",  hash: "0x2b5f" },
];

export function Earnings() {
  return (
    <div className="flex-1 overflow-y-auto relative aurora-earnings">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      {/* Page header — frosted so aurora bleeds through */}
      <div className="sticky top-0 z-30 relative glass-nav pb-3">
        <div className="max-w-screen-xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: "rgba(230,237,243,0.35)" }}>AgentHub</span>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
              <span className="text-xs font-semibold" style={{ color: "rgba(230,237,243,0.65)" }}>Earnings</span>
            </div>
            <button className="flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-lg transition-all hover:opacity-90 glass-panel">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ── Vault Hero ── */}
      <div className="max-w-screen-xl mx-auto px-6 pt-14 pb-10 text-center relative z-10">
        <div className="flex items-center justify-center gap-2.5 mb-5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent-gold)", boxShadow: "0 0 10px var(--accent-glow)" }} />
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-amber-500">Gringotts Vault Ledger</span>
        </div>
        <h1 className="font-display text-5xl font-black tracking-tight leading-[1.05] mb-5 animate-emerge text-slate-900 dark:text-white">
          Your vault balance,<br />crystal clear
        </h1>
        <p className="text-base leading-relaxed max-w-lg mx-auto" style={{ color: "rgba(230,237,243,0.45)" }}>
          Track every deposit, commission, and withdrawal. Your Galleon balance, protected by ancient enchantments.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-6 pb-10">
        {/* Balance hero card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl p-6 mb-5 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(249,115,22,0.06) 60%, rgba(17,20,28,0.95) 100%)",
            border: "1px solid rgba(245,158,11,0.18)",
            boxShadow: "0 0 60px rgba(245,158,11,0.06), 0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          {/* Background glow */}
          <div
            className="absolute -right-10 -top-10 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12), transparent 70%)" }}
          />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-lg"
                  style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)", boxShadow: "0 0 20px rgba(245,158,11,0.35)" }}
                >
                  G
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: "rgba(230,237,243,0.45)" }}>Vault Balance</p>
                  <p className="text-xs font-semibold" style={{ color: "#f59e0b" }}>Galleons</p>
                </div>
              </div>
              <p className="font-display text-4xl font-black text-white mb-2">
                2,847 <span className="text-2xl" style={{ color: "#f59e0b" }}>G</span>
              </p>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "#34d399" }}>
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+127 G this week</span>
              </div>
            </div>
            <div className="flex gap-2 mt-1">
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg,#f59e0b,#f97316)",
                  color: "white",
                  boxShadow: "0 0 16px rgba(245,158,11,0.3)",
                }}
              >
                Top Up
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(230,237,243,0.7)",
                }}
              >
                Withdraw
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Accumulated", value: "4,210 G", icon: ArrowUpRight,  color: "#34d399", change: "+22%"        },
            { label: "Total Contracted",  value: "1,363 G", icon: ArrowDownRight, color: "#f43f5e", change: "-8%"         },
            { label: "Familiars Built",   value: "2",       icon: Archive,        color: "#818cf8", change: "Active"      },
            { label: "Referrals",         value: "6",       icon: Sparkles,       color: "#06b6d4", change: "+50 G bonus" },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="rounded-xl p-4 glass-panel"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${card.color}15`, border: `1px solid ${card.color}25` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: card.color }} />
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: card.color }}>{card.change}</span>
                </div>
                <p className="font-display text-lg font-black text-white mb-0.5">{card.value}</p>
                <p className="text-xs" style={{ color: "rgba(230,237,243,0.4)" }}>{card.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Transactions table */}
        <div className="rounded-xl overflow-hidden glass-panel">
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <h2 className="text-sm font-semibold" style={{ color: "rgba(230,237,243,0.6)" }}>Recent Transactions</h2>
            <span className="text-xs" style={{ color: "rgba(230,237,243,0.3)" }}>{TRANSACTIONS.length} records</span>
          </div>

          {/* Table header */}
          <div
            className="grid grid-cols-12 px-5 py-2.5 text-[11px] font-semibold"
            style={{
              color: "rgba(230,237,243,0.35)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              background: "rgba(255,255,255,0.01)",
            }}
          >
            <span className="col-span-1">Type</span>
            <span className="col-span-6">Description</span>
            <span className="col-span-2 text-center">Hash</span>
            <span className="col-span-1 text-center">Time</span>
            <span className="col-span-2 text-right">Amount</span>
          </div>

          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {TRANSACTIONS.map((tx, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.04 }}
                className="grid grid-cols-12 items-center px-5 py-3 hover:bg-white/[0.02] transition-all"
              >
                <div className="col-span-1">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      background: tx.type === "credit" ? "rgba(52,211,153,0.1)" : "rgba(244,63,94,0.08)",
                      border: tx.type === "credit" ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(244,63,94,0.18)",
                    }}
                  >
                    {tx.type === "credit"
                      ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                      : <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />}
                  </div>
                </div>
                <p className="col-span-6 text-xs truncate pr-4" style={{ color: "rgba(230,237,243,0.7)" }}>{tx.label}</p>
                <p className="col-span-2 text-center text-[10px] font-mono" style={{ color: "rgba(230,237,243,0.25)" }}>{tx.hash}</p>
                <p className="col-span-1 text-center text-[10px]" style={{ color: "rgba(230,237,243,0.3)" }}>{tx.time}</p>
                <p
                  className="col-span-2 text-right text-xs font-bold"
                  style={{ color: tx.type === "credit" ? "#34d399" : "#f43f5e" }}
                >
                  {tx.amount}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
