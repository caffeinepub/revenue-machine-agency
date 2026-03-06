import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const FAQS = [
  {
    q: "Who is this for?",
    a: "Serious business owners, founders, and enterprise leaders targeting significant revenue growth. If you're looking for the cheapest option or a quick fix, this is not for you. We work with brands that are ready to invest in systems that compound.",
  },
  {
    q: "What ROI can I expect?",
    a: "Clients typically see 3–10x return within 90 days depending on the engagement level and market conditions. The Growth and Pro plans are optimised for measurable performance. We set clear KPIs at the start of every engagement.",
  },
  {
    q: "Do you guarantee results?",
    a: "We guarantee execution excellence and strategic rigor. Results depend on market factors, your product, and competitive dynamics — but we've never had a client scale backwards under our watch. We operate as owners, not order-takers.",
  },
  {
    q: "Is there a minimum commitment?",
    a: "Engagements start at 3 months. This is not a quick-fix service — real growth takes strategy, iteration, and time. We build systems designed to compound over months and years, not days.",
  },
  {
    q: "How fast can we start?",
    a: "Onboarding begins within 5 business days of application approval. We conduct a thorough discovery and strategy phase before any execution begins — which means when we launch, we launch with precision.",
  },
  {
    q: "What makes you different?",
    a: "We operate as a growth partner, not a vendor. Every system we build is designed to compound over time. We combine AI-driven automation, data attribution, and human strategic intelligence — not just ad spend and social posts.",
  },
];

export default function FAQSection() {
  const ref = useScrollReveal<HTMLElement>();
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <section ref={ref} className="section-reveal py-24 px-4 sm:px-6" id="faq">
      {/* Background */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 30% at 50% 50%, rgba(0,255,198,0.03) 0%, transparent 70%)",
          height: "600px",
          transform: "translateY(-50%)",
          top: "50%",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-3xl relative">
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "oklch(0.88 0.18 168)", letterSpacing: "0.2em" }}
          >
            Questions
          </p>
          <h2
            className="font-black mb-3"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "white",
              letterSpacing: "-0.03em",
            }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>
            Direct answers. No fluff.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="flex flex-col gap-3"
          value={openItem}
          onValueChange={setOpenItem}
        >
          {FAQS.map((item) => {
            const isOpen = openItem === item.q;
            return (
              <AccordionItem
                key={item.q}
                value={item.q}
                className={`rounded-xl overflow-hidden ${isOpen ? "accordion-item-open" : ""}`}
                style={{
                  background: isOpen
                    ? "rgba(0,255,198,0.04)"
                    : "rgba(255,255,255,0.03)",
                  border: isOpen
                    ? "1px solid rgba(0,255,198,0.35)"
                    : "1px solid rgba(0,255,198,0.1)",
                  backdropFilter: "blur(12px)",
                  boxShadow: isOpen ? "0 0 20px rgba(0,255,198,0.08)" : "none",
                  transition:
                    "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <AccordionTrigger
                  className="px-6 py-5 text-left font-bold hover:no-underline"
                  style={{
                    fontSize: "1rem",
                    transition: "color 0.2s ease",
                    color: isOpen ? "oklch(0.88 0.18 168)" : "white",
                  }}
                >
                  <span className="accordion-trigger-text pr-4">{item.q}</span>
                </AccordionTrigger>
                <AccordionContent
                  className="px-6 pb-5"
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.7,
                    fontSize: "0.925rem",
                  }}
                >
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
