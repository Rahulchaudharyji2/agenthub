import { useState, useEffect, useRef } from "react";
import {
  motion, AnimatePresence, useInView,
  useScroll, useTransform, useSpring,
} from "framer-motion";
import {
  Store, Wrench, ArrowRight, Star, Shield, Coins, Bot, GitBranch,
  Cpu, Mail, FileText, Search, TrendingUp, CheckCircle2, Zap,
  ChevronDown, Play, Minus, X, ChevronRight,
} from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

type View = "marketplace" | "my-agents" | "builder" | "earnings" | "pricing";
interface HomeProps {
  onNavigate: (view: View) => void;
  onSignIn: (mode?: "signin" | "signup") => void;
}

/* ───────────────────────── TOP NAV DROPDOWNS ───────────────────────── */
const DROPDOWNS: Record<string, { columns: { heading: string; links: { label: string; sub?: string }[] }[] }> = {
  Platform: {
    columns: [
      {
        heading: "BY MAGICAL DISCIPLINE",
        links: [
          { label: "Contract Familiars",   sub: "Browse The Apothecary" },
          { label: "Spellcrafter Canvas",  sub: "Design intricate enchantments" },
          { label: "Gringotts Vault",      sub: "Manage your Galleon balance" },
          { label: "Divination Logs",      sub: "Track familiar performance" },
        ],
      },
      {
        heading: "BY ROLE",
        links: [
          { label: "For Aurors"         },
          { label: "For Shopkeepers"    },
          { label: "For Freelance Cursers" },
          { label: "For Scholars"       },
        ],
      },
    ],
  },
  // Keep the Build and Enterprise sections as they are for now, or update their labels if you want!
  Build: {
    columns: [
      {
        heading: "TOOLS",
        links: [
          { label: "Drag-and-Drop Builder", sub: "Visual workflow canvas" },
          { label: "Agent Templates",        sub: "Start from pre-built agents" },
          { label: "Node Library",           sub: "Triggers, logic, actions" },
          { label: "API Access",             sub: "Integrate anywhere" },
        ],
      },
      {
        heading: "LEARN",
        links: [
          { label: "Documentation"   },
          { label: "Tutorials"       },
          { label: "Community Forum" },
          { label: "View all guides →" },
        ],
      },
    ],
  },
  Enterprise: {
    columns: [
      {
        heading: "BY COMPANY SIZE",
        links: [
          { label: "Startups"     },
          { label: "Small & Medium Teams" },
          { label: "Enterprises"  },
          { label: "Nonprofits"   },
        ],
      },
      {
        heading: "BY USE CASE",
        links: [
          { label: "Automation"          },
          { label: "Research & Analysis" },
          { label: "Content Generation"  },
          { label: "Customer Support"    },
          { label: "View all use cases →" },
        ],
      },
    ],
  },
};

function TopNav({ onNavigate, onSignIn }: { onNavigate: (v: View) => void; onSignIn: (mode?: "signin" | "signup") => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = document.getElementById("landing-scroll");
    if (!el) return;
    const h = () => setScrolled(el.scrollTop > 12);
    el.addEventListener("scroll", h, { passive: true });
    return () => el.removeEventListener("scroll", h);
  }, []);

  const openDropdown = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (DROPDOWNS[label]) setActiveDropdown(label);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const NAV_ITEMS = [
    { label: "Platform",    sub: true,  action: null            },
    { label: "Marketplace", sub: false, action: "marketplace"   },
    { label: "Build",       sub: true,  action: null            },
    { label: "Earn",        sub: false, action: "earnings"      },
    { label: "Enterprise",  sub: true,  action: null            },
    { label: "Pricing",     sub: false, action: "pricing"       },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 glass-nav"
      style={{
        background: scrolled ? "var(--nav-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(28px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(28px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid var(--nav-border)" : "1px solid transparent",
        boxShadow: scrolled ? "var(--glass-shadow)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0 cursor-pointer select-none">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#388bfd,#7c3aed)", boxShadow: "0 0 18px rgba(56,139,253,0.55),0 0 36px rgba(56,139,253,0.18)" }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-sm font-black text-white tracking-tight">AgentHub</span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 relative">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => openDropdown(item.label)}
              onMouseLeave={scheduleClose}
            >
              <button
                className="flex items-center gap-1 px-3 py-2 rounded-md text-[13px] font-medium transition-colors duration-150"
                style={{
                  color: activeDropdown === item.label ? "#e6edf3" : "rgba(230,237,243,0.65)",
                  background: activeDropdown === item.label ? "rgba(255,255,255,0.06)" : "transparent",
                }}
                onClick={() => { if (item.action) onNavigate(item.action as View); }}
              >
                {item.label}
                {item.sub && (
                  <ChevronDown
                    className="w-3 h-3 transition-transform duration-200"
                    style={{ transform: activeDropdown === item.label ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.5 }}
                  />
                )}
              </button>

              {/* Dropdown panel */}
              <AnimatePresence>
                {activeDropdown === item.label && DROPDOWNS[item.label] && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                    className="absolute top-full left-0 mt-2 rounded-2xl overflow-hidden"
                    style={{
                      background: "rgba(13,17,23,0.82)",
                      backdropFilter: "blur(36px) saturate(200%)",
                      WebkitBackdropFilter: "blur(36px) saturate(200%)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      boxShadow:
                        "0 0 0 1px rgba(56,139,253,0.06), " +
                        "0 8px 32px rgba(0,0,0,0.7), " +
                        "0 32px 80px rgba(0,0,0,0.5), " +
                        "inset 0 1px 0 rgba(255,255,255,0.05)",
                      minWidth: 420,
                      zIndex: 100,
                    }}
                  >
                    <div className="p-5 flex gap-8">
                      {DROPDOWNS[item.label].columns.map((col) => (
                        <div key={col.heading} className="flex-1">
                          <p className="text-[10px] font-black tracking-[0.14em] mb-3" style={{ color: "rgba(110,118,129,0.7)" }}>
                            {col.heading}
                          </p>
                          <ul className="space-y-0.5">
                            {col.links.map((link) => (
                              <li key={link.label}>
                                <button
                                  className="w-full text-left px-2 py-1.5 rounded-md transition-all duration-100"
                                  style={{ color: "rgba(230,237,243,0.85)" }}
                                  onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                                    (e.currentTarget as HTMLElement).style.color = "#e6edf3";
                                  }}
                                  onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = "transparent";
                                    (e.currentTarget as HTMLElement).style.color = "rgba(230,237,243,0.85)";
                                  }}
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    if (link.label.includes("Hire Agents") || link.label.includes("Marketplace")) onNavigate("marketplace");
                                    if (link.label.includes("Builder") || link.label.includes("Builder") || link.label.includes("Templates") || link.label.includes("Node") || link.label.includes("Drag")) onNavigate("builder");
                                  }}
                                >
                                  <p className="text-[13px] font-medium leading-tight">{link.label}</p>
                                  {link.sub && <p className="text-[11px] mt-0.5" style={{ color: "rgba(110,118,129,0.6)" }}>{link.sub}</p>}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {/* Footer row */}
                    <div className="px-5 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
                      <button
                        className="text-[12px] font-semibold transition-all duration-100"
                        style={{ color: "#58a6ff" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#79c0ff"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#58a6ff"; }}
                        onClick={() => { setActiveDropdown(null); onNavigate("marketplace"); }}
                      >
                        View all {item.label.toLowerCase()} features →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] cursor-text glass-panel">
            <Search className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            <span className="flex-1 text-slate-500">Search archives...</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded opacity-60">/</kbd>
          </div>
          <button onClick={() => onSignIn("signin")} className="px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-colors hover:text-amber-500">Enter</button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => onSignIn("signup")} className="px-4 py-1.5 rounded-md text-[13px] font-semibold magic-btn-primary">Enroll</motion.button>
        </div>
      </div>
    </header>
  );
}

/* ───────────────────────── CODE WINDOW ───────────────────────── */
const CODE_LINES = [
  { n: 1,  tokens: [{ t: "// ", c: "#6e7681" }, { t: "Enchantment: Gringotts Auditor", c: "#6e7681" }] },
  { n: 2,  tokens: [{ t: "const ", c: "#ff7b72" }, { t: "familiar", c: "#79c0ff" }, { t: " = await ", c: "#e6edf3" }, { t: "Apothecary", c: "#ffa657" }, { t: ".summon({", c: "#e6edf3" }] },
  { n: 3,  tokens: [{ t: "    name: ", c: "#e6edf3" }, { t: '"VaultAuditor"', c: "#a5d6ff" }, { t: ",", c: "#e6edf3" }] },
  { n: 4,  tokens: [{ t: "    directive: ", c: "#e6edf3" }, { t: '"Scour ledgers for missing Galleons"', c: "#a5d6ff" }, { t: ",", c: "#e6edf3" }] },
  { n: 5,  tokens: [{ t: "    urgency: ", c: "#e6edf3" }, { t: '"immediate"', c: "#a5d6ff" }, { t: ",", c: "#e6edf3" }] },
  { n: 6,  tokens: [{ t: "});", c: "#e6edf3" }] },
  { n: 7,  tokens: [] },
  { n: 8,  tokens: [{ t: "// ", c: "#6e7681" }, { t: "Familiar executes autonomously...", c: "#6e7681" }] },
  { n: 9,  tokens: [{ t: "familiar", c: "#79c0ff" }, { t: ".on(", c: "#e6edf3" }, { t: '"task_complete"', c: "#a5d6ff" }, { t: ", parchment => {", c: "#e6edf3" }] },
  { n: 10, tokens: [{ t: "    ministry", c: "#79c0ff" }, { t: ".log(parchment.summary);", c: "#e6edf3" }] },
  { n: 11, tokens: [{ t: '    // ', c: "#6e7681" }, { t: '→ "Discovered 142 Galleons. Owl dispatched."', c: "#34d399" }] },
  { n: 12, tokens: [{ t: "});", c: "#e6edf3" }] },
];

function CodeWindow({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={style} className="relative w-full max-w-[700px] mx-auto">
      {/* Outer purple glow ring — matches the reference */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow:
            "0 0 0 1px rgba(139,92,246,0.25)," +
            "0 0 60px 20px rgba(88,70,164,0.55)," +
            "0 0 130px 60px rgba(88,70,164,0.28)," +
            "0 0 220px 100px rgba(88,70,164,0.12)," +
            "0 40px 100px rgba(0,0,0,0.8)",
        }}
      />

      {/* The actual window */}
      <div
        className="relative overflow-hidden rounded-2xl glass-panel animate-float-organic"
      >
        {/* Title bar */}
        <div className="flex items-center px-5 py-4 border-b border-white/10 dark:border-white/5 bg-white/20 dark:bg-black/20">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-red-400 opacity-80" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 opacity-80" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 opacity-80" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-5 py-1 rounded-md text-[12px] font-medium bg-black/5 dark:bg-white/5 opacity-80">
              agenthub_grimoire.incantation
            </div>
          </div>
          <div className="flex gap-2.5 opacity-30">
            <Minus className="w-3.5 h-3.5" />
            <X className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* File tabs */}
        <div className="flex border-b border-white/10 dark:border-white/5 bg-white/10 dark:bg-black/10">
          {[
            { label: "summon_ritual.rune", type: "RUNE",   tc: "#a78bfa", active: true  },
            { label: "spell_parameters.ink",       type: "INK", tc: "#f59e0b", active: false },
            { label: "divination.scroll",              type: "SCROLL",  tc: "#34d399", active: false },
          ].map((tab) => (
            <div key={tab.label} className="flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-medium select-none" style={{ color: tab.active ? "inherit" : "var(--text-muted)", borderBottom: tab.active ? "2px solid var(--accent-gold)" : "2px solid transparent", background: tab.active ? "rgba(255,255,255,0.05)" : "transparent" }}>
              <span className="text-[10px] font-black" style={{ color: tab.tc }}>{tab.type}</span>
              {tab.label}
            </div>
          ))}
        </div>

        {/* Code area */}
        <div className="px-6 py-5 font-mono text-[13px] leading-[1.9] relative overflow-hidden bg-black/5 dark:bg-black/40 min-h-[290px]">
          {/* Subtle magic shimmer */}
          <div className="absolute left-0 right-0 h-10 pointer-events-none animate-breathe" style={{ background: "linear-gradient(transparent,var(--accent-glow),transparent)", opacity: 0.3 }} />
          {CODE_LINES.map((line, li) => (
            <motion.div key={line.n} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + li * 0.065, duration: 0.22 }} className="flex">
              <span className="select-none w-8 shrink-0 text-right mr-6 font-mono text-[12px] opacity-40">{line.n}</span>
              <span>{line.tokens.map((tok, ti) => <span key={ti} style={{ color: tok.c }}>{tok.t}</span>)}</span>
            </motion.div>
          ))}
          {/* Cursor */}
          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.55, repeat: Infinity, repeatType: "reverse" }} className="inline-block align-middle ml-0.5" style={{ width: 2, height: 16, background: "var(--accent-gold)", borderRadius: 1 }} />
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-2 text-[11px] font-medium" style={{ background: "var(--glass-hover)", borderTop: "1px solid var(--glass-border)" }}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-amber-500" /> AgentHub Guild</span>
            <span>Runic Script</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />Familiar Conjured</span>
            <span>Ancient Runes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── STATS ───────────────────────── */
interface StatConfig { label: string; end: number; decimals: number; prefix: string; suffix: string; icon: React.ElementType; }
const STATS: StatConfig[] = [
  { label: "Familiars Available", end: 2400, decimals: 0, prefix: "",  suffix: "+",  icon: Bot          },
  { label: "Charms Cast",         end: 98,   decimals: 0, prefix: "",  suffix: "k",  icon: CheckCircle2 },
  { label: "Avg Wizard Rating",   end: 4.9,  decimals: 1, prefix: "",  suffix: "★",  icon: Star         },
  { label: "Galleons Recovered",  end: 2.1,  decimals: 1, prefix: "G", suffix: "M",  icon: Coins        },
];

function StatCard({ stat, enabled, index }: { stat: StatConfig; enabled: boolean; index: number }) {
  const Icon = stat.icon;
  const count = useCountUp(stat.end, 2400, stat.decimals, enabled);
  const display = `${stat.prefix}${stat.decimals === 0 ? Math.floor(count).toLocaleString() : count.toFixed(stat.decimals)}${stat.suffix}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={enabled ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="relative flex flex-col items-center py-12 px-6 overflow-hidden group glass-panel"
    >
      <Icon className="w-6 h-6 mb-5 relative z-10" style={{ color: "var(--accent-gold)", filter: "drop-shadow(0 0 10px var(--accent-glow))" }} />
      <p className="font-display font-black mb-2 tabular-nums relative z-10" style={{ fontSize: "clamp(2rem,4vw,2.8rem)", letterSpacing: "-0.025em", lineHeight: 1 }}>
        {display}
      </p>
      <p className="text-[13px] font-medium relative z-10 opacity-70">{stat.label}</p>
    </motion.div>
  );
}

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <section ref={ref} className="border-t border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20">
      <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 border-black/10 dark:border-white/10">
        {STATS.map((stat, i) => <StatCard key={stat.label} stat={stat} enabled={inView} index={i} />)}
      </div>
    </section>
  );
}

/* ───────────────────────── HOW IT WORKS ───────────────────────── */
const HOW_IT_WORKS = [
  { step: "01", title: "Browse The Apothecary", desc: "Explore hundreds of specialized familiars — from binding vows review to automated owl outreach. Filter by discipline or rating.", icon: Store,    color: "#388bfd" },
  { step: "02", title: "Inscribe Your Intent",       desc: "Draft a simple directive on parchment. No complex spellcraft required. Just declare what you need accomplished.",    icon: FileText, color: "#34d399" },
  { step: "03", title: "Autonomous Conjuration",desc: "The familiar executes multi-step rituals — scouring archives, cross-referencing tomes, dispatching owls — entirely on your behalf.", icon: Cpu,      color: "#a78bfa" },
  { step: "04", title: "Review & Prosper",    desc: "Approve the results instantly. If you crafted the enchantment, earn Galleons every time a wizard summons it from the marketplace.",          icon: Coins,    color: "#f59e0b" },
];

/* ───────────────────────── FEATURES ───────────────────────── */
const FEATURES = [
  { icon: GitBranch, title: "Visual Spellcrafter Canvas",  desc: "Drag-and-drop Triggers, Logic, and Actions. Weave intricate enchantments without writing a single line of code.",                                   color: "#388bfd", tag: "Builder"      },
  { icon: Shield,    title: "Warded & Verified",     desc: "Every familiar operates within a protective ward. You control exactly what ledgers and archives they can access.",                         color: "#34d399", tag: "Security"     },
  { icon: Mail,      title: "Ministry Integrations",    desc: "Familiars integrate with modern magical infrastructure: Owl Post, Floo Network, and the Daily Prophet archives.",                        color: "#a78bfa", tag: "Integrations" },
  { icon: Coins,     title: "Galleon Economy",         desc: "Pay per task. Craft a unique spell once and earn passively every time another wizard utilizes your creation.",                                  color: "#f59e0b", tag: "Economy"      },
  { icon: Search,    title: "Sentient Charms",         desc: "Familiars retain context across tasks, learn your preferences, and improve their accuracy with every conjuration.",                              color: "#06b6d4", tag: "AI"           },
  { icon: TrendingUp,title: "Divination Analytics",        desc: "Track usage, Galleon yields, satisfaction scores, and receive prophetic suggestions for optimization.",                                color: "#ec4899", tag: "Analytics"    },
];

/* ───────────────────────── GLOW CARD ───────────────────────── */
function GlowCard({ color, children, delay = 0 }: { color: string; children: React.ReactNode; delay?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -10, scale: 1.015, transition: { type: "spring", stiffness: 260, damping: 20 } }}
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        /* Resting: clean dark card matching image 1 */
        background: hovered
          ? `linear-gradient(145deg, rgba(28,32,48,0.98), rgba(18,21,32,0.98))`
          : `rgba(17, 20, 28, 0.92)`,
        border: `1px solid ${hovered ? `${color}55` : "rgba(255,255,255,0.06)"}`,
        backdropFilter: "blur(24px)",
        /* Hover: intense pop-out glow matching image 2 intensity */
        boxShadow: hovered
          ? [
              `0 0 0 1px ${color}50`,
              `0 0 20px 4px ${color}45`,
              `0 0 60px 12px ${color}28`,
              `0 0 120px 30px ${color}12`,
              `0 28px 70px rgba(0,0,0,0.6)`,
              `inset 0 1px 0 ${color}22`,
            ].join(", ")
          : "0 2px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
        transition: "border-color 0.28s ease, box-shadow 0.28s ease, background 0.28s ease",
        cursor: "default",
      }}
    >
      {/* Top shimmer edge — bright on hover */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: hovered
            ? `linear-gradient(90deg, transparent, ${color}90, ${color}cc, ${color}90, transparent)`
            : `linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)`,
          boxShadow: hovered ? `0 0 12px 2px ${color}50` : "none",
          transition: "background 0.28s ease, box-shadow 0.28s ease",
        }}
      />
      {/* Radial bloom from top center */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% -5%, ${color}18, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.28s ease",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* ───────────────────────── MAIN ───────────────────────── */
export function Home({ onNavigate, onSignIn }: HomeProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Scroll-linked animation refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    container: scrollContainerRef,
    offset: ["start start", "end start"],
  });

  // Smooth spring on scroll progress
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });

  // Text floats up and fades out as editor rises over it
  const textY       = useTransform(smoothProgress, [0.3, 0.75], [0, -80]);
  const textOpacity = useTransform(smoothProgress, [0.3, 0.65], [1, 0]);
  const textScale   = useTransform(smoothProgress, [0.3, 0.75], [1, 0.94]);

  // Editor rises from below (parallax): starts 80px low, arrives at -20px
  const editorY       = useTransform(smoothProgress, [0.2, 0.8], [80, -40]);
  const editorScale   = useTransform(smoothProgress, [0.2, 0.55], [0.96, 1]);
  const editorOpacity = useTransform(smoothProgress, [0.15, 0.38], [0, 1]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); setEmail(""); }
  };

  return (
    <div
      id="landing-scroll"
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden"
      style={{ position: "relative" }}
    >
      <TopNav onNavigate={onNavigate} onSignIn={onSignIn} />

      {/* ═══════════ HERO (tall — enables scroll-over effect) ═══════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{
          minHeight: "200vh",
          background:
            "radial-gradient(ellipse 130% 60% at 50% -5%,var(--accent-glow) 0%,transparent 58%)," +
            "radial-gradient(ellipse 75% 45% at 82% 10%,rgba(167,139,250,0.15) 0%,transparent 48%)," +
            "radial-gradient(ellipse 55% 38% at 18% 22%,var(--accent-glow) 0%,transparent 48%)," +
            "var(--bg-primary)",
        }}
      >
        {/* Grid */}
        <div className="absolute inset-0 grid-bg opacity-35 pointer-events-none" />
        {/* Aurora orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="aurora-orb animate-drift"      style={{ width: 1100, height: 900, top: "-35%", left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,var(--accent-glow) 0%,transparent 65%)" }} />
          <div className="aurora-orb animate-drift-slow" style={{ width: 600,  height: 600, bottom: "20%", right: "-8%", background: "radial-gradient(circle,rgba(167,139,250,0.15) 0%,transparent 65%)" }} />
          <div className="aurora-orb animate-drift"      style={{ width: 500,  height: 500, bottom: "20%", left:  "-8%", background: "radial-gradient(circle,var(--accent-glow) 0%,transparent 65%)", animationDelay: "10s" }} />
        </div>

        {/* ── Sticky text block ── */}
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 pointer-events-none" style={{ zIndex: 1 }}>
          <motion.div style={{ y: textY, opacity: textOpacity, scale: textScale }} className="text-center max-w-4xl mx-auto pointer-events-auto">
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full text-[12px] font-semibold glass-panel text-amber-500"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              The Guild is Open — Join 98,000+ Wizards
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="font-display font-extrabold tracking-tight mb-8"
              style={{ fontSize: "clamp(3.5rem,7vw,5.5rem)", lineHeight: 1.04, letterSpacing: "-0.03em" }}
            >
              <span style={{ color: "var(--text-primary)" }}>Modern spellcraft for</span><br />
              <span className="gradient-text-magic">
                the automated wizard
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="text-[17px] leading-relaxed mb-12 max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}
            >
              Summon specialized familiars to handle your tasks end-to-end — from vault audits to Ministry law review. Weave your own enchantments and earn Galleons passively.
            </motion.p>

            {/* Email + CTA */}
            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch gap-2 max-w-xl mx-auto mb-5"
            >
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Send an owl (email)"
                className="flex-1 px-4 py-3.5 rounded-lg text-[14px] outline-none text-slate-800 dark:text-white glass-panel"
                onFocus={(e) => { e.target.style.borderColor = "var(--accent-gold)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                onBlur={(e)  => { e.target.style.borderColor = "var(--glass-border)";  e.target.style.boxShadow = "var(--glass-shadow)"; }}
              />
              <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="magic-btn-primary px-6 py-3.5 rounded-lg text-[14px] font-semibold whitespace-nowrap">
                <AnimatePresence mode="wait">
                  {submitted
                    ? <motion.span key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" />Owl Dispatched!</motion.span>
                    : <motion.span key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Enroll in the Guild</motion.span>}
                </AnimatePresence>
              </motion.button>
            </motion.form>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="flex items-center justify-center gap-3">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => onNavigate("marketplace")} className="magic-btn-secondary flex items-center gap-2 px-6 py-3 rounded-lg text-[14px] font-semibold">
                <Store className="w-4 h-4 text-amber-500" /> Browse The Apothecary
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => onNavigate("builder")} className="magic-btn-secondary flex items-center gap-2 px-6 py-3 rounded-lg text-[14px] font-semibold">
                <Play className="w-4 h-4 text-amber-500" /> Open the Spellcrafter
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Editor: natural flow in second 100vh, rises via parallax ── */}
        <div
          className="flex justify-center items-start px-6 pb-16 relative"
          style={{ zIndex: 10, marginTop: "-8vh" }}
        >
          <motion.div
            style={{ y: editorY, scale: editorScale, opacity: editorOpacity }}
            className="w-full max-w-[720px]"
          >
            {/* Purple bloom above editor — makes text appear to go behind it */}
            <div
              className="absolute -top-28 left-1/2 -translate-x-1/2 w-[130%] h-44 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 100% 100% at 50% 100%,rgba(88,70,164,0.7),rgba(60,30,140,0.3) 50%,transparent 75%)", filter: "blur(24px)", zIndex: -1 }}
            />
            <CodeWindow />
          </motion.div>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <StatsSection />

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="px-8 py-28 relative">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-amber-500">How it works</p>
            <h2 className="font-display font-bold mb-5" style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)", lineHeight: 1.08, letterSpacing: "-0.022em", color: "var(--text-primary)" }}>
              From intent to result in{" "}
              <span className="gradient-text-magic">minutes</span>
            </h2>
            <p className="text-[15px] max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>No complicated setup. No learning curve. Describe what you need, and the familiar handles the rest.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {HOW_IT_WORKS.map((item, i) => {
              const Icon = item.icon;
              return (
                <GlowCard key={item.step} color={item.color} delay={i * 0.1}>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${item.color}12`, border: `1px solid ${item.color}30`, boxShadow: `0 0 24px ${item.color}25,inset 0 1px 0 ${item.color}18` }}>
                      <Icon className="w-6 h-6" style={{ color: item.color, filter: `drop-shadow(0 0 7px ${item.color}90)` }} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black font-mono tracking-[0.22em] mb-2" style={{ color: item.color }}>{item.step}</p>
                      <h3 className="font-display font-bold text-white text-[15px] mb-2.5 leading-tight">{item.title}</h3>
                      <p className="text-[13px] leading-relaxed" style={{ color: "#6e7681" }}>{item.desc}</p>
                    </div>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="px-8 py-28" style={{ background: "#0d1117", borderTop: "1px solid rgba(48,54,61,0.5)" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: "#a78bfa" }}>Platform</p>
            <h2 className="font-display font-bold text-white mb-5" style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)", lineHeight: 1.08, letterSpacing: "-0.022em" }}>
              Built for{" "}
              <span style={{ background: "linear-gradient(135deg,#c4b5fd,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>builders and hirers</span>
            </h2>
            <p className="text-[15px] max-w-lg mx-auto" style={{ color: "#6e7681" }}>All the tools you need to hire AI agents — or build and monetize your own.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <GlowCard key={f.title} color={f.color} delay={i * 0.07}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: `${f.color}12`, border: `1px solid ${f.color}28`, boxShadow: `0 0 22px ${f.color}22` }}>
                    <Icon className="w-5 h-5" style={{ color: f.color, filter: `drop-shadow(0 0 6px ${f.color}90)` }} />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-display font-bold text-white text-[14px]">{f.title}</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${f.color}12`, border: `1px solid ${f.color}25`, color: f.color }}>{f.tag}</span>
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#6e7681" }}>{f.desc}</p>
                </GlowCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="px-8 py-28" style={{ background: "#0a0c12", borderTop: "1px solid rgba(48,54,61,0.5)" }}>
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center rounded-3xl p-16 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.022)", border: "1px solid rgba(48,54,61,0.8)", backdropFilter: "blur(28px)", boxShadow: "0 0 0 1px rgba(56,139,253,0.05),0 32px 100px rgba(0,0,0,0.55),0 0 160px rgba(88,70,164,0.14)" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 90% 60% at 50% 0%,rgba(88,70,164,0.28),transparent 65%)" }} />
          <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(139,92,246,0.7),rgba(56,139,253,0.7),transparent)", boxShadow: "0 0 28px rgba(88,70,164,0.5)" }} />

          <div className="relative z-10">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{ background: "linear-gradient(135deg,#388bfd,#7c3aed)", boxShadow: "0 0 44px rgba(56,139,253,0.55),0 0 88px rgba(124,58,237,0.28)" }}
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="font-display font-bold text-white mb-4" style={{ fontSize: "clamp(1.7rem,4vw,2.6rem)", lineHeight: 1.08, letterSpacing: "-0.022em" }}>Ready to summon your first familiar?</h2>
            <p className="text-[15px] mb-10 max-w-md mx-auto" style={{ color: "#6e7681", lineHeight: 1.75 }}>Join thousands of wizards reclaiming hours every week. Your first automated task requires merely 10 Galleons.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => onNavigate("marketplace")} className="btn-primary-gh flex items-center gap-2.5 px-8 py-3.5 rounded-lg text-[14px] font-semibold text-white">
                <Store className="w-4 h-4" /> Explore The Apothecary <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => onNavigate("builder")} className="btn-secondary-gh flex items-center gap-2.5 px-8 py-3.5 rounded-lg text-[14px] font-semibold" style={{ color: "rgba(230,237,243,0.85)" }}>
                <Wrench className="w-4 h-4" /> Spellcraft &amp; Earn
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <div className="px-8 py-10 text-center" style={{ borderTop: "1px solid rgba(48,54,61,0.5)", background: "#0a0c12" }}>
        <p className="text-[12px]" style={{ color: "#484f58" }}>© 2026 AgentHub, Inc. · The AI Agent Marketplace · Built for the future of work</p>
      </div>
    </div>
  );
}
