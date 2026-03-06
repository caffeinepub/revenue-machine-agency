import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const timer = setTimeout(() => {
      el.classList.add("hero-visible");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToEnterprise = () => {
    document
      .getElementById("enterprise")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden"
      style={{ paddingTop: "5rem", paddingBottom: "4rem" }}
    >
      {/* Radial gradient bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,255,198,0.07) 0%, rgba(0,255,198,0.02) 40%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-2xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,255,198,0.5), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Content wrapper */}
      <div
        className="relative z-10 max-w-5xl mx-auto"
        style={{
          opacity: 0,
          transform: "translateY(40px)",
          transition:
            "opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)",
        }}
        ref={(el) => {
          if (el) {
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }, 200);
          }
        }}
      >
        {/* Pre-badge */}
        <div
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{
            background: "rgba(0,255,198,0.08)",
            border: "1px solid rgba(0,255,198,0.25)",
            color: "oklch(0.88 0.18 168)",
            letterSpacing: "0.2em",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: "oklch(0.88 0.18 168)",
              boxShadow: "0 0 8px rgba(0,255,198,0.8)",
            }}
          />
          India's Premier Growth Architecture Agency
        </div>

        {/* Main headline */}
        <h1
          className="font-display font-black leading-none mb-6"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          <span className="text-white block">We Don't Sell Services.</span>
          <span className="block mt-2">
            We Build{" "}
            <span
              className="inline"
              style={{
                color: "oklch(0.88 0.18 168)",
                textShadow:
                  "0 0 40px rgba(0,255,198,0.6), 0 0 80px rgba(0,255,198,0.3)",
              }}
            >
              Revenue Machines.
            </span>
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="mx-auto mb-10 font-body"
          style={{
            maxWidth: "680px",
            fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.7,
            fontWeight: 400,
          }}
        >
          Strategic Digital Growth Systems for Businesses Ready to Scale Beyond{" "}
          <span style={{ color: "oklch(0.88 0.18 168)", fontWeight: 600 }}>
            ₹1 Crore.
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            type="button"
            onClick={scrollToPricing}
            className="btn-teal pulse-glow-anim px-8 py-4 rounded-xl text-base font-bold tracking-wide"
            style={{ minWidth: "260px", fontSize: "1rem" }}
          >
            Book High-Level Strategy Call
          </button>
          <button
            type="button"
            onClick={scrollToEnterprise}
            className="btn-outline-teal px-8 py-4 rounded-xl text-base font-semibold tracking-wide"
            style={{ minWidth: "220px", fontSize: "1rem" }}
          >
            View Enterprise Solutions
          </button>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {["Performance-driven", "Data-backed", "ROI-focused"].map((label) => (
            <div
              key={label}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              <CheckCircle2
                size={16}
                style={{ color: "oklch(0.88 0.18 168)", flexShrink: 0 }}
              />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll down widget */}
      <button
        type="button"
        onClick={scrollToPricing}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 group"
        style={{ color: "rgba(255,255,255,0.4)" }}
        aria-label="Scroll down"
        data-ocid="hero.scroll_down.button"
      >
        {/* Animated text */}
        <span
          className="scroll-text-anim text-xs font-semibold uppercase"
          style={{
            letterSpacing: "0.25em",
            color: "oklch(0.88 0.18 168 / 70%)",
          }}
        >
          Scroll Down
        </span>

        {/* Mouse outline */}
        <div
          className="relative flex items-start justify-center rounded-full"
          style={{
            width: "26px",
            height: "42px",
            border: "2px solid oklch(0.88 0.18 168 / 50%)",
            borderRadius: "13px",
            boxShadow: "0 0 12px rgba(0,255,198,0.2)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          {/* Scrolling dot inside mouse */}
          <span
            className="scroll-mouse-dot absolute top-[6px] rounded-full"
            style={{
              width: "4px",
              height: "4px",
              background: "oklch(0.88 0.18 168)",
              boxShadow: "0 0 6px rgba(0,255,198,0.9)",
            }}
          />
        </div>

        {/* Cascading chevrons */}
        <div
          className="flex flex-col items-center"
          style={{ gap: "0px", marginTop: "-4px" }}
        >
          {/* Chevron 1 */}
          <svg
            className="chevron-1"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            role="img"
            aria-label="scroll down"
          >
            <title>scroll down</title>
            <path
              d="M1 1L7 7L13 1"
              stroke="oklch(0.88 0.18 168)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Chevron 2 */}
          <svg
            className="chevron-2"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            role="img"
            aria-label="scroll down"
            style={{ marginTop: "-3px" }}
          >
            <title>scroll down</title>
            <path
              d="M1 1L7 7L13 1"
              stroke="oklch(0.88 0.18 168 / 60%)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Chevron 3 */}
          <svg
            className="chevron-3"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            role="img"
            aria-label="scroll down"
            style={{ marginTop: "-3px" }}
          >
            <title>scroll down</title>
            <path
              d="M1 1L7 7L13 1"
              stroke="oklch(0.88 0.18 168 / 30%)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
    </section>
  );
}
