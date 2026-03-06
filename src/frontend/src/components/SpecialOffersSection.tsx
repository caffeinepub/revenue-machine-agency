import { Sparkles, Star, Tag, Zap } from "lucide-react";
import { useRef, useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import InquiryModal from "./InquiryModal";

/* ─── Offer data ─────────────────────────────────────────────────── */
interface SpecialOffer {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  originalPrice: string;
  discountedPrice: string;
  saving: string;
  discount: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  tag?: string;
}

const OFFERS: SpecialOffer[] = [
  {
    id: "starter-combo",
    badge: "COMBO OFFER",
    badgeColor: "rgba(255,183,0,0.9)",
    title: "Starter Growth Combo",
    subtitle: "Social Media + SEO + Content — All-in-One Starter Pack",
    originalPrice: "₹13,500",
    discountedPrice: "₹9,999",
    saving: "₹3,501",
    discount: "26% OFF",
    features: [
      "Social Media Management – Starter (₹4,000)",
      "SEO Starter Pack (₹3,999)",
      "Content Creation Starter Pack (₹3,499)",
      "Priority onboarding session",
      "Unified brand strategy",
      "Single dedicated manager",
    ],
    cta: "Grab Combo Deal",
    tag: "Best for New Businesses",
  },
  {
    id: "growth-bundle",
    badge: "30% OFF",
    badgeColor: "oklch(0.88 0.18 168)",
    title: "Digital Growth Bundle",
    subtitle: "Paid Ads + SEO + Social Media — Scale Faster Together",
    originalPrice: "₹21,499",
    discountedPrice: "₹14,999",
    saving: "₹6,500",
    discount: "30% OFF",
    features: [
      "Meta Ads Growth Pack (₹6,499)",
      "SEO Growth Pack (₹7,499)",
      "Social Media Full Management – Standard (₹8,999)",
      "Cross-channel strategy alignment",
      "Weekly unified report",
      "Dedicated growth strategist",
    ],
    cta: "Claim 30% Off",
    highlight: true,
    tag: "Most Popular Bundle",
  },
  {
    id: "launch-special",
    badge: "LIMITED TIME",
    badgeColor: "rgba(255,80,80,0.9)",
    title: "New Business Launch Special",
    subtitle:
      "Brand Identity + Website + Social Setup — Launch-Ready in 30 Days",
    originalPrice: "₹19,000",
    discountedPrice: "₹13,999",
    saving: "₹5,001",
    discount: "26% OFF",
    features: [
      "Complete Brand Identity Pack (₹6,000)",
      "WordPress Website Pack (₹9,000)",
      "Social Media Full Management – Basic (₹4,999)",
      "Domain + hosting guidance",
      "Launch campaign strategy",
      "30-day post-launch support",
    ],
    cta: "Launch My Brand",
    tag: "Ideal for Startups",
  },
  {
    id: "enterprise-combo",
    badge: "ENTERPRISE DEAL",
    badgeColor: "rgba(150,100,255,0.9)",
    title: "Enterprise Power Pack",
    subtitle: "Full-Funnel Ads + Enterprise SEO + Premium Content",
    originalPrice: "₹66,499",
    discountedPrice: "₹49,999",
    saving: "₹16,500",
    discount: "25% OFF",
    features: [
      "Full-Funnel Ads Management Pack (₹12,499)",
      "SEO – Enterprise (₹12,500)",
      "Social Media Full Management – Premium (₹14,999)",
      "Enterprise Email Marketing (₹9,000)",
      "Premium Content Pro Pack (₹8,499)",
      "Dedicated enterprise manager",
    ],
    cta: "Apply for Enterprise Deal",
    tag: "For Serious Growth",
  },
  {
    id: "quarterly-discount",
    badge: "15% OFF",
    badgeColor: "rgba(0,200,255,0.9)",
    title: "Quarterly Commitment Discount",
    subtitle: "Any single service — Pay 3 months upfront, save 15%",
    originalPrice: "Your plan × 3",
    discountedPrice: "15% savings",
    saving: "Up to ₹22,500",
    discount: "15% OFF",
    features: [
      "Applicable to any service plan",
      "Lock-in preferred pricing",
      "Priority queue access",
      "Dedicated account manager",
      "Quarterly strategy review",
      "Flexible renewal options",
    ],
    cta: "Lock In My Rate",
    tag: "Smart Investment",
  },
  {
    id: "referral-offer",
    badge: "REFER & EARN",
    badgeColor: "rgba(0,255,150,0.9)",
    title: "Refer a Business, Get 10% Off",
    subtitle:
      "Refer a friend or partner — both of you get 10% off your next bill",
    originalPrice: "Full price",
    discountedPrice: "10% OFF",
    saving: "Up to ₹5,000",
    discount: "10% OFF",
    features: [
      "10% credit on your next invoice",
      "Your referral gets 10% off too",
      "No limit on referrals",
      "Stackable with quarterly discount",
      "Instant credit on activation",
      "Applies to all service plans",
    ],
    cta: "Start Referring",
    tag: "Unlimited Savings",
  },
];

/* ─── Offer Card ─────────────────────────────────────────────────── */
function OfferCard({
  offer,
  onClaim,
}: {
  offer: SpecialOffer;
  onClaim: (title: string, price: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rx =
      ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -5;
    const ry =
      ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 5;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    }
  };

  const icon =
    offer.id === "starter-combo" ? (
      <Tag size={14} />
    ) : offer.id === "growth-bundle" ? (
      <Sparkles size={14} />
    ) : offer.id === "launch-special" ? (
      <Zap size={14} />
    ) : offer.id === "quarterly-discount" ? (
      <Star size={14} />
    ) : (
      <Sparkles size={14} />
    );

  return (
    <div
      ref={cardRef}
      className="relative rounded-2xl flex flex-col h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: offer.highlight
          ? "rgba(0,255,198,0.06)"
          : "rgba(255,255,255,0.03)",
        border: offer.highlight
          ? "1px solid rgba(0,255,198,0.4)"
          : "1px solid rgba(0,255,198,0.1)",
        boxShadow: offer.highlight
          ? "0 0 50px rgba(0,255,198,0.12), 0 20px 60px rgba(0,0,0,0.5)"
          : "0 20px 60px rgba(0,0,0,0.35)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        padding: "1.5rem",
      }}
    >
      {/* Badge */}
      <div
        className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-black mb-3"
        style={{
          background: offer.badgeColor,
          color:
            offer.badge === "COMBO OFFER" || offer.badge === "LIMITED TIME"
              ? "#050A0A"
              : offer.badge === "15% OFF" || offer.badge === "REFER & EARN"
                ? "#050A0A"
                : offer.highlight
                  ? "#050A0A"
                  : "white",
          letterSpacing: "0.08em",
          boxShadow: `0 0 16px ${offer.badgeColor}55`,
        }}
      >
        {icon}
        {offer.badge}
      </div>

      {/* Tag */}
      {offer.tag && (
        <span
          className="text-xs font-semibold mb-1"
          style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}
        >
          {offer.tag}
        </span>
      )}

      {/* Title */}
      <h3
        className="font-black mb-1 leading-tight"
        style={{
          fontSize: "1.1rem",
          color: "white",
          letterSpacing: "-0.01em",
        }}
      >
        {offer.title}
      </h3>

      {/* Subtitle */}
      <p
        className="text-xs mb-4 leading-relaxed"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {offer.subtitle}
      </p>

      {/* Pricing */}
      <div
        className="flex items-end gap-3 mb-4 p-3 rounded-xl"
        style={{
          background: "rgba(0,255,198,0.06)",
          border: "1px solid rgba(0,255,198,0.12)",
        }}
      >
        <div>
          <div
            className="text-xs font-semibold uppercase tracking-widest mb-0.5"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Was
          </div>
          <div
            className="font-bold text-sm line-through"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {offer.originalPrice}
          </div>
        </div>
        <div className="flex-1">
          <div
            className="text-xs font-semibold uppercase tracking-widest mb-0.5"
            style={{ color: "oklch(0.88 0.18 168)", letterSpacing: "0.1em" }}
          >
            Now
          </div>
          <div
            className="font-black"
            style={{
              fontSize: "1.5rem",
              color: "oklch(0.88 0.18 168)",
              textShadow: "0 0 20px rgba(0,255,198,0.5)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {offer.discountedPrice}
          </div>
        </div>
        <div
          className="flex flex-col items-center px-3 py-2 rounded-lg font-black text-sm"
          style={{
            background: offer.badgeColor,
            color: "#050A0A",
            boxShadow: `0 0 16px ${offer.badgeColor}66`,
            minWidth: 64,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          <span>{offer.discount}</span>
          <span
            className="text-xs font-semibold mt-0.5"
            style={{ color: "rgba(0,0,0,0.55)", letterSpacing: "0.02em" }}
          >
            Save {offer.saving}
          </span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-1.5 mb-5 flex-1">
        {offer.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs">
            <span
              className="mt-0.5 flex-shrink-0 font-bold"
              style={{ color: "oklch(0.88 0.18 168)" }}
            >
              ✓
            </span>
            <span style={{ color: "rgba(255,255,255,0.72)" }}>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        type="button"
        data-ocid={`special_offers.${offer.id}.primary_button`}
        onClick={() => onClaim(offer.title, offer.discountedPrice)}
        className={`btn-teal btn-3d-lift${offer.highlight ? " pulse-glow-anim" : ""}`}
        style={{
          padding: "0.75rem 1.25rem",
          borderRadius: "0.65rem",
          fontSize: "0.875rem",
          fontWeight: 700,
          width: "100%",
          letterSpacing: "0.02em",
        }}
      >
        {offer.cta}
      </button>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────────── */
export default function SpecialOffersSection() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<{
    name: string;
    price: string;
  } | null>(null);

  const handleClaim = (name: string, price: string) => {
    setSelectedOffer({ name, price });
    setModalOpen(true);
  };

  return (
    <section id="special-offers" className="relative py-24 px-4 sm:px-6">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(0,255,198,0.05) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto relative">
        {/* Section header */}
        <div ref={headerRef} className="section-reveal text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{
              background: "rgba(0,255,198,0.07)",
              border: "1px solid rgba(0,255,198,0.2)",
            }}
          >
            <Sparkles size={14} style={{ color: "oklch(0.88 0.18 168)" }} />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "oklch(0.88 0.18 168)", letterSpacing: "0.18em" }}
            >
              Limited Offers
            </span>
          </div>

          <h2
            className="font-black mb-3"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "white",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Special{" "}
            <span style={{ color: "oklch(0.88 0.18 168)" }}>Offers &</span>{" "}
            Combo Deals
          </h2>

          <p
            className="text-base max-w-xl mx-auto mb-4"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Bundle services, save big. Time-limited deals engineered for maximum
            ROI.
          </p>

          {/* Urgency strip */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold"
            style={{
              background: "rgba(255,80,80,0.08)",
              border: "1px solid rgba(255,80,80,0.25)",
              color: "rgba(255,130,130,0.9)",
              letterSpacing: "0.06em",
            }}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            Limited onboarding slots available this month — act fast
          </div>
        </div>

        {/* Offers grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFERS.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onClaim={handleClaim} />
          ))}
        </div>

        {/* Bottom note */}
        <p
          className="text-center text-xs mt-10"
          style={{ color: "rgba(255,255,255,0.28)", letterSpacing: "0.04em" }}
        >
          * All offers subject to availability. Prices exclusive of applicable
          taxes. Contact us to confirm current availability before proceeding.
        </p>
      </div>

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        planName={selectedOffer?.name ?? ""}
        planPrice={selectedOffer?.price ?? ""}
      />
    </section>
  );
}
