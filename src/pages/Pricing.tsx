import { motion } from "framer-motion";
import { Check, Wand2, Landmark, Sparkles } from "lucide-react";

type View = "marketplace" | "my-agents" | "builder" | "earnings" | "pricing";
interface PricingProps {
  onNavigate?: (view: View) => void;
  onSignIn?: (mode?: "signin" | "signup") => void;
}

const PLANS = [
  {
    name: "Free",
    price: "0",
    unit: "Galleons/mo",
    desc: "Perfect for exploring the magical ecosystem.",
    accent: "#58a6ff",
    icon: Wand2,
    highlight: false,
    features: [
      "Access to public Apothecary",
      "Summon up to 3 familiars/month",
      "100 Galleon starter grant",
      "Basic divination dashboard",
      "Guild support",
    ],
    cta: "Begin apprenticeship",
    ctaStyle: {
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.12)",
      color: "#e6edf3",
    },
  },
  {
    name: "Pro",
    price: "290",
    unit: "Galleons/mo",
    desc: "For powerful spellcrafters and freelance cursers.",
    accent: "#388bfd",
    icon: Sparkles,
    highlight: true,
    features: [
      "Everything in Free",
      "Unlimited familiar summons",
      "Visual spellcrafter canvas",
      "Publish & monetize enchantments",
      "Advanced divination insights",
      "Priority Floo processing",
      "Owl post support",
    ],
    cta: "Start Pro trial",
    ctaStyle: {
      background: "linear-gradient(135deg, #388bfd, #7c3aed)",
      border: "1px solid transparent",
      color: "#ffffff",
    },
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "",
    desc: "Tailored for Ministry departments and grand covens.",
    accent: "#a78bfa",
    icon: Landmark,
    highlight: false,
    features: [
      "Everything in Pro",
      "Custom private familiar deployment",
      "Full magical API & ward access",
      "Dedicated Ministry liaison",
      "99.9% unbreakable vow guarantee",
      "SSO & magical audit logs",
      "Volume Galleon pricing",
    ],
    cta: "Dispatch an owl",
    ctaStyle: {
      background: "rgba(167,139,250,0.1)",
      border: "1px solid rgba(167,139,250,0.3)",
      color: "#a78bfa",
    },
  },
];
const FAQ = [
  {
    q: "What are Galleons?",
    a: "Galleons are The Apothecary's native currency. You spend them to summon familiars and earn them when your own enchantments complete tasks for other wizards.",
  },
  {
    q: "Can I earn back more than I spend?",
    a: "Yes — many spellcrafters on Pro earn significantly more Galleons than they spend. Top enchantments earn 500–2,000 Galleons/month passively.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Pro comes with a 14-day free trial, no Gringotts vault key required. You get full access to the spellcrafter canvas and all divination logs.",
  },
  {
    q: "How does enterprise pricing work?",
    a: "Enterprise pricing is tailored to your coven size, usage volume, and magical integration needs. Dispatch an owl to our Ministry liaisons for a custom quote.",
  },
];

export function Pricing({ onNavigate, onSignIn }: PricingProps) {
  return (
    <div className="flex-1 overflow-y-auto relative aurora-pricing">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      {/* Page header — frosted so aurora bleeds through */}
      <div className="sticky top-0 z-30 relative glass-nav pb-3">
        <div className="max-w-screen-xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: "rgba(230,237,243,0.35)" }}>AgentHub</span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
            <span className="text-xs font-semibold" style={{ color: "rgba(230,237,243,0.65)" }}>Pricing</span>
          </div>
        </div>
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* ── Vault Tariffs Hero ── */}
        <div className="text-center mb-14 max-w-2xl mx-auto pt-8">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent-magic)", boxShadow: "0 0 10px var(--accent-glow)" }} />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-purple-500">Gringotts Tariffs</span>
          </div>
          <h1 className="font-display text-5xl font-black tracking-tight leading-[1.05] mb-5 animate-emerge text-slate-900 dark:text-white">
            Pay as you conjure,{" "}
            <span className="gradient-text-magic">
              earn as you craft
            </span>
          </h1>
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Begin your apprenticeship free. Scale to master level. No hidden curses, no surprises.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-14">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                className={`relative rounded-2xl p-6 flex flex-col ${plan.highlight ? "magic-btn-secondary" : "glass-panel"}`}
                style={{
                  border: plan.highlight
                    ? `1px solid ${plan.accent}45`
                    : undefined,
                  boxShadow: plan.highlight
                    ? `0 0 0 1px ${plan.accent}20, 0 0 40px 8px ${plan.accent}18, var(--glass-shadow)`
                    : undefined,
                }}
              >
                {plan.highlight && (
                  <>
                    <div
                      className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${plan.accent}90, transparent)`,
                      }}
                    />
                    <div
                      className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(56,139,253,0.15)",
                        border: "1px solid rgba(56,139,253,0.3)",
                        color: "#79c0ff",
                      }}
                    >
                      MOST POPULAR
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${plan.accent}18`,
                      border: `1px solid ${plan.accent}30`,
                    }}
                  >
                    <Icon className="w-4.5 h-4.5" style={{ color: plan.accent, width: 18, height: 18 }} />
                  </div>
                  <p className="font-display text-sm font-bold text-white">{plan.name}</p>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl font-black text-white">{plan.price}</span>
                    {plan.unit && (
                      <span className="text-sm" style={{ color: "rgba(230,237,243,0.4)" }}>
                        {plan.unit}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "rgba(230,237,243,0.45)" }}>
                    {plan.desc}
                  </p>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check
                        className="w-3.5 h-3.5 mt-0.5 shrink-0"
                        style={{ color: plan.accent }}
                      />
                      <span className="text-xs" style={{ color: "rgba(230,237,243,0.7)" }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSignIn?.("signup")}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 active:scale-[0.98]"
                  style={plan.ctaStyle}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto pb-8">
          <h2 className="font-display text-lg font-bold text-white tracking-tight mb-5 text-center">
            Frequently asked questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="rounded-xl p-4 glass-panel"
              >
                <p className="font-display text-sm font-semibold text-white mb-1.5">{item.q}</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(230,237,243,0.45)" }}>
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
