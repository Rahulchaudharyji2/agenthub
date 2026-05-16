import { 
  Search, SlidersHorizontal, TrendingUp, Sparkles, Flame,
  Coins, Hourglass, Scroll, Scale, Map, Feather, LineChart, Mail // New icons
} from "lucide-react";
import { Agent, AgentCard } from "@/components/AgentCard";
const AGENTS: Agent[] = [
  {
    id: "1", name: "Gringotts Auditor",
    description: "Scours your vault ledgers and transaction history to identify discrepancies. Automatically drafts goblin-approved Ministry claim forms.",
    category: "Wealth", rating: 4.9, reviews: 2847, users: "12.4k", price: "15",
    icon: Coins, color: "#34d399", glow: "#34d399",
    tags: ["Ledger", "Wealth", "Automation"], featured: true,
  },
  {
    id: "2", name: "Time-Turner Scheduler",
    description: "Parses your academic syllabus and weaves a temporal study schedule. Ensures you never miss overlapping Arithmancy and Potions lectures.",
    category: "Academia", rating: 4.8, reviews: 1923, users: "8.2k", price: "10",
    icon: Hourglass, color: "#818cf8", glow: "#818cf8",
    tags: ["Temporal", "Study", "Planning"], featured: true,
  },
  {
    id: "3", name: "Rune Decipherer",
    description: "Scrutinizes your Ancient Runes translations for logical flaws and curses. Leaves opinionated, actionable notes in the margins.",
    category: "Spellcraft", rating: 4.7, reviews: 3102, users: "22.1k", price: "20",
    icon: Scroll, color: "#58a6ff", glow: "#58a6ff",
    tags: ["Runes", "Review", "Safety"],
  },
  {
    id: "4", name: "Wizengamot Advisor",
    description: "Reads magical contracts and binding vows, highlighting risky clauses. Generates a plain-English summary for non-lawyers.",
    category: "Ministry Law", rating: 4.6, reviews: 891, users: "3.4k", price: "35",
    icon: Scale, color: "#f59e0b", glow: "#f59e0b",
    tags: ["Parchment", "Contracts", "Analysis"],
  },
  {
    id: "5", name: "Floo Network Planner",
    description: "Finds the fastest Floo connections, Portkey schedules, and safe inns based on your preferences. Books instantly.",
    category: "Transport", rating: 4.8, reviews: 1456, users: "9.7k", price: "12",
    icon: Map, color: "#06b6d4", glow: "#06b6d4",
    tags: ["Booking", "Floo", "Portkey"],
  },
  {
    id: "6", name: "Quick-Quotes Quill",
    description: "Drafts professional Daily Prophet press releases and owl-post pitches based on your enterprise news and target audience.",
    category: "Prophet Press", rating: 4.5, reviews: 567, users: "4.1k", price: "25",
    icon: Feather, color: "#ec4899", glow: "#ec4899",
    tags: ["Writing", "PR", "Quill"],
  },
  {
    id: "7", name: "Arithmancy Analyzer",
    description: "Analyzes complex numerical prophecies, generates visual insights, and writes an executive summary report for the Department of Mysteries.",
    category: "Divination", rating: 4.7, reviews: 2104, users: "15.6k", price: "18",
    icon: LineChart, color: "#a78bfa", glow: "#a78bfa",
    tags: ["Numbers", "Charts", "Reports"],
  },
  {
    id: "8", name: "Owl Post Automator",
    description: "Researches prospects and personalizes enchanted parchment letters. Automatically dispatches sequenced follow-up owls.",
    category: "Commerce", rating: 4.4, reviews: 789, users: "5.2k", price: "22",
    icon: Mail, color: "#f97316", glow: "#f97316",
    tags: ["Owls", "Network", "Commerce"], featured: true,
  },
];

const CATEGORIES = ["All", "Wealth", "Academia", "Spellcraft", "Ministry Law", "Transport", "Prophet Press", "Divination", "Commerce"];

export function Marketplace() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = AGENTS.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  const featured = filtered.filter((a) => a.featured);
  const rest = filtered.filter((a) => !a.featured);

  return (
    <div className="flex-1 overflow-y-auto relative aurora-marketplace">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Page header — frosted so aurora bleeds through */}
      <div className="sticky top-0 z-30 relative glass-nav pb-3">
        <div className="max-w-screen-xl mx-auto px-6 py-3">
          {/* Slim breadcrumb row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: "rgba(230,237,243,0.35)" }}>AgentHub</span>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
              <span className="text-xs font-semibold" style={{ color: "rgba(230,237,243,0.65)" }}>Marketplace</span>
            </div>
            <div
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}
            >
              <Flame className="w-3 h-3" />
              {AGENTS.length} Live
            </div>
          </div>

          {/* Search + filter row */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 glass-panel">
              <Search className="w-3.5 h-3.5 shrink-0 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search familiars by name or description..."
                className="flex-1 bg-transparent text-sm outline-none text-slate-800 dark:text-slate-200"
                style={{ caretColor: "var(--accent-gold)" }}
              />
            </div>
            <button className="flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg transition-all hover:opacity-80 glass-panel text-slate-700 dark:text-slate-300">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>

          {/* Category pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-all"
                  style={{
                    background: active ? "rgba(56,139,253,0.15)" : "rgba(255,255,255,0.04)",
                    border: active ? "1px solid rgba(56,139,253,0.35)" : "1px solid rgba(255,255,255,0.06)",
                    color: active ? "#79c0ff" : "rgba(230,237,243,0.4)",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── GitHub Actions-style hero ── */}
      <div className="max-w-screen-xl mx-auto px-6 pt-14 pb-10 text-center relative z-10">
        <div className="flex items-center justify-center gap-2.5 mb-5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent-gold)", boxShadow: "0 0 10px var(--accent-glow)" }} />
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-amber-500">The Apothecary</span>
        </div>
        <h1 className="font-display text-5xl font-black tracking-tight leading-[1.05] mb-5 animate-emerge text-slate-900 dark:text-white">
          Find the perfect enchantment<br />for any task
        </h1>
        <p className="text-base leading-relaxed max-w-lg mx-auto text-slate-600 dark:text-slate-400">
          Browse 2,400+ specialized familiars and charms. Summon in seconds, pay per result in Galleons.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-6 pb-10">
        {/* Featured */}
        {featured.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <h2 className="text-sm font-semibold" style={{ color: "rgba(230,237,243,0.6)" }}>Featured</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {featured.map((agent, i) => (
                <AgentCard key={agent.id} agent={agent} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* All agents */}
        {rest.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-3.5 h-3.5" style={{ color: "rgba(230,237,243,0.35)" }} />
              <h2 className="text-sm font-semibold" style={{ color: "rgba(230,237,243,0.6)" }}>
                {activeCategory === "All" ? "All Agents" : activeCategory}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {rest.map((agent, i) => (
                <AgentCard key={agent.id} agent={agent} index={featured.length + i} />
              ))}
            </div>
          </section>
        )}

        {/* No results */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: "rgba(230,237,243,0.4)" }}>No agents found</h3>
            <p className="text-xs" style={{ color: "rgba(230,237,243,0.25)" }}>Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
