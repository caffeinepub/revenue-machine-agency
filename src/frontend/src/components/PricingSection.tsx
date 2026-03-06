import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Star,
} from "lucide-react";
import { useRef, useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import InquiryModal from "./InquiryModal";

interface Plan {
  id: string;
  name: string;
  price: string;
  priceNum: string;
  tag: string;
  totalValue: string;
  features: string[];
  cta: string;
  popular?: boolean;
  scarcity?: string;
  isEnterprise?: boolean;
  isPro?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "₹4,999",
    priceNum: "₹4,999",
    tag: "For Serious Beginners",
    totalValue: "₹35,000",
    features: [
      "Core Social Media Management",
      "Basic SEO Setup",
      "Analytics Tracking",
      "Monthly Performance Report",
      "Strategy Consultation Call",
      "2 Social Platforms",
      "Monthly Content Calendar",
      "Basic Ad Setup",
      "Keyword Research",
      "Google Analytics Integration",
      "Monthly Blog Post",
      "Audience Insights Report",
      "Email Newsletter Setup",
      "Brand Voice Guidelines",
      "Competitor Snapshot",
      "Onboarding Strategy Session",
    ],
    cta: "Book Starter Plan",
  },
  {
    id: "growth",
    name: "Growth",
    price: "₹12,499",
    priceNum: "₹12,499",
    tag: "For Businesses Ready to Scale",
    totalValue: "₹95,000",
    popular: true,
    features: [
      "Multi-Platform Social Media",
      "Paid Ads Management",
      "SEO Optimization",
      "Email Automation",
      "Retargeting Setup",
      "Bi-Weekly Reports",
      "Conversion Improvements",
      "Lead Generation System",
      "Content Strategy",
      "Google Ads Setup",
      "Facebook & Instagram Ads",
      "Analytics Dashboard",
      "Audience Targeting",
      "Ad Creative Strategy",
      "Monthly Strategy Call",
      "Campaign Performance Review",
    ],
    cta: "Start Scaling Now",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹24,999",
    priceNum: "₹24,999",
    tag: "For Established Brands",
    totalValue: "₹1,85,000",
    isPro: true,
    features: [
      "Full Funnel Marketing",
      "Paid Ads + SEO + Social",
      "CRM Automation Setup",
      "Weekly Strategy Calls",
      "Influencer Integration",
      "Conversion Optimization",
      "Advanced Reporting Suite",
      "Growth Dashboard Access",
      "Priority Support",
      "Dedicated Strategist",
      "Email Marketing Automation",
      "Retargeting Campaigns",
      "Competitor Analysis",
      "Landing Page Optimization",
      "Monthly ROI Reports",
      "Bi-Weekly Performance Review",
    ],
    cta: "Get Custom Quote",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹49,999",
    priceNum: "₹49,999",
    tag: "For Scaling Companies & Enterprises",
    totalValue: "₹3,50,000",
    isEnterprise: true,
    scarcity: "Only 3 onboarding slots per month",
    features: [
      "Dedicated Growth Team",
      "Advanced Automation Systems",
      "Multi-channel Paid Ads",
      "Enterprise SEO Strategy",
      "Custom Funnel Systems",
      "AI Integrations & Automation",
      "Dedicated Account Manager",
      "SLA Priority Support",
      "Unlimited Campaigns",
      "Quarterly Growth Roadmap",
      "Advanced Attribution Modeling",
      "Custom CRM Integrations",
      "Board-Level Reporting",
      "Full Brand Strategy",
      "Multi-Country Ad Scaling",
      "Personal Strategy Intensives",
    ],
    cta: "Apply for Enterprise Plan",
  },
];

function PricingCard({
  plan,
  onApply,
  delay,
}: {
  plan: Plan;
  onApply: (p: Plan) => void;
  delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const revealRef = useScrollReveal<HTMLDivElement>(delay);
  const [priceHovered, setPriceHovered] = useState(false);

  const isLargeCard = plan.isEnterprise || plan.isPro;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    }
  };

  const cardStyle: React.CSSProperties = plan.popular
    ? {
        background: "rgba(0,255,198,0.05)",
        border: "1px solid rgba(0,255,198,0.4)",
        boxShadow:
          "0 0 40px rgba(0,255,198,0.15), 0 0 80px rgba(0,255,198,0.05), 0 20px 60px rgba(0,0,0,0.5)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }
    : plan.isEnterprise
      ? {
          background: "rgba(0,255,198,0.03)",
          border: "1px solid rgba(0,255,198,0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        }
      : {
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(0,255,198,0.12)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        };

  const waLink = `https://wa.me/919182768591?text=Hi%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(plan.name)}%20plan.%20Please%20share%20more%20details.`;

  const primaryCtaLabel = "Get Quote";

  return (
    <div ref={revealRef} className="section-reveal">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative rounded-2xl flex flex-col h-full cursor-default ${isLargeCard ? "p-8" : "p-7"}`}
        style={{
          ...cardStyle,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
        onMouseEnter={(e) => {
          const card = e.currentTarget;
          if (plan.popular) {
            card.style.boxShadow =
              "0 0 60px rgba(0,255,198,0.25), 0 0 120px rgba(0,255,198,0.1), 0 20px 60px rgba(0,0,0,0.6)";
            card.style.borderColor = "rgba(0,255,198,0.6)";
          } else {
            card.style.background = "rgba(0,255,198,0.04)";
            card.style.borderColor = "rgba(0,255,198,0.35)";
            card.style.boxShadow =
              "0 0 40px rgba(0,255,198,0.12), 0 0 80px rgba(0,255,198,0.04), 0 20px 60px rgba(0,0,0,0.5)";
          }
        }}
      >
        {/* Popular badge */}
        {plan.popular && (
          <div
            className="absolute -top-3.5 right-6 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider"
            style={{
              background: "oklch(0.88 0.18 168)",
              color: "#050A0A",
              boxShadow: "0 0 16px rgba(0,255,198,0.7)",
              letterSpacing: "0.08em",
            }}
          >
            <Star size={11} fill="currentColor" />
            MOST POPULAR
          </div>
        )}

        {/* Plan tag */}
        <p
          className="text-xs font-semibold mb-2 tracking-wider uppercase"
          style={{ color: "rgba(0,255,198,0.7)", letterSpacing: "0.12em" }}
        >
          {plan.tag}
        </p>

        {/* Plan name */}
        <h3
          className="font-black mb-1"
          style={{
            fontSize: isLargeCard ? "1.85rem" : "1.6rem",
            color: "white",
            letterSpacing: "-0.02em",
          }}
        >
          {plan.name}
        </h3>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span
              className="font-black"
              style={{
                fontSize: isLargeCard ? "2.6rem" : "2.4rem",
                color: "oklch(0.88 0.18 168)",
                textShadow: priceHovered
                  ? "0 0 30px rgba(0,255,198,0.7), 0 0 60px rgba(0,255,198,0.35)"
                  : "0 0 20px rgba(0,255,198,0.4)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                transition: "text-shadow 0.3s ease",
              }}
              onMouseEnter={() => setPriceHovered(true)}
              onMouseLeave={() => setPriceHovered(false)}
            >
              {plan.price}
            </span>
            <span
              className="text-sm"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              one-time
            </span>
          </div>
        </div>

        {/* Value stacking */}
        <div
          className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl"
          style={{
            background: "rgba(0,255,198,0.05)",
            border: "1px solid rgba(0,255,198,0.1)",
          }}
        >
          <div className="flex flex-col">
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Total Value
            </span>
            <span
              className="text-sm font-bold"
              style={{
                color: "rgba(255,255,255,0.4)",
                textDecoration: "line-through",
              }}
            >
              {plan.totalValue}
            </span>
          </div>
          <div
            className="h-8 w-px"
            style={{ background: "rgba(0,255,198,0.2)" }}
          />
          <div className="flex flex-col">
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              You Invest
            </span>
            <span
              className="text-sm font-black"
              style={{ color: "oklch(0.88 0.18 168)" }}
            >
              {plan.priceNum}
            </span>
          </div>
        </div>

        {/* Scarcity */}
        {plan.scarcity && (
          <div
            className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg text-xs font-semibold"
            style={{
              background: "rgba(255,160,0,0.08)",
              border: "1px solid rgba(255,160,0,0.25)",
              color: "rgb(255,160,0)",
            }}
          >
            <AlertTriangle size={13} />
            {plan.scarcity}
          </div>
        )}

        {/* Features — 2-col on desktop, 1-col on mobile */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 mb-6 flex-1">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check
                size={15}
                className="mt-0.5 flex-shrink-0"
                style={{ color: "oklch(0.88 0.18 168)" }}
              />
              <span style={{ color: "rgba(255,255,255,0.75)" }}>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div
          className="h-px w-full mb-5"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,255,198,0.2), transparent)",
          }}
        />

        {/* Dual CTA Buttons */}
        <div className="flex flex-col gap-2.5">
          {/* Primary: Get Quote */}
          <button
            type="button"
            onClick={() => onApply(plan)}
            className={`btn-teal btn-3d-lift ${plan.popular ? "pulse-glow-anim" : ""}`}
            style={{
              padding: "0.875rem 1.5rem",
              borderRadius: "0.75rem",
              fontSize: isLargeCard ? "0.95rem" : "0.9rem",
              fontWeight: 700,
              width: "100%",
              letterSpacing: "0.02em",
            }}
          >
            {primaryCtaLabel}
          </button>

          {/* Secondary: Schedule Strategy Call (Enterprise/Pro) or Send Enquiry */}
          {plan.isEnterprise || plan.isPro ? (
            <button
              type="button"
              onClick={() => onApply(plan)}
              className="btn-outline-teal btn-3d-lift"
              style={{
                padding: "0.875rem 1.5rem",
                borderRadius: "0.75rem",
                fontSize: isLargeCard ? "0.95rem" : "0.9rem",
                fontWeight: 600,
                width: "100%",
                letterSpacing: "0.02em",
              }}
            >
              Schedule Strategy Call
            </button>
          ) : (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-teal btn-3d-lift"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "0.875rem 1.5rem",
                borderRadius: "0.75rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                width: "100%",
                letterSpacing: "0.02em",
                textDecoration: "none",
              }}
            >
              <MessageCircle size={15} />
              Send Enquiry
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export { PLANS };
export type { Plan };

export default function PricingSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const headingRef = useScrollReveal<HTMLDivElement>();

  const handleApply = (plan: Plan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  // On desktop show 3 cards at a time, on mobile show 1
  const visibleCount =
    typeof window !== "undefined" && window.innerWidth >= 768 ? 3 : 1;
  const maxIndex = Math.max(0, PLANS.length - visibleCount);

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <section id="pricing" className="relative py-24 px-4 sm:px-6">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,255,198,0.05) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto relative">
        {/* Section header */}
        <div ref={headingRef} className="section-reveal text-center mb-10">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "oklch(0.88 0.18 168)", letterSpacing: "0.2em" }}
          >
            Investment Plans
          </p>
          <h2
            className="font-black mb-3"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "white",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Built for Businesses Targeting{" "}
            <span style={{ color: "oklch(0.88 0.18 168)" }}>
              8-Figure Revenue
            </span>
          </h2>
          <p
            className="text-base mb-6"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Engineered for scale. Priced for seriousness.
          </p>

          {/* Scarcity badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8"
            style={{
              background: "rgba(255,80,80,0.08)",
              border: "1px solid rgba(255,80,80,0.25)",
              color: "rgb(255,100,100)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: "rgb(255,100,100)",
                animation: "pulse 1.5s ease infinite",
              }}
            />
            Limited Onboarding Slots This Month
          </div>
        </div>

        {/* Pricing Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Arrow buttons */}
          <button
            type="button"
            onClick={prev}
            disabled={currentIndex === 0}
            data-ocid="pricing.carousel_prev"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 flex items-center justify-center rounded-full transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              width: 52,
              height: 52,
              background: "rgba(0,255,198,0.1)",
              border: "1px solid rgba(0,255,198,0.35)",
              boxShadow:
                currentIndex > 0 ? "0 0 20px rgba(0,255,198,0.25)" : "none",
              color: "oklch(0.88 0.18 168)",
            }}
            aria-label="Previous plans"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={next}
            disabled={currentIndex >= maxIndex}
            data-ocid="pricing.carousel_next"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 flex items-center justify-center rounded-full transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              width: 52,
              height: 52,
              background: "rgba(0,255,198,0.1)",
              border: "1px solid rgba(0,255,198,0.35)",
              boxShadow:
                currentIndex < maxIndex
                  ? "0 0 20px rgba(0,255,198,0.25)"
                  : "none",
              color: "oklch(0.88 0.18 168)",
            }}
            aria-label="Next plans"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel viewport */}
          <div className="overflow-hidden px-1">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(calc(-${currentIndex} * (100% / 3 + 8px)))`,
              }}
            >
              {PLANS.map((plan, i) => (
                <div
                  key={plan.id}
                  className="flex-shrink-0 w-full md:w-[calc(33.333%-16px)]"
                >
                  <PricingCard
                    plan={plan}
                    onApply={handleApply}
                    delay={i * 120}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from(
              { length: maxIndex + 1 },
              (__, slideIdx) => slideIdx,
            ).map((slideIdx) => (
              <button
                key={`slide-${slideIdx}`}
                type="button"
                onClick={() => setCurrentIndex(slideIdx)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: currentIndex === slideIdx ? 24 : 8,
                  height: 8,
                  background:
                    currentIndex === slideIdx
                      ? "oklch(0.88 0.18 168)"
                      : "rgba(255,255,255,0.2)",
                  boxShadow:
                    currentIndex === slideIdx
                      ? "0 0 10px rgba(0,255,198,0.5)"
                      : "none",
                }}
                aria-label={`Go to slide ${slideIdx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div
          className="text-center mt-12 text-sm"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          All plans are one-time investments. No hidden fees. No recurring
          charges.
        </div>
      </div>

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        planName={selectedPlan?.name ?? ""}
        planPrice={selectedPlan?.price ?? ""}
      />
    </section>
  );
}
