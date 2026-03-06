import { Check } from "lucide-react";
import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import InquiryModal from "./InquiryModal";

const FEATURES = [
  "Multi-country Ad Scaling",
  "Advanced Attribution Modeling",
  "Dedicated In-House Team",
  "AI-Driven Automation Systems",
  "Custom CRM Integrations",
  "Board-Level Performance Reporting",
  "Full Brand Positioning Strategy",
  "Personal Strategy Intensives",
];

export default function EnterpriseSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const ref = useScrollReveal<HTMLElement>();

  return (
    <>
      <section
        id="enterprise"
        ref={ref}
        className="section-reveal relative py-24 px-4 sm:px-6 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #020808 0%, #020505 100%)",
          borderTop: "1px solid rgba(0,255,198,0.08)",
          borderBottom: "1px solid rgba(0,255,198,0.08)",
        }}
      >
        {/* Animated border glow */}
        <div
          className="absolute inset-0 enterprise-glow pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,255,198,0.04) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Corner accents */}
        <div
          className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 0% 0%, rgba(0,255,198,0.06) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 100% 100%, rgba(0,255,198,0.06) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto relative">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-14">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5 tracking-widest uppercase"
                style={{
                  background: "rgba(0,255,198,0.06)",
                  border: "1px solid rgba(0,255,198,0.2)",
                  color: "oklch(0.88 0.18 168)",
                  letterSpacing: "0.18em",
                }}
              >
                Ultra-Premium
              </div>
              <h2
                className="font-black mb-4"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  color: "white",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                Custom Enterprise{" "}
                <span
                  style={{
                    color: "oklch(0.88 0.18 168)",
                    textShadow: "0 0 40px rgba(0,255,198,0.5)",
                  }}
                >
                  Growth Architecture
                </span>
              </h2>
              <p
                className="text-lg"
                style={{
                  color: "rgba(255,255,255,0.55)",
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                For organisations engineering market dominance.
              </p>
            </div>

            {/* Features grid */}
            <div
              className="rounded-2xl p-8 mb-8"
              style={{
                background: "rgba(0,255,198,0.02)",
                border: "1px solid rgba(0,255,198,0.12)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FEATURES.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(0,255,198,0.1)",
                        border: "1px solid rgba(0,255,198,0.3)",
                      }}
                    >
                      <Check
                        size={12}
                        style={{ color: "oklch(0.88 0.18 168)" }}
                      />
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Minimum engagement */}
            <div
              className="text-center mb-10 px-8 py-6 rounded-2xl"
              style={{
                background: "rgba(0,255,198,0.04)",
                border: "1px solid rgba(0,255,198,0.2)",
              }}
            >
              <p
                className="text-xs font-bold tracking-widest uppercase mb-2"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.2em",
                }}
              >
                Minimum Engagement
              </p>
              <p
                className="font-black"
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  color: "oklch(0.88 0.18 168)",
                  textShadow: "0 0 30px rgba(0,255,198,0.4)",
                  letterSpacing: "-0.03em",
                }}
              >
                ₹75,000+
                <span
                  className="text-base font-semibold ml-2"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  one-time
                </span>
              </p>
              <p
                className="text-xs mt-2"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Custom scoping. No template packages. No compromises.
              </p>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="btn-teal teal-glow px-10 py-5 rounded-2xl text-base font-black tracking-wide"
                style={{ letterSpacing: "0.04em" }}
              >
                Request Private Consultation
              </button>
              <p
                className="text-xs mt-4"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Application-based onboarding only. Serious inquiries only.
              </p>
            </div>
          </div>
        </div>
      </section>

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        planName="Enterprise Custom"
        planPrice="₹75,000+"
      />
    </>
  );
}
