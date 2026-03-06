import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import InquiryModal from "./InquiryModal";

export default function FinalCTA() {
  const ref = useScrollReveal<HTMLElement>();
  const [modalOpen, setModalOpen] = useState(false);

  const waLink =
    "https://wa.me/919182768591?text=Hi%2C%20I%27m%20interested%20in%20your%20growth%20services.";

  return (
    <>
      <section
        ref={ref}
        className="section-reveal relative py-32 px-4 sm:px-6 overflow-hidden"
        id="contact"
      >
        {/* Animated radial pulse background */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,255,198,0.08) 0%, rgba(0,255,198,0.02) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none radial-pulse"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0,255,198,0.05) 0%, transparent 60%)",
          }}
        />

        {/* Grid lines accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,255,198,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,198,0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Top glow line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-lg pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,255,198,0.6), transparent)",
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto max-w-3xl relative text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 tracking-widest uppercase"
            style={{
              background: "rgba(0,255,198,0.06)",
              border: "1px solid rgba(0,255,198,0.2)",
              color: "oklch(0.88 0.18 168)",
              letterSpacing: "0.18em",
            }}
          >
            Final Step
          </div>

          <h2
            className="font-black mb-4"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              color: "white",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Ready to Build Your{" "}
            <span className="gradient-animate">Digital Growth Engine?</span>
          </h2>

          <p
            className="text-lg mb-10"
            style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}
          >
            Let's turn strategy into measurable results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-teal btn-3d-lift pulse-glow-anim px-8 py-4 rounded-xl text-base font-black tracking-wide"
              style={{ minWidth: "240px" }}
            >
              Get Custom Quote
            </button>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-teal btn-3d-lift px-8 py-4 rounded-xl text-base font-semibold tracking-wide"
              style={{
                minWidth: "220px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                textDecoration: "none",
              }}
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>

          <p
            className="text-xs mt-8"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Application-based. High-level strategy. No generic proposals.
          </p>
        </div>
      </section>

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        planName="Custom Growth"
        planPrice="Custom"
      />
    </>
  );
}
