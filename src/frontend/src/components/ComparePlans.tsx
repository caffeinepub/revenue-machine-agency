import { Check, X } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

type PlanKey = "starter" | "growth" | "pro" | "enterprise";

interface Feature {
  name: string;
  starter: boolean;
  growth: boolean;
  pro: boolean;
  enterprise: boolean;
}

const FEATURES: Feature[] = [
  {
    name: "Social Media Management",
    starter: true,
    growth: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "Paid Ads Management",
    starter: false,
    growth: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "SEO Optimization",
    starter: true,
    growth: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "Email Automation",
    starter: false,
    growth: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "CRM Integration",
    starter: false,
    growth: false,
    pro: true,
    enterprise: true,
  },
  {
    name: "Dedicated Manager",
    starter: false,
    growth: false,
    pro: true,
    enterprise: true,
  },
  {
    name: "Unlimited Campaigns",
    starter: false,
    growth: false,
    pro: false,
    enterprise: true,
  },
  {
    name: "AI Integrations",
    starter: false,
    growth: false,
    pro: false,
    enterprise: true,
  },
  {
    name: "SLA Support",
    starter: false,
    growth: false,
    pro: false,
    enterprise: true,
  },
  {
    name: "Quarterly Roadmap",
    starter: false,
    growth: false,
    pro: false,
    enterprise: true,
  },
];

const PLAN_NAMES: {
  key: PlanKey;
  label: string;
  price: string;
  popular?: boolean;
}[] = [
  { key: "starter", label: "Starter", price: "₹9,999" },
  { key: "growth", label: "Growth", price: "₹24,999", popular: true },
  { key: "pro", label: "Pro", price: "₹49,999" },
  { key: "enterprise", label: "Enterprise", price: "₹99,999" },
];

export default function ComparePlans() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="section-reveal py-24 px-4 sm:px-6"
      id="compare"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "oklch(0.88 0.18 168)", letterSpacing: "0.2em" }}
          >
            Side by Side
          </p>
          <h2
            className="font-black mb-3"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "white",
              letterSpacing: "-0.03em",
            }}
          >
            Compare All Plans
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>
            Everything you need to make the right decision.
          </p>
        </div>

        {/* Table wrapper with horizontal scroll on mobile */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(0,255,198,0.12)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              {/* Sticky header */}
              <thead>
                <tr
                  style={{
                    background: "rgba(0,255,198,0.05)",
                    borderBottom: "1px solid rgba(0,255,198,0.12)",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  <th
                    className="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider"
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      width: "35%",
                      letterSpacing: "0.12em",
                    }}
                  >
                    Features
                  </th>
                  {PLAN_NAMES.map((p) => (
                    <th
                      key={p.key}
                      className="py-4 px-3 text-center"
                      style={{ width: "16.25%" }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className="text-xs font-black uppercase tracking-wide"
                          style={{
                            color: p.popular ? "oklch(0.88 0.18 168)" : "white",
                          }}
                        >
                          {p.label}
                        </span>
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "rgba(255,255,255,0.45)" }}
                        >
                          {p.price} one-time
                        </span>
                        {p.popular && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-bold"
                            style={{
                              background: "oklch(0.88 0.18 168)",
                              color: "#050A0A",
                              fontSize: "0.6rem",
                              letterSpacing: "0.05em",
                            }}
                          >
                            POPULAR
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature, i) => (
                  <tr
                    key={feature.name}
                    style={{
                      background:
                        i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                      borderBottom:
                        i < FEATURES.length - 1
                          ? "1px solid rgba(0,255,198,0.06)"
                          : "none",
                    }}
                  >
                    <td
                      className="py-3.5 px-5 text-sm font-medium"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                    >
                      {feature.name}
                    </td>
                    {PLAN_NAMES.map((p) => (
                      <td key={p.key} className="py-3.5 px-3 text-center">
                        {feature[p.key] ? (
                          <div className="flex justify-center">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{
                                background: "rgba(0,255,198,0.1)",
                                border: "1px solid rgba(0,255,198,0.25)",
                              }}
                            >
                              <Check
                                size={12}
                                style={{ color: "oklch(0.88 0.18 168)" }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <X
                              size={16}
                              style={{ color: "rgba(255,255,255,0.2)" }}
                            />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
