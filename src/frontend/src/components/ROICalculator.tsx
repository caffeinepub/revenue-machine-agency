import { ArrowRight, Calculator, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function ROICalculator() {
  const ref = useScrollReveal<HTMLElement>();
  const [revenue, setRevenue] = useState("");
  const [growth, setGrowth] = useState("");
  const [result, setResult] = useState<{
    additionalRevenue: number;
    roiMultiple: number;
    annualRevenue: number;
  } | null>(null);

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  const calculate = () => {
    const rev = Number.parseFloat(revenue.replace(/,/g, ""));
    const pct = Number.parseFloat(growth);
    if (!rev || !pct || rev <= 0 || pct <= 0) return;

    const additionalRevenue = rev * (pct / 100);
    const investmentMonthly = 24999; // Growth plan baseline
    const roiMultiple = additionalRevenue / investmentMonthly;
    const annualRevenue = (rev + additionalRevenue) * 12;

    setResult({ additionalRevenue, roiMultiple, annualRevenue });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") calculate();
  };

  return (
    <section
      ref={ref}
      className="section-reveal py-24 px-4 sm:px-6"
      id="roi-calculator"
    >
      {/* BG gradient */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0,255,198,0.04) 0%, transparent 70%)",
          height: "600px",
          transform: "translateY(-50%)",
          top: "50%",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4 tracking-widest uppercase"
            style={{
              background: "rgba(0,255,198,0.06)",
              border: "1px solid rgba(0,255,198,0.2)",
              color: "oklch(0.88 0.18 168)",
              letterSpacing: "0.18em",
            }}
          >
            <Calculator size={12} />
            ROI Estimator
          </div>
          <h2
            className="font-black mb-3"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "white",
              letterSpacing: "-0.03em",
            }}
          >
            Estimate Your{" "}
            <span style={{ color: "oklch(0.88 0.18 168)" }}>
              Growth Potential
            </span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>
            See what strategic growth could mean for your business.
          </p>
        </div>

        {/* Calculator card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(0,255,198,0.15)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div>
              <label
                className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.12em",
                }}
                htmlFor="current-revenue"
              >
                Current Monthly Revenue (₹)
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 font-bold"
                  style={{ color: "rgba(0,255,198,0.7)" }}
                >
                  ₹
                </span>
                <input
                  id="current-revenue"
                  type="number"
                  min="0"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. 500000"
                  className="w-full pl-8 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(0,255,198,0.15)",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(0,255,198,0.5)";
                    e.target.style.boxShadow = "0 0 0 2px rgba(0,255,198,0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(0,255,198,0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.12em",
                }}
                htmlFor="target-growth"
              >
                Target Growth (%)
              </label>
              <div className="relative">
                <input
                  id="target-growth"
                  type="number"
                  min="0"
                  max="500"
                  value={growth}
                  onChange={(e) => setGrowth(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. 30"
                  className="w-full pl-4 pr-10 py-3.5 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(0,255,198,0.15)",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(0,255,198,0.5)";
                    e.target.style.boxShadow = "0 0 0 2px rgba(0,255,198,0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(0,255,198,0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2 font-bold"
                  style={{ color: "rgba(0,255,198,0.7)" }}
                >
                  %
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={calculate}
            className="btn-teal w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2"
          >
            Calculate Growth Potential
            <ArrowRight size={18} />
          </button>

          {/* Result card */}
          {result && (
            <div
              className="mt-6 rounded-xl p-6 slide-in-up"
              style={{
                background: "rgba(0,255,198,0.06)",
                border: "1px solid rgba(0,255,198,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp
                  size={18}
                  style={{ color: "oklch(0.88 0.18 168)" }}
                />
                <span
                  className="text-sm font-bold"
                  style={{ color: "oklch(0.88 0.18 168)" }}
                >
                  Growth Projection
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: "rgba(0,0,0,0.3)" }}
                >
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Additional Monthly Revenue
                  </p>
                  <p
                    className="font-black"
                    style={{
                      fontSize: "1.4rem",
                      color: "oklch(0.88 0.18 168)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {formatINR(result.additionalRevenue)}
                  </p>
                </div>
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: "rgba(0,0,0,0.3)" }}
                >
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Estimated ROI Multiple
                  </p>
                  <p
                    className="font-black"
                    style={{
                      fontSize: "1.4rem",
                      color: "oklch(0.88 0.18 168)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {result.roiMultiple.toFixed(1)}x
                  </p>
                </div>
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: "rgba(0,0,0,0.3)" }}
                >
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Projected Annual Revenue
                  </p>
                  <p
                    className="font-black"
                    style={{
                      fontSize: "1.4rem",
                      color: "oklch(0.88 0.18 168)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {formatINR(result.annualRevenue)}
                  </p>
                </div>
              </div>
              <p
                className="text-xs mt-4 text-center"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                * Results are estimates based on average client performance
                data. Individual results vary.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
