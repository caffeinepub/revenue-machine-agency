import {
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Star,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import InquiryModal from "./InquiryModal";
import { PLANS, type Plan } from "./PricingSection";

/* ─── 3D floating ambient shapes ─────────────────────────────────── */
const ambientShapeStyles = `
@keyframes floatA {
  0%   { transform: translateY(0px)   rotateY(0deg)   rotateX(15deg); }
  50%  { transform: translateY(-28px) rotateY(180deg) rotateX(25deg); }
  100% { transform: translateY(0px)   rotateY(360deg) rotateX(15deg); }
}
@keyframes floatB {
  0%   { transform: translateY(0px)   rotateX(0deg)   rotateZ(0deg); }
  50%  { transform: translateY(20px)  rotateX(180deg) rotateZ(90deg); }
  100% { transform: translateY(0px)   rotateX(360deg) rotateZ(180deg); }
}
@keyframes floatC {
  0%   { transform: translateY(-10px) rotateY(0deg)   rotateZ(0deg); }
  33%  { transform: translateY(15px)  rotateY(120deg) rotateZ(60deg); }
  66%  { transform: translateY(-5px)  rotateY(240deg) rotateZ(120deg); }
  100% { transform: translateY(-10px) rotateY(360deg) rotateZ(180deg); }
}
@keyframes floatD {
  0%   { transform: translateY(10px)  rotateX(0deg)   rotateY(0deg); }
  50%  { transform: translateY(-20px) rotateX(90deg)  rotateY(180deg); }
  100% { transform: translateY(10px)  rotateX(180deg) rotateY(360deg); }
}
`;

function AmbientCube({ style }: { style: React.CSSProperties }) {
  const size = 60;
  const half = size / 2;
  const tealGlow = "rgba(0,255,198,0.55)";
  const tealBg = "rgba(0,255,198,0.04)";
  const faces: React.CSSProperties[] = [
    { transform: `translateZ(${half}px)` },
    { transform: `rotateY(180deg) translateZ(${half}px)` },
    { transform: `rotateY(90deg)  translateZ(${half}px)` },
    { transform: `rotateY(-90deg) translateZ(${half}px)` },
    { transform: `rotateX(90deg)  translateZ(${half}px)` },
    { transform: `rotateX(-90deg) translateZ(${half}px)` },
  ];
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {faces.map((f) => (
        <div
          key={String(f.transform)}
          style={{
            position: "absolute",
            width: size,
            height: size,
            border: `1px solid ${tealGlow}`,
            background: tealBg,
            ...f,
          }}
        />
      ))}
    </div>
  );
}

function AmbientOctahedron({ style }: { style: React.CSSProperties }) {
  const s = 50;
  return (
    <div
      style={{
        position: "absolute",
        width: s,
        height: s,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {(
        [
          "0-bot",
          "60-bot",
          "120-bot",
          "180-bot",
          "240-bot",
          "300-bot",
          "60-top",
          "120-top",
        ] as const
      ).map((key, i) => {
        const rotAngles = [0, 60, 120, 180, 240, 300, 60, 120] as const;
        const rot = rotAngles[i];
        return (
          <div
            key={key}
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              borderLeft: `${s / 2}px solid transparent`,
              borderRight: `${s / 2}px solid transparent`,
              borderBottom:
                i < 4 ? `${s * 0.86}px solid rgba(0,255,198,0.18)` : undefined,
              borderTop:
                i >= 4 ? `${s * 0.86}px solid rgba(0,255,198,0.12)` : undefined,
              transform: `rotateY(${rot}deg) rotateX(${i < 4 ? 35 : -35}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

function AmbientTorus({ style }: { style: React.CSSProperties }) {
  const rings = 8;
  return (
    <div
      style={{
        position: "absolute",
        width: 70,
        height: 70,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {Array.from({ length: rings }, (__, ringIdx) => ringIdx).map(
        (ringIdx) => (
          <div
            key={`torus-r${ringIdx}`}
            style={{
              position: "absolute",
              width: 70,
              height: 70,
              border: "1px solid rgba(0,255,198,0.3)",
              borderRadius: "50%",
              transform: `rotateY(${(ringIdx / rings) * 180}deg)`,
            }}
          />
        ),
      )}
    </div>
  );
}

function AmbientPyramid({ style }: { style: React.CSSProperties }) {
  const s = 55;
  return (
    <div
      style={{
        position: "absolute",
        width: s,
        height: s,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {[0, 90, 180, 270].map((rot, i) => (
        <div
          key={`pyr-${rot}`}
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            borderLeft: `${s / 2}px solid transparent`,
            borderRight: `${s / 2}px solid transparent`,
            borderBottom: `${s}px solid rgba(0,255,198,${0.12 + i * 0.04})`,
            transform: `rotateY(${rot}deg) rotateX(-20deg) translateZ(${s / 4}px)`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Plan card types ─────────────────────────────────────────────── */
interface AllPlanCard {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  popular?: boolean;
  isEnterprise?: boolean;
  isPro?: boolean;
  isMasterPlan?: boolean;
}

/* ─── Build combined plan list ────────────────────────────────────── */
function buildAllPlans(): AllPlanCard[] {
  // 4 master plans first
  const masterCards: AllPlanCard[] = PLANS.map((p: Plan) => ({
    id: `master-${p.id}`,
    name: p.name,
    description: p.tag,
    price: p.price,
    features: p.features,
    popular: p.popular,
    isEnterprise: p.isEnterprise,
    isPro: p.isPro,
    isMasterPlan: true,
  }));

  // Dynamically import CATEGORIES from ServicesSection data
  // Since we can't import CATEGORIES (not exported), we inline it as a helper type
  // We will import via dynamic approach – actually we need to share data.
  // For now we'll re-use the same data inline by importing from ServicesSection export.
  // Since ServicesSection doesn't export CATEGORIES, we return masterCards only here
  // and handle services in the component itself.
  return masterCards;
}

/* ─── Single card component ───────────────────────────────────────── */
function AllPlanCardView({
  card,
  onGetQuote,
  ocid,
}: {
  card: AllPlanCard;
  onGetQuote: (name: string, price: string) => void;
  ocid: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [priceHovered, setPriceHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rx =
      ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -6;
    const ry =
      ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 6;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    }
  };

  const cardBorder = card.popular
    ? "1px solid rgba(0,255,198,0.4)"
    : "1px solid rgba(0,255,198,0.12)";

  const cardBg = card.popular
    ? "rgba(0,255,198,0.05)"
    : "rgba(255,255,255,0.03)";

  const waLink = `https://wa.me/919182768591?text=${encodeURIComponent(`Hi, I'm interested in ${card.name}. Please share more details.`)}`;

  return (
    <div
      data-ocid={ocid}
      className="relative rounded-2xl flex flex-col h-full p-6 cursor-default"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = "rgba(0,255,198,0.06)";
        el.style.borderColor = "rgba(0,255,198,0.45)";
        el.style.boxShadow =
          "0 0 40px rgba(0,255,198,0.15), 0 20px 60px rgba(0,0,0,0.5)";
      }}
      style={{
        background: cardBg,
        border: cardBorder,
        boxShadow: card.popular
          ? "0 0 40px rgba(0,255,198,0.15), 0 20px 60px rgba(0,0,0,0.5)"
          : "0 20px 60px rgba(0,0,0,0.4)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Popular badge */}
      {card.popular && (
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

      {/* Master plan ribbon */}
      {card.isMasterPlan && (
        <div
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mb-2 self-start"
          style={{
            background: "rgba(0,255,198,0.08)",
            border: "1px solid rgba(0,255,198,0.2)",
            color: "oklch(0.88 0.18 168)",
            letterSpacing: "0.06em",
          }}
        >
          MASTER PLAN
        </div>
      )}

      {/* Name */}
      <h3
        className="font-black mb-1 leading-tight"
        style={{
          fontSize: "1.15rem",
          color: "white",
          letterSpacing: "-0.01em",
        }}
      >
        {card.name}
      </h3>

      {/* Description */}
      <p
        className="text-xs mb-3 leading-relaxed"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {card.description}
      </p>

      {/* Price */}
      <div className="mb-4">
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {card.isMasterPlan ? "One-Time Investment" : "One-Time From"}
        </span>
        <div
          className="font-black mt-0.5"
          onMouseEnter={() => setPriceHovered(true)}
          onMouseLeave={() => setPriceHovered(false)}
          style={{
            fontSize: "1.6rem",
            color: "oklch(0.88 0.18 168)",
            textShadow: priceHovered
              ? "0 0 30px rgba(0,255,198,0.7), 0 0 60px rgba(0,255,198,0.35)"
              : "0 0 20px rgba(0,255,198,0.4)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            transition: "text-shadow 0.3s ease",
          }}
        >
          {card.price}
          {card.isMasterPlan && (
            <span
              style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.4)",
                fontWeight: 400,
              }}
            >
              one-time
            </span>
          )}
        </div>
      </div>

      {/* Features 2-col grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 mb-5 flex-1">
        {card.features.map((feature) => (
          <li key={feature} className="flex items-start gap-1.5 text-xs">
            <Check
              size={12}
              className="mt-0.5 flex-shrink-0"
              style={{ color: "oklch(0.88 0.18 168)" }}
            />
            <span style={{ color: "rgba(255,255,255,0.72)" }}>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Divider */}
      <div
        className="h-px w-full mb-4"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,255,198,0.2), transparent)",
        }}
      />

      {/* Dual CTA */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onGetQuote(card.name, card.price)}
          className={`btn-teal btn-3d-lift ${card.popular ? "pulse-glow-anim" : ""}`}
          style={{
            padding: "0.75rem 1.25rem",
            borderRadius: "0.65rem",
            fontSize: "0.875rem",
            fontWeight: 700,
            width: "100%",
            letterSpacing: "0.02em",
          }}
        >
          Get Quote
        </button>
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
            padding: "0.75rem 1.25rem",
            borderRadius: "0.65rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            width: "100%",
            letterSpacing: "0.02em",
            textDecoration: "none",
          }}
        >
          <MessageCircle size={14} />
          Send Enquiry
        </a>
      </div>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────────── */
// Services data inlined to avoid needing an export from ServicesSection
interface ServiceEntry {
  name: string;
  description: string;
  price: string;
  features: string[];
}

const SERVICE_PLANS: ServiceEntry[] = [
  // Social Media
  {
    name: "Social Media Management – Starter",
    description: "Basic social media management for small businesses.",
    price: "₹3,999",
    features: [
      "2 social platforms managed",
      "12 posts per month",
      "Content calendar creation",
      "Basic graphic design",
      "Caption copywriting",
      "Hashtag research",
      "Monthly analytics report",
      "Audience growth tracking",
      "Post scheduling & publishing",
      "Brand voice consistency",
      "Story posts (4/month)",
      "Competitor page monitoring",
      "Profile optimization",
      "Engagement monitoring",
      "Monthly strategy summary",
      "Onboarding consultation",
    ],
  },
  {
    name: "Social Media Management – Growth",
    description:
      "Comprehensive management with engagement & bi-weekly reporting.",
    price: "₹7,499",
    features: [
      "3 social platforms managed",
      "20 posts per month",
      "Stories (15/month)",
      "Active community engagement",
      "Comment & DM responses",
      "Bi-weekly performance report",
      "Hashtag strategy optimization",
      "Competitor analysis",
      "Audience growth campaigns",
      "Trending content integration",
      "Canva premium design templates",
      "Poll & interactive content",
      "Monthly content strategy call",
      "Ad creative suggestions",
      "Influencer tag opportunities",
      "Content repurposing strategy",
    ],
  },
  {
    name: "Social Media Management – Pro",
    description:
      "Full-service with reels, influencer coordination & weekly reporting.",
    price: "₹12,499",
    features: [
      "4 social platforms managed",
      "30 posts per month",
      "8 Reels/Shorts per month",
      "Stories (30/month)",
      "Influencer outreach & coordination",
      "Weekly performance reporting",
      "Advanced content strategy",
      "Brand collaboration ideation",
      "Paid ad creative support",
      "Full comment management",
      "Crisis response management",
      "Audience segmentation analysis",
      "Trend forecasting",
      "Monthly strategy deep-dive call",
      "Competitor benchmarking",
      "Cross-platform content calendar",
    ],
  },
  {
    name: "Instagram Growth Pack",
    description:
      "Dedicated Instagram growth with content creation & hashtag strategy.",
    price: "₹3,499",
    features: [
      "15 feed posts per month",
      "20 stories per month",
      "4 Reels per month",
      "Hashtag strategy (30 sets)",
      "Daily engagement activity",
      "Follower growth campaigns",
      "Bio optimization",
      "Highlight cover design",
      "Profile grid aesthetics",
      "Caption strategy & copywriting",
      "Instagram Insights analysis",
      "Competitor follower tracking",
      "Collaboration post ideation",
      "Story poll & quiz content",
      "Monthly growth report",
      "Content performance tracking",
    ],
  },
  {
    name: "LinkedIn Brand Building",
    description:
      "Professional LinkedIn presence for personal brands & companies.",
    price: "₹3,999",
    features: [
      "Profile optimization (personal/company)",
      "12 thought leadership posts/month",
      "LinkedIn article writing (2/month)",
      "Connection growth strategy",
      "Industry hashtag targeting",
      "Employee advocacy guidance",
      "Company page management",
      "Engagement with industry leaders",
      "LinkedIn analytics reporting",
      "Lead magnet post strategy",
      "Recommendation strategy",
      "Skills & endorsement optimization",
      "Event promotion posts",
      "B2B audience targeting",
      "Content calendar planning",
      "Monthly brand audit",
    ],
  },
  {
    name: "YouTube Channel Management",
    description:
      "Complete YouTube management with video optimization & growth.",
    price: "₹2,499",
    features: [
      "Full channel SEO optimization",
      "Video title & description optimization",
      "Custom thumbnail design (4/month)",
      "Tags & keyword strategy",
      "End screen & cards setup",
      "Channel trailer creation",
      "Playlist organization",
      "YouTube analytics review",
      "Subscriber growth strategy",
      "Community post management",
      "Video chapter markers",
      "Closed caption optimization",
      "YouTube Shorts strategy",
      "Competitor channel analysis",
      "Monthly performance report",
      "Content upload scheduling",
    ],
  },
  {
    name: "Social Media Full Management – Basic",
    description:
      "All-in-one management for 2 platforms with content & reporting.",
    price: "₹2,499",
    features: [
      "2 platforms fully managed",
      "16 posts per month",
      "Content creation & design",
      "Post scheduling & automation",
      "Comment engagement",
      "Monthly analytics report",
      "Hashtag optimization",
      "Story content (8/month)",
      "Brand-consistent visuals",
      "Caption & copy writing",
      "Basic competitor tracking",
      "Profile optimization",
      "Monthly content calendar",
      "Audience growth monitoring",
      "Platform-specific strategy",
      "Onboarding brand session",
    ],
  },
  {
    name: "Social Media Full Management – Standard",
    description:
      "Comprehensive management for 3 platforms with reels & stories.",
    price: "₹4,499",
    features: [
      "3 platforms fully managed",
      "24 posts per month",
      "6 Reels/video edits per month",
      "Stories (20/month)",
      "Bi-weekly strategy calls",
      "Engagement management",
      "Bi-weekly performance report",
      "Content strategy roadmap",
      "Advanced graphic design",
      "Trend-based content",
      "Hashtag strategy per platform",
      "Audience growth campaigns",
      "DM & comment moderation",
      "Cross-platform content sync",
      "Competitor benchmarking",
      "Monthly content audit",
    ],
  },
  {
    name: "Social Media Full Management – Premium",
    description:
      "Premium management for 5 platforms with full content production.",
    price: "₹7,499",
    features: [
      "5 platforms fully managed",
      "40 posts per month",
      "12 Reels/videos per month",
      "Stories (40/month)",
      "Influencer collaboration tie-ups",
      "Weekly reporting & review calls",
      "Full content production workflow",
      "Paid ad creative support",
      "Crisis management protocol",
      "Dedicated social media manager",
      "Platform growth campaigns",
      "Advanced analytics dashboard",
      "Brand reputation monitoring",
      "Content localization strategy",
      "Seasonal campaign planning",
      "Quarterly strategy overhaul",
    ],
  },
  // SEO
  {
    name: "SEO – Basic",
    description:
      "On-page optimization & keyword research for up to 10 keywords.",
    price: "₹2,999",
    features: [
      "10 target keywords optimized",
      "Meta title & description writing",
      "Google Search Console setup",
      "Monthly ranking report",
      "XML sitemap submission",
      "On-page content optimization",
      "Image alt text optimization",
      "Internal linking structure",
      "Page speed recommendations",
      "Google Analytics integration",
      "Broken link audit",
      "Canonical tag setup",
      "robots.txt review",
      "Local business schema markup",
      "Competitor keyword gap analysis",
      "Monthly performance summary",
    ],
  },
  {
    name: "SEO – Standard",
    description: "Comprehensive SEO with on-page, off-page & link building.",
    price: "₹2,999",
    features: [
      "25 target keywords optimized",
      "Full technical SEO audit",
      "On-page & off-page optimization",
      "Link building (5 DA40+ links/month)",
      "Content optimization for rankings",
      "Structured data markup",
      "Core Web Vitals optimization",
      "Mobile SEO optimization",
      "Local SEO signals",
      "Monthly ranking tracker report",
      "Backlink profile monitoring",
      "Competitor link gap analysis",
      "Blog content recommendations",
      "301 redirect mapping",
      "Bi-monthly strategy review",
      "Google Business Profile optimization",
    ],
  },
  {
    name: "SEO – Enterprise",
    description: "Enterprise SEO with unlimited keywords & weekly reporting.",
    price: "₹12,499",
    features: [
      "Unlimited keywords targeted",
      "Dedicated SEO account manager",
      "Weekly ranking & traffic report",
      "Aggressive link building (15+/month)",
      "Full technical SEO overhaul",
      "Enterprise content strategy",
      "Advanced competitor analysis",
      "International/multi-language SEO",
      "E-E-A-T optimization strategy",
      "Featured snippet targeting",
      "Core Web Vitals advanced fix",
      "Custom analytics dashboard",
      "Penalty recovery support",
      "SEO roadmap (quarterly)",
      "Executive performance reports",
      "Schema markup full implementation",
    ],
  },
  {
    name: "SEO Analysis",
    description:
      "In-depth SEO audit covering technical, on-page & backlink factors.",
    price: "₹2,499",
    features: [
      "Full technical SEO audit",
      "On-page factor analysis",
      "Backlink profile evaluation",
      "Competitor benchmarking report",
      "Keyword opportunity mapping",
      "Content gap analysis",
      "Site architecture review",
      "Mobile usability assessment",
      "Page speed analysis",
      "Core Web Vitals assessment",
      "Crawl error identification",
      "Duplicate content detection",
      "Internal link audit",
      "Schema markup evaluation",
      "Actionable priority roadmap",
      "Executive summary PDF report",
    ],
  },
  {
    name: "Local SEO & Maps Optimization",
    description: "Dominate local search with Google Maps & citation building.",
    price: "₹2,999",
    features: [
      "Google Business Profile optimization",
      "Google Maps ranking improvement",
      "NAP consistency audit & fix",
      "Local citation building (20+)",
      "Review response management",
      "Review generation strategy",
      "Local keyword targeting",
      "Local schema markup",
      "Hyperlocal landing page SEO",
      "Bing Places optimization",
      "Apple Maps listing optimization",
      "Competitor local ranking analysis",
      "Monthly local ranking report",
      "Photo optimization for GMB",
      "Q&A section management",
      "Local link building outreach",
    ],
  },
  {
    name: "SEO Starter Pack",
    description:
      "Entry-level SEO with keyword research & monthly ranking reports.",
    price: "₹3,999",
    features: [
      "15 keywords researched & targeted",
      "On-page SEO optimization",
      "Keyword competition analysis",
      "Meta tags optimization",
      "Google Analytics setup",
      "Search Console configuration",
      "Monthly ranking report",
      "Site speed basic optimization",
      "Image compression & alt tags",
      "URL structure optimization",
      "Internal link improvements",
      "Competitor top-page analysis",
      "Content recommendations",
      "Sitemap & robots.txt setup",
      "Monthly SEO health check",
      "Onboarding strategy session",
    ],
  },
  {
    name: "SEO Growth Pack",
    description:
      "Mid-tier SEO with technical audit, link building & bi-weekly reporting.",
    price: "₹7,499",
    features: [
      "30 keywords optimized",
      "Comprehensive technical SEO audit",
      "Link building (8 DA35+ links/month)",
      "Content optimization & rewriting",
      "Bi-weekly ranking report",
      "Core Web Vitals improvements",
      "Local SEO integration",
      "Schema markup implementation",
      "Competitor gap strategy",
      "Blog post SEO optimization (4/month)",
      "Backlink monitoring tool access",
      "Broken backlink reclamation",
      "Site architecture optimization",
      "Bi-weekly strategy review call",
      "Penalty check & recovery plan",
      "Custom analytics reporting",
    ],
  },
  {
    name: "SEO Pro Pack",
    description:
      "Advanced SEO with unlimited keywords & dedicated SEO manager.",
    price: "₹13,999",
    features: [
      "Unlimited keywords targeted",
      "Dedicated SEO manager assigned",
      "Aggressive link building (12+/month)",
      "Full technical & content SEO",
      "Weekly performance reporting",
      "E-E-A-T optimization",
      "Advanced competitor outranking strategy",
      "Featured snippet optimization",
      "Video SEO (YouTube integration)",
      "Image SEO & Google Image traffic",
      "Advanced schema markup",
      "Custom SEO dashboard",
      "Conversion-focused page optimization",
      "PR-based link building",
      "Quarterly SEO growth roadmap",
      "Priority support & response",
    ],
  },
  // Paid Ads
  {
    name: "Google Ads Management",
    description: "Setup & management of Search, Display & Shopping campaigns.",
    price: "₹3,999",
    features: [
      "Google Search campaign setup",
      "Display Network campaign",
      "Shopping campaign management",
      "Keyword research & bidding",
      "Ad copy A/B testing",
      "Conversion tracking setup",
      "Negative keyword management",
      "Quality score optimization",
      "Ad extensions setup",
      "Landing page CRO suggestions",
      "Monthly optimization review",
      "Budget pacing management",
      "Competitor ad analysis",
      "Monthly performance report",
      "Audience targeting setup",
      "Remarketing list creation",
    ],
  },
  {
    name: "Meta Ads Management",
    description:
      "Facebook & Instagram paid advertising with audience targeting.",
    price: "₹3,499",
    features: [
      "Facebook & Instagram campaign setup",
      "Custom audience creation",
      "Lookalike audience targeting",
      "Ad creative strategy",
      "Ad copy writing",
      "A/B split testing",
      "Pixel setup & event tracking",
      "Retargeting campaign setup",
      "Campaign budget optimization",
      "Placement optimization",
      "Monthly performance report",
      "Funnel-based campaign structure",
      "Lead generation form ads",
      "Catalog & dynamic ads setup",
      "Frequency & CPM monitoring",
      "Weekly ad performance check",
    ],
  },
  {
    name: "LinkedIn Ads Management",
    description:
      "B2B LinkedIn advertising for lead generation & brand awareness.",
    price: "₹2,999",
    features: [
      "LinkedIn Campaign Manager setup",
      "Sponsored content campaigns",
      "Message ad (InMail) campaigns",
      "Lead gen form ads",
      "Job title & industry targeting",
      "Company size targeting",
      "Account-based marketing setup",
      "Retargeting with LinkedIn Insight",
      "Brand awareness campaigns",
      "Event promotion campaigns",
      "A/B creative testing",
      "Audience segmentation strategy",
      "Conversion tracking integration",
      "Monthly performance reporting",
      "CPC/CPL optimization",
      "Competitor ad benchmarking",
    ],
  },
  {
    name: "Paid Ads Tracker",
    description:
      "Comprehensive tracking & optimization across all paid channels.",
    price: "₹3,999",
    features: [
      "Cross-platform tracking setup",
      "Google Tag Manager configuration",
      "Meta Pixel implementation",
      "LinkedIn Insight Tag setup",
      "YouTube conversion tracking",
      "GA4 event tracking",
      "Custom conversion goals",
      "UTM parameter framework",
      "Attribution model setup",
      "Funnel drop-off analysis",
      "Multi-touch attribution report",
      "ROAS & ROI tracking",
      "Weekly spend vs. performance audit",
      "Heatmap & session recording links",
      "Monthly analytics dashboard",
      "Data studio report creation",
    ],
  },
  {
    name: "YouTube Ads Management",
    description: "YouTube advertising with TrueView, bumper & discovery ads.",
    price: "₹4,499",
    features: [
      "TrueView in-stream campaign setup",
      "Bumper ad campaign management",
      "Video discovery ads",
      "Non-skippable ad management",
      "Audience targeting strategy",
      "Demographic targeting",
      "Interest & keyword targeting",
      "Video creative optimization",
      "Companion banner setup",
      "View-through conversion tracking",
      "Remarketing audience creation",
      "Budget pacing & bidding",
      "Placement exclusion management",
      "Monthly performance report",
      "CPV & watch-time optimization",
      "A/B testing of video creatives",
    ],
  },
  {
    name: "Pinterest & Twitter Ads",
    description: "Niche platform advertising on Pinterest and Twitter/X.",
    price: "₹3,999",
    features: [
      "Pinterest Ads campaign setup",
      "Twitter/X Ads campaign setup",
      "Promoted pins strategy",
      "Shopping catalog on Pinterest",
      "Twitter audience targeting",
      "Interest & keyword targeting",
      "Promoted trend campaigns",
      "Follower growth campaigns",
      "Pinterest SEO optimization",
      "Ad creative design guidance",
      "Conversion tracking setup",
      "Monthly performance reporting",
      "Audience overlap analysis",
      "A/B creative testing",
      "Budget optimization management",
      "Platform-specific content strategy",
    ],
  },
  {
    name: "Google Ads Starter Pack",
    description: "Google Ads setup for small businesses with search campaigns.",
    price: "₹4,499",
    features: [
      "Google Ads account setup",
      "Search campaign creation",
      "Keyword research (100+ keywords)",
      "Ad copy writing (3 ad variations)",
      "Bid strategy configuration",
      "Ad extensions setup",
      "Google Analytics 4 linking",
      "Conversion action setup",
      "Negative keyword list",
      "Search term report review",
      "Landing page CRO recommendations",
      "Monthly budget review",
      "CTR optimization",
      "Quality score improvements",
      "Monthly performance report",
      "Onboarding strategy session",
    ],
  },
  {
    name: "Meta Ads Growth Pack",
    description:
      "Facebook & Instagram ads with retargeting & lookalike audiences.",
    price: "₹6,499",
    features: [
      "Full campaign architecture setup",
      "Top/mid/bottom funnel campaigns",
      "Retargeting audience strategy",
      "Lookalike audience creation",
      "Dynamic product ads",
      "Lead generation campaigns",
      "Creative strategy & ad copy",
      "A/B testing (creatives & audiences)",
      "Pixel full implementation",
      "Custom conversion tracking",
      "Catalog setup for e-commerce",
      "Bi-weekly performance report",
      "CPA & ROAS optimization",
      "Budget scaling strategy",
      "Competitor ad monitoring",
      "Monthly strategy call",
    ],
  },
  {
    name: "Full-Funnel Ads Management Pack",
    description: "Complete paid ads management across Google, Meta & YouTube.",
    price: "₹12,499",
    features: [
      "Google + Meta + YouTube campaigns",
      "Full-funnel campaign architecture",
      "Awareness to conversion flow",
      "Cross-platform audience strategy",
      "Unified creative strategy",
      "Multi-platform pixel & tracking",
      "Advanced retargeting sequences",
      "Lookalike & custom audiences",
      "Attribution model optimization",
      "Weekly cross-channel reporting",
      "Budget allocation strategy",
      "ROAS & CPA goals management",
      "Landing page CRO collaboration",
      "Competitive intelligence report",
      "Dedicated ads strategist",
      "Monthly performance deep-dive",
    ],
  },
  // Content Marketing
  {
    name: "Blog Writing – Starter",
    description: "SEO-optimized blog articles. 4 articles per month.",
    price: "₹2,499",
    features: [
      "4 blog articles per month",
      "SEO keyword integration",
      "1,000–1,500 words per article",
      "Topic research & ideation",
      "Meta title & description",
      "Internal linking suggestions",
      "Plagiarism-free content",
      "Industry-expert tone",
      "CTA integration",
      "Image suggestion list",
      "Headline A/B options",
      "Content brief per article",
      "Google Docs delivery",
      "1 revision per article",
      "Publishing-ready formatting",
      "Monthly content report",
    ],
  },
  {
    name: "Blog Writing – Growth",
    description: "High-quality long-form blog content. 8 articles per month.",
    price: "₹4,499",
    features: [
      "8 long-form articles per month",
      "1,500–2,500 words per article",
      "In-depth keyword research",
      "Semantic keyword integration",
      "Internal & external linking",
      "Topic cluster strategy",
      "NLP-optimized content",
      "Pillar & cluster planning",
      "Meta & OG tag writing",
      "Competitor content analysis",
      "2 revisions per article",
      "Plagiarism + AI detection check",
      "CMS-ready formatting",
      "Featured snippet targeting",
      "Monthly content strategy call",
      "Content performance tracking",
    ],
  },
  {
    name: "Video Script Writing",
    description: "Professional video scripts for YouTube, reels & ads.",
    price: "₹2,499",
    features: [
      "YouTube long-form scripts",
      "Instagram Reel scripts",
      "Ad video scripts",
      "Explainer video scripts",
      "Hook writing (3 options)",
      "CTA scripting",
      "Emotional storytelling structure",
      "Scene-by-scene breakdown",
      "Voiceover-ready formatting",
      "Speaker notes included",
      "B-roll suggestions",
      "Platform-specific tone",
      "Keyword integration for YouTube",
      "1 full revision included",
      "Plagiarism-free guarantee",
      "Fast 48-hour turnaround",
    ],
  },
  {
    name: "Podcast Production & Marketing",
    description: "End-to-end podcast production, editing & marketing.",
    price: "₹3,999",
    features: [
      "Podcast episode editing (4/month)",
      "Intro/outro creation",
      "Noise reduction & audio mastering",
      "Show notes writing",
      "Podcast SEO optimization",
      "Multi-platform distribution setup",
      "Spotify & Apple Podcasts upload",
      "Episode title & description",
      "Audiogram creation for social",
      "Episode transcript creation",
      "Guest coordination support",
      "Podcast cover art design",
      "RSS feed management",
      "Audience growth strategy",
      "Podcast newsletter promo",
      "Monthly listener analytics report",
    ],
  },
  {
    name: "Digital PR & Media Outreach",
    description: "Strategic PR campaigns to earn media coverage & backlinks.",
    price: "₹7,499",
    features: [
      "Media list building (50+ outlets)",
      "Press release writing",
      "Journalist outreach campaigns",
      "Guest article placement",
      "Brand mention monitoring",
      "High-DA backlink acquisition",
      "Podcast guesting outreach",
      "HARO (Help a Reporter) responses",
      "Digital press kit creation",
      "Thought leadership pitching",
      "Media coverage tracking",
      "Crisis PR response planning",
      "Influencer PR collaboration",
      "Monthly PR performance report",
      "Brand sentiment analysis",
      "3 guaranteed media mentions",
    ],
  },
  {
    name: "Content Creation Starter Pack",
    description: "Monthly content bundle with posts, stories & graphic design.",
    price: "₹3,499",
    features: [
      "12 social media posts/month",
      "8 story graphics/month",
      "4 quote/carousel posts",
      "Basic graphic design",
      "Brand color & font usage",
      "Caption copywriting",
      "Hashtag sets included",
      "Content calendar planning",
      "Canva-based design delivery",
      "Platform-sized exports",
      "2 cover design variants",
      "1 promotional graphic",
      "Basic video thumbnail",
      "Monthly revision round",
      "Brand guideline adherence",
      "Onboarding brand briefing",
    ],
  },
  {
    name: "Content Creation Pro Pack",
    description: "Premium content with reels, carousels & long-form blogs.",
    price: "₹8,499",
    features: [
      "24 social media posts/month",
      "8 Reel/video edits per month",
      "6 carousel/infographic posts",
      "2 long-form blog articles",
      "2 video scripts included",
      "Advanced graphic design",
      "Motion graphic elements",
      "Caption & hashtag strategy",
      "Story sequence design",
      "Content calendar & planning",
      "Multi-platform content sizing",
      "Brand kit full application",
      "Competitor content benchmarking",
      "Engagement-first content strategy",
      "Monthly content review call",
      "Unlimited minor revisions",
    ],
  },
  // Email Marketing
  {
    name: "Email Marketing – Starter",
    description:
      "Monthly newsletter design & campaign management up to 2,000 subs.",
    price: "₹2,499",
    features: [
      "2 email campaigns per month",
      "Up to 2,000 subscribers",
      "Email template design",
      "Copywriting & subject lines",
      "List upload & management",
      "Send time optimization",
      "Open rate tracking",
      "Click-through rate tracking",
      "Unsubscribe management",
      "Mobile-responsive design",
      "Basic audience segmentation",
      "Spam score check",
      "Platform setup (Mailchimp/etc.)",
      "Monthly email report",
      "CTA optimization",
      "Brand-consistent email design",
    ],
  },
  {
    name: "Email Marketing – Growth",
    description: "Advanced email marketing with automation & A/B testing.",
    price: "₹4,499",
    features: [
      "4 email campaigns per month",
      "Up to 10,000 subscribers",
      "Automation sequence setup (3 flows)",
      "Advanced list segmentation",
      "A/B testing (subject + content)",
      "Lead nurture drip campaigns",
      "Welcome series automation",
      "Re-engagement campaign",
      "Behavioral trigger emails",
      "Dynamic content personalization",
      "Email deliverability optimization",
      "DKIM/SPF/DMARC setup",
      "Conversion tracking",
      "Bi-weekly email report",
      "Monthly strategy review",
      "List health & hygiene audit",
    ],
  },
  {
    name: "Email Marketing – Enterprise",
    description:
      "Full-service email marketing with drip campaigns & CRM integration.",
    price: "₹4,499",
    features: [
      "Unlimited email campaigns",
      "Unlimited subscribers",
      "Full drip campaign architecture",
      "CRM integration (HubSpot/Zoho)",
      "Dedicated account manager",
      "Advanced segmentation & scoring",
      "Multi-step automation flows",
      "Personalized dynamic content",
      "Transactional email setup",
      "SMS + email combined flows",
      "Revenue attribution tracking",
      "Deliverability management",
      "Weekly performance reporting",
      "Custom email template design",
      "Quarterly email strategy audit",
      "Priority support (same-day)",
    ],
  },
  {
    name: "Email Campaign Manager",
    description:
      "Full-service campaign management with strategy, design & tracking.",
    price: "₹2,999",
    features: [
      "Campaign strategy development",
      "3 email campaigns per month",
      "Custom email template design",
      "Compelling copywriting",
      "Subject line optimization",
      "Audience segmentation",
      "Automation trigger setup",
      "Send schedule management",
      "A/B test setup",
      "Open & click tracking",
      "Bounce rate management",
      "Spam compliance check",
      "List growth strategy",
      "Conversion goal tracking",
      "Monthly campaign report",
      "Subscriber preference management",
    ],
  },
  // Web Development
  {
    name: "Landing Page Design",
    description:
      "High-converting landing page with mobile responsiveness & CTA optimization.",
    price: "₹2,999",
    features: [
      "Custom landing page design",
      "Mobile-first responsive layout",
      "Conversion-focused structure",
      "Above-the-fold optimization",
      "CTA button strategy",
      "Lead capture form setup",
      "Trust badge integration",
      "Testimonial section design",
      "Hero section design",
      "Social proof elements",
      "Fast page load (<2s)",
      "Basic on-page SEO",
      "Google Analytics setup",
      "Pixel/tracking code integration",
      "A/B test-ready structure",
      "Post-launch 30-day support",
    ],
  },
  {
    name: "Business Website Development",
    description: "Professional 5–10 page website with CMS & contact forms.",
    price: "₹17,499",
    features: [
      "5–10 page custom website",
      "CMS integration (WordPress/etc.)",
      "Mobile-responsive design",
      "Contact & inquiry forms",
      "On-page SEO setup",
      "Google Analytics 4 integration",
      "Site speed optimization",
      "SSL certificate setup",
      "Blog section setup",
      "About/team page design",
      "Services page design",
      "Google Maps integration",
      "Social media links",
      "Custom domain configuration",
      "60-day post-launch support",
      "Training & documentation",
    ],
  },
  {
    name: "E-Commerce Website",
    description:
      "Full-featured e-commerce with product catalog & payment gateway.",
    price: "₹12,499",
    features: [
      "Full e-commerce platform setup",
      "Product catalog (up to 100 SKUs)",
      "Payment gateway integration",
      "Shopping cart & checkout",
      "Order management system",
      "Inventory tracking setup",
      "Customer account portal",
      "Wishlist & comparison features",
      "Mobile-responsive storefront",
      "Product search & filters",
      "Coupon & discount system",
      "Review & rating system",
      "SEO-optimized product pages",
      "Google Shopping integration",
      "Security & SSL setup",
      "90-day post-launch support",
    ],
  },
  {
    name: "Landing Page Builder",
    description:
      "Professional landing page with conversion optimization & A/B testing.",
    price: "₹2,499",
    features: [
      "Custom landing page build",
      "A/B testing setup",
      "Heatmap integration",
      "Conversion rate optimization",
      "Lead form with validation",
      "Thank you page design",
      "Mobile optimization",
      "Cross-browser compatibility",
      "Fast load speed optimization",
      "Tracking pixel setup",
      "Countdown timer integration",
      "Social proof widgets",
      "Exit-intent popup setup",
      "CTA button optimization",
      "Form A/B testing",
      "Post-launch performance report",
    ],
  },
  {
    name: "WordPress Website Pack",
    description:
      "Professional WordPress site with SEO setup & mobile optimization.",
    price: "₹4,499",
    features: [
      "Custom WordPress theme design",
      "Responsive mobile optimization",
      "Plugin setup & configuration",
      "Yoast/RankMath SEO setup",
      "Contact form 7/WPForms setup",
      "WooCommerce ready structure",
      "Page builder (Elementor/Gutenberg)",
      "Speed optimization (WP Rocket)",
      "Security plugin setup",
      "Backup solution integration",
      "Google Analytics 4 linking",
      "Social sharing buttons",
      "Blog & category pages",
      "Custom 404 page",
      "WordPress training session",
      "60-day post-launch support",
    ],
  },
  {
    name: "Shopify Store Setup",
    description:
      "Complete Shopify store with product listings & conversion optimization.",
    price: "₹12,499",
    features: [
      "Shopify store setup & configuration",
      "Premium theme customization",
      "Up to 50 product listings",
      "Payment gateway setup",
      "Shipping zone configuration",
      "Tax & currency setup",
      "Custom domain linking",
      "Abandoned cart email setup",
      "Upsell & cross-sell apps",
      "Product collection organization",
      "Conversion-optimized checkout",
      "Google Analytics & Pixel setup",
      "Shopify SEO basics",
      "Inventory management setup",
      "Mobile store optimization",
      "45-day post-launch support",
    ],
  },
  // Graphic Design
  {
    name: "Brand Identity Design",
    description:
      "Complete brand identity with logo, color palette & guidelines.",
    price: "₹3,999",
    features: [
      "Primary logo design (3 concepts)",
      "Secondary logo variant",
      "Favicon design",
      "Color palette (5 colors)",
      "Typography selection & pairing",
      "Brand guidelines document",
      "Logo in all formats (SVG/PNG/PDF)",
      "Business card design",
      "Letterhead design",
      "Email signature design",
      "Social media profile kit",
      "Brand mood board",
      "Pattern/texture design",
      "Icon set (6 custom icons)",
      "Brand voice guidelines",
      "2 revision rounds included",
    ],
  },
  {
    name: "Social Media Graphics Pack",
    description: "Custom graphic templates for posts, stories & covers.",
    price: "₹2,499",
    features: [
      "15 post templates (feed)",
      "10 story templates",
      "3 Facebook cover designs",
      "3 LinkedIn banner designs",
      "3 Twitter/X header designs",
      "YouTube channel art",
      "Profile photo frame design",
      "Highlight cover icons (12)",
      "Brand color application",
      "Editable Canva/PSD files",
      "Platform-optimized sizing",
      "Typography applied",
      "2 revision rounds",
      "All formats exported",
      "Commercial usage rights",
      "Delivery within 5 working days",
    ],
  },
  {
    name: "Brochure & Flyer Design",
    description: "Professional print & digital brochure and flyer design.",
    price: "₹2,499",
    features: [
      "A4/A5 flyer design (2 sides)",
      "Tri-fold brochure option",
      "Print-ready high-res export",
      "Digital PDF version",
      "Brand-consistent design",
      "Custom layout & typography",
      "Stock imagery sourcing",
      "Product/service highlight layout",
      "QR code integration",
      "Color-accurate CMYK output",
      "Bleed & crop mark setup",
      "Multiple size variations",
      "Editable source file delivery",
      "2 revision rounds",
      "Fast 48-hour turnaround",
      "Commercial print specification",
    ],
  },
  {
    name: "Digital Asset Manager",
    description:
      "Comprehensive digital asset management & library organization.",
    price: "₹2,999",
    features: [
      "Digital asset library setup",
      "Brand asset categorization",
      "Cloud storage organization",
      "Asset tagging & metadata",
      "Brand kit standardization",
      "Template library creation",
      "Version control management",
      "Asset usage rights tracking",
      "Team access & permissions",
      "Monthly asset audit",
      "New asset creation (5/month)",
      "Asset repurposing for platforms",
      "Brand compliance checks",
      "Distribution channel setup",
      "Usage analytics reporting",
      "Asset retirement tracking",
    ],
  },
  {
    name: "Infographic Design Pack",
    description:
      "Custom infographic design for data visualization & content marketing.",
    price: "₹2,499",
    features: [
      "3 custom infographics per month",
      "Data visualization design",
      "Process flow diagrams",
      "Statistical infographics",
      "Timeline design",
      "Comparison charts",
      "Brand-consistent design",
      "Vertical & horizontal formats",
      "Social media optimized sizing",
      "Web & print formats",
      "Editable source files",
      "Icon & illustration usage",
      "Color-coded data design",
      "2 revision rounds each",
      "Fast 72-hour delivery",
      "Commercial rights included",
    ],
  },
  {
    name: "Complete Brand Identity Pack",
    description:
      "Full brand identity with logo, guidelines & all brand collateral.",
    price: "₹2,999",
    features: [
      "Primary + secondary logo design",
      "Full color palette system",
      "Typography system (3 fonts)",
      "Comprehensive brand guidelines",
      "Business card design",
      "Letterhead + envelope design",
      "Email signature template",
      "Social media profile kit",
      "Social media template set (10)",
      "Brand pattern & texture",
      "Custom icon set (10 icons)",
      "PowerPoint/deck template",
      "Invoice & quotation template",
      "Brand voice & messaging guide",
      "3 revision rounds",
      "Full rights & source file delivery",
    ],
  },
  // Video Production
  {
    name: "Reels & Short Video Editing",
    description:
      "Professional editing of Reels, Shorts & TikTok with captions.",
    price: "₹2,499",
    features: [
      "8 short video edits per month",
      "Instagram Reels (up to 90 sec)",
      "YouTube Shorts editing",
      "TikTok format editing",
      "Auto-captions & subtitles",
      "Licensed background music",
      "Colour grading & enhancement",
      "Branded intro/outro",
      "Text animation overlays",
      "Transitions & effects",
      "Aspect ratio optimization",
      "Platform-specific sizing",
      "Audio noise reduction",
      "Thumbnail frame selection",
      "1 revision per video",
      "48-hour turnaround",
    ],
  },
  {
    name: "Corporate Video Production",
    description:
      "End-to-end corporate video production with scripting & editing.",
    price: "₹12,499",
    features: [
      "Pre-production planning",
      "Script writing & storyboarding",
      "On-location shooting (1 day)",
      "Professional camera & lighting",
      "Teleprompter support",
      "Director & crew coordination",
      "Post-production editing",
      "Color grading",
      "Professional voiceover",
      "Background music licensing",
      "Motion graphics & lower thirds",
      "Logo animation",
      "Subtitle & caption file",
      "2-minute final video",
      "2 revision rounds",
      "Multiple format delivery",
    ],
  },
  {
    name: "Explainer Video (Animated)",
    description:
      "Animated explainer videos for products & services with voiceover.",
    price: "₹7,499",
    features: [
      "60–90 second animated video",
      "Script writing included",
      "Storyboard creation",
      "2D character animation",
      "Motion graphics design",
      "Professional voiceover",
      "Background music",
      "Brand color & logo integration",
      "Custom illustration style",
      "Scene-by-scene animation",
      "Sound effects integration",
      "HD 1080p output",
      "Multiple format delivery",
      "Subtitle/caption file",
      "2 revision rounds",
      "Commercial usage rights",
    ],
  },
  // Automation & AI
  {
    name: "WhatsApp Business Automation",
    description:
      "WhatsApp Business API with automated replies & chatbot flows.",
    price: "₹2,499",
    features: [
      "WhatsApp Business API setup",
      "Automated reply flows (10 flows)",
      "Chatbot conversation design",
      "Lead capture form integration",
      "Welcome message automation",
      "FAQ auto-response setup",
      "Abandoned cart reminders",
      "Order status notifications",
      "Appointment booking flows",
      "CRM integration",
      "Multi-agent inbox setup",
      "Broadcast list management",
      "Analytics & chat reports",
      "Opt-in/opt-out management",
      "24/7 auto-response coverage",
      "30-day post-setup support",
    ],
  },
  {
    name: "CRM Setup & Automation",
    description:
      "CRM setup with automated lead nurturing & pipeline management.",
    price: "₹2,999",
    features: [
      "CRM platform setup (Zoho/HubSpot)",
      "Pipeline stage configuration",
      "Lead source tracking",
      "Automated lead assignment",
      "Lead nurture email sequences",
      "Deal stage automation",
      "Task & reminder automation",
      "Contact scoring setup",
      "Web-to-lead form integration",
      "Email template library",
      "Sales dashboard creation",
      "Team access & role setup",
      "CRM training session",
      "Monthly CRM audit",
      "Reporting & analytics setup",
      "45-day post-setup support",
    ],
  },
  {
    name: "AI Chatbot Development",
    description:
      "Custom AI-powered chatbot for website, WhatsApp & social media.",
    price: "₹4,499",
    features: [
      "Custom AI chatbot design",
      "NLP (Natural Language Processing)",
      "Website chat integration",
      "WhatsApp integration option",
      "Facebook Messenger integration",
      "Intent recognition training",
      "FAQ knowledge base setup",
      "Lead qualification flow",
      "Appointment booking bot",
      "Human handoff escalation",
      "Multi-language support",
      "Analytics dashboard",
      "Conversation history logs",
      "Sentiment analysis",
      "Continuous learning setup",
      "60-day post-launch support",
    ],
  },
  {
    name: "WhatsApp Marketing Campaigns",
    description:
      "Targeted WhatsApp marketing with broadcast messages & catalogs.",
    price: "₹2,499",
    features: [
      "4 broadcast campaigns per month",
      "Target audience segmentation",
      "Promotional message copywriting",
      "Product catalog setup",
      "Personalized message variables",
      "Campaign scheduling",
      "Opt-in list management",
      "Template message approvals",
      "Click-through tracking",
      "Delivery & read rate reports",
      "Offer & coupon distribution",
      "Re-engagement campaigns",
      "Customer feedback collection",
      "Festival/seasonal campaigns",
      "Compliance management",
      "Monthly campaign report",
    ],
  },
  // Lead Generation
  {
    name: "Lead Generation – Starter",
    description: "Targeted lead generation using LinkedIn & email outreach.",
    price: "₹2,499",
    features: [
      "LinkedIn lead prospecting",
      "100 targeted leads per month",
      "Email outreach campaigns",
      "Cold email copywriting",
      "Lead capture landing page",
      "Lead qualification criteria",
      "CRM lead upload",
      "Follow-up email sequence",
      "Bounce & unsubscribe management",
      "Industry & role targeting",
      "Email deliverability optimization",
      "LinkedIn connection strategy",
      "Basic lead scoring",
      "Weekly lead report",
      "Monthly performance review",
      "Onboarding ICP definition",
    ],
  },
  {
    name: "Lead Generation – Growth",
    description:
      "Multi-channel lead generation with paid ads & SEO integration.",
    price: "₹2,499",
    features: [
      "Multi-channel lead strategy",
      "300+ targeted leads per month",
      "Paid ad lead campaigns (Meta/Google)",
      "SEO-driven lead content",
      "Content lead magnets",
      "Email nurture automation",
      "LinkedIn Sales Navigator outreach",
      "Retargeting lead campaigns",
      "Webinar/event lead capture",
      "Advanced lead scoring",
      "CRM integration & tagging",
      "A/B tested landing pages",
      "Lead quality analysis",
      "Bi-weekly performance report",
      "Dedicated lead specialist",
      "Monthly strategy review call",
    ],
  },
  {
    name: "B2B Lead Generation",
    description:
      "Specialized B2B lead generation with account-based marketing.",
    price: "₹7,499",
    features: [
      "Account-based marketing (ABM)",
      "500+ B2B leads per month",
      "Decision-maker targeting",
      "C-suite & director outreach",
      "Industry-specific prospecting",
      "LinkedIn InMail campaigns",
      "Data enrichment & verification",
      "Intent data targeting",
      "Multi-touch outreach sequences",
      "Personalized pitch creation",
      "Sales-ready lead qualification",
      "CRM pipeline integration",
      "Account tracking & signals",
      "Weekly lead quality report",
      "Dedicated B2B strategist",
      "Monthly ABM strategy review",
    ],
  },
  // Reputation Management
  {
    name: "Online Reputation Management",
    description: "Monitor & improve reputation across Google & social media.",
    price: "₹3,999",
    features: [
      "Brand mention monitoring (24/7)",
      "Google review management",
      "Review response strategy",
      "Negative review mitigation",
      "Review generation campaigns",
      "Trustpilot/G2 profile management",
      "Social media sentiment tracking",
      "News & media monitoring",
      "Crisis alert system",
      "Competitor reputation analysis",
      "Positive content amplification",
      "Review platform optimization",
      "Monthly reputation audit",
      "Reputation score tracking",
      "PR response templates",
      "Monthly reputation report",
    ],
  },
  {
    name: "Google My Business Optimization",
    description:
      "Complete GMB optimization, post management & review response.",
    price: "₹2,499",
    features: [
      "GMB profile full optimization",
      "Business category optimization",
      "Attribute & service setup",
      "Photo uploads (10/month)",
      "Weekly GMB posts",
      "Q&A section management",
      "Review response (all reviews)",
      "Review generation strategy",
      "Business description rewrite",
      "Hours & holiday update management",
      "Product/service catalog setup",
      "Local keyword integration",
      "GMB insights analysis",
      "Duplicate listing cleanup",
      "Monthly GMB performance report",
      "Local pack ranking tracking",
    ],
  },
  // Analytics
  {
    name: "Marketing Analytics Setup",
    description: "Setup GA4, Tag Manager & custom dashboards for tracking.",
    price: "₹3,999",
    features: [
      "Google Analytics 4 setup",
      "Google Tag Manager configuration",
      "Conversion goal setup",
      "Event tracking implementation",
      "Custom dimension setup",
      "E-commerce tracking",
      "Funnel visualization setup",
      "Custom GA4 dashboard",
      "Search Console linking",
      "Google Ads linking",
      "Meta Pixel integration",
      "UTM tracking framework",
      "Audience segment creation",
      "Data retention configuration",
      "Team access setup",
      "Documentation & training session",
    ],
  },
  {
    name: "Monthly Marketing Report",
    description: "Comprehensive monthly performance report with insights.",
    price: "₹2,499",
    features: [
      "Full monthly performance report",
      "SEO ranking overview",
      "Paid ads performance analysis",
      "Social media metrics",
      "Website traffic analysis",
      "Email marketing stats",
      "Conversion rate analysis",
      "Lead generation summary",
      "ROI calculation",
      "Goal vs. actual comparison",
      "Competitor performance snapshot",
      "Key insight highlights",
      "Actionable recommendations",
      "Custom branded PDF report",
      "Executive summary section",
      "Month-over-month trend charts",
    ],
  },
  {
    name: "Competitor Analysis Report",
    description: "In-depth competitor analysis across SEO, social & ads.",
    price: "₹3,499",
    features: [
      "5 competitor deep analysis",
      "SEO keyword gap analysis",
      "Backlink profile comparison",
      "Content strategy analysis",
      "Social media benchmarking",
      "Paid ads strategy overview",
      "Landing page comparison",
      "Pricing & offer analysis",
      "Social media engagement metrics",
      "SERP feature comparison",
      "Audience & positioning insights",
      "Traffic estimation comparison",
      "SWOT analysis",
      "Opportunity identification",
      "Recommended counter-strategy",
      "Branded PDF report delivery",
    ],
  },
  {
    name: "Data & Analytics",
    description:
      "Advanced analytics to turn marketing data into actionable insights.",
    price: "₹3,999",
    features: [
      "Multi-source data integration",
      "Custom analytics dashboard",
      "Looker Studio report creation",
      "Marketing attribution modeling",
      "Customer journey mapping",
      "Cohort analysis",
      "Revenue attribution reporting",
      "Funnel conversion analysis",
      "Predictive trend analysis",
      "Data anomaly detection",
      "KPI scorecard setup",
      "Automated report delivery",
      "Executive-level insights",
      "Data visualization design",
      "Monthly data strategy call",
      "Dedicated analytics support",
    ],
  },
  {
    name: "Conversion Rate Optimization (CRO)",
    description: "Data-driven CRO to improve website conversion rates.",
    price: "₹2,999",
    features: [
      "Full CRO audit & analysis",
      "Heatmap & session recording setup",
      "User behavior analysis",
      "A/B testing (3 tests/month)",
      "Landing page optimization",
      "Form optimization",
      "CTA design & placement testing",
      "Page speed conversion impact",
      "Checkout flow optimization",
      "Trust element implementation",
      "Exit-intent strategy",
      "Mobile conversion audit",
      "Conversion funnel analysis",
      "Personalization strategy",
      "Monthly CRO report",
      "Incremental conversion roadmap",
    ],
  },
  // Digital Marketing
  {
    name: "Digital Marketing Strategy Consultation",
    description:
      "One-on-one session to build a customized digital marketing roadmap.",
    price: "₹2,499",
    features: [
      "2-hour strategy session",
      "Business & market analysis",
      "ICP (Ideal Customer Profile) definition",
      "Channel selection strategy",
      "Competitor landscape overview",
      "Budget allocation recommendations",
      "90-day marketing roadmap",
      "KPI & goal setting",
      "Content strategy overview",
      "Paid vs. organic channel mix",
      "Growth opportunity mapping",
      "Quick-win identification",
      "Brand positioning review",
      "Funnel architecture planning",
      "Recorded session delivery",
      "Strategy document PDF",
    ],
  },
  {
    name: "Performance Marketing",
    description: "Data-driven performance marketing focused on measurable ROI.",
    price: "₹2,999",
    features: [
      "Multi-channel campaign setup",
      "ROAS-focused campaign strategy",
      "Google + Meta campaign management",
      "Conversion tracking full setup",
      "Performance-based bidding",
      "Landing page optimization",
      "Audience funnel architecture",
      "Creative A/B testing",
      "Attribution model setup",
      "Real-time performance dashboard",
      "CPA & CPL optimization",
      "Scaling budget strategy",
      "Weekly performance report",
      "Competitor ad benchmarking",
      "Monthly ROI review call",
      "Dedicated performance manager",
    ],
  },
  {
    name: "Influencer Marketing",
    description:
      "End-to-end influencer campaigns including identification & tracking.",
    price: "₹7,499",
    features: [
      "Influencer identification & vetting",
      "Nano to macro influencer options",
      "Niche-specific sourcing",
      "Outreach & negotiation",
      "Campaign brief creation",
      "Content review & approval",
      "Influencer contract management",
      "Deliverable tracking",
      "Story & feed post coordination",
      "UGC content collection",
      "Tracking link & pixel setup",
      "Reach & engagement analysis",
      "Influencer payment management",
      "Post-campaign performance report",
      "ROI calculation",
      "Long-term relationship building",
    ],
  },
  // Business & Agency
  {
    name: "Startup Launch Pack",
    description: "Complete digital marketing launch package for startups.",
    price: "₹12,499",
    features: [
      "Brand identity setup",
      "Social media profile creation",
      "Website landing page",
      "Google My Business setup",
      "Initial SEO setup",
      "Launch ad campaign",
      "Email marketing setup",
      "Content calendar (1 month)",
      "PR announcement post",
      "Lead capture setup",
      "Analytics tracking setup",
      "Competitor analysis",
      "ICP & buyer persona creation",
      "Brand messaging framework",
      "Launch strategy session",
      "30-day post-launch support",
    ],
  },
  {
    name: "Small Business Growth Pack",
    description:
      "Bundled digital marketing for small businesses growing online.",
    price: "₹4,499",
    features: [
      "Social media management (2 platforms)",
      "Basic SEO optimization",
      "Google My Business management",
      "Monthly email newsletter",
      "Basic paid ad setup",
      "Content creation (8 posts/month)",
      "Monthly analytics report",
      "Competitor landscape review",
      "Brand consistency audit",
      "Lead capture landing page",
      "Review generation strategy",
      "Monthly strategy call",
      "Audience growth plan",
      "Local SEO signals",
      "Ad creative design",
      "Quarterly performance review",
    ],
  },
  {
    name: "Restaurant & Food Business Pack",
    description:
      "Specialized digital marketing for restaurants & food businesses.",
    price: "₹2,999",
    features: [
      "Instagram food content (16 posts/month)",
      "Google My Business optimization",
      "Local SEO for restaurant keywords",
      "Zomato/Swiggy listing optimization",
      "Food photography direction guide",
      "Menu promotion campaigns",
      "Festive & seasonal campaigns",
      "Online review management",
      "WhatsApp order promotion",
      "Story content (12/month)",
      "Influencer food blogger outreach",
      "Facebook local ads",
      "Google local ads setup",
      "Monthly performance report",
      "Customer engagement strategy",
      "Loyalty program promotion",
    ],
  },
  {
    name: "Real Estate Digital Marketing Pack",
    description:
      "Targeted digital marketing for real estate agents & developers.",
    price: "₹2,499",
    features: [
      "Property listing promotion",
      "Facebook & Instagram real estate ads",
      "Google Search ads for properties",
      "Lead generation landing pages",
      "WhatsApp lead capture setup",
      "Virtual tour content support",
      "Social media management",
      "Local SEO for area keywords",
      "Real estate blog content",
      "99acres/MagicBricks optimization",
      "YouTube property video SEO",
      "Email drip for leads",
      "CRM lead pipeline setup",
      "Weekly lead report",
      "Competitor property analysis",
      "Monthly performance review",
    ],
  },
  {
    name: "Healthcare & Clinic Marketing Pack",
    description: "HIPAA-compliant digital marketing for clinics & hospitals.",
    price: "₹7,499",
    features: [
      "Healthcare-compliant content",
      "Google My Business management",
      "Local SEO for clinic keywords",
      "Doctor profile optimization",
      "Patient review management",
      "Health awareness social content",
      "Appointment booking integration",
      "Facebook health ads (compliant)",
      "Google health ads setup",
      "Patient education blog posts",
      "Telemedicine promotion content",
      "Seasonal health campaign",
      "Email newsletter for patients",
      "Competitor clinic analysis",
      "Monthly performance report",
      "Social media (2 platforms)",
    ],
  },
  {
    name: "Education & Coaching Marketing Pack",
    description:
      "Digital marketing for coaching institutes & ed-tech platforms.",
    price: "₹3,499",
    features: [
      "Admission lead campaigns",
      "Facebook & Instagram ed-tech ads",
      "Google Search ads for courses",
      "Landing page for admissions",
      "YouTube course promotion",
      "Email nurture for prospects",
      "WhatsApp inquiry automation",
      "Course testimonial posts",
      "Faculty highlight content",
      "Organic social media (2 platforms)",
      "Local SEO for institute",
      "Result announcement campaigns",
      "Retargeting for website visitors",
      "Monthly enrollment report",
      "Competitor institute analysis",
      "Strategy call monthly",
    ],
  },
  {
    name: "E-Commerce Growth Pack",
    description: "Comprehensive digital marketing for e-commerce stores.",
    price: "₹2,499",
    features: [
      "Google Shopping campaigns",
      "Meta product catalog ads",
      "Dynamic retargeting setup",
      "Abandoned cart campaigns",
      "Email marketing automation",
      "Product launch campaigns",
      "Influencer product seeding",
      "SEO for product pages",
      "CRO audit for checkout",
      "Seasonal sale campaigns",
      "Loyalty & repeat purchase emails",
      "Customer review strategy",
      "Social media product content",
      "ROAS-focused management",
      "Weekly performance report",
      "Monthly growth strategy call",
    ],
  },
  {
    name: "Agency White-Label Pack",
    description:
      "White-label digital marketing services for agencies to resell.",
    price: "₹7,499",
    features: [
      "White-label service delivery",
      "Unbranded client reports",
      "SEO services (resellable)",
      "Social media management",
      "Paid ads management",
      "Content creation",
      "Email marketing services",
      "Dedicated white-label manager",
      "Client onboarding support",
      "Customizable report templates",
      "Scalable team resources",
      "NDA & confidentiality agreement",
      "Priority delivery timelines",
      "Agency partner dashboard",
      "Monthly review & feedback",
      "Flexible service bundling",
    ],
  },
  {
    name: "Monthly Retainer – Basic",
    description:
      "Flexible monthly retainer for ongoing digital marketing support.",
    price: "₹7,499",
    features: [
      "20 hours/month execution support",
      "Social media management (1 platform)",
      "Basic SEO maintenance",
      "Monthly analytics report",
      "Email support",
      "Content creation (8 assets/month)",
      "Monthly strategy call",
      "Ad campaign monitoring",
      "Basic landing page updates",
      "Competitor monitoring",
      "Review management",
      "Blog post (1/month)",
      "Brand guideline adherence",
      "Priority task scheduling",
      "Rollover hours (up to 5)",
      "Flexible pause policy",
    ],
  },
  {
    name: "Monthly Retainer – Standard",
    description: "Standard retainer covering social media, SEO & paid ads.",
    price: "₹7,499",
    features: [
      "40 hours/month execution support",
      "Social media (3 platforms)",
      "SEO optimization & reporting",
      "Paid ads management (2 channels)",
      "Email marketing (2 campaigns/month)",
      "Bi-weekly strategy calls",
      "Content creation (20 assets/month)",
      "Monthly performance report",
      "Competitor analysis",
      "CRO recommendations",
      "Blog posts (2/month)",
      "Dedicated account manager",
      "Priority support",
      "Landing page updates",
      "Quarterly strategy review",
      "Flexible scope adjustment",
    ],
  },
  {
    name: "Monthly Retainer – Pro",
    description:
      "Pro retainer with full-service digital marketing & priority support.",
    price: "₹12,499",
    features: [
      "80 hours/month execution support",
      "Social media (5 platforms)",
      "Full SEO management",
      "Paid ads (all major channels)",
      "Email marketing automation",
      "Weekly strategy calls",
      "Full content production",
      "Influencer coordination",
      "CRM management",
      "Dedicated senior strategist",
      "24/7 priority support",
      "Weekly performance reports",
      "Custom growth dashboard",
      "Conversion optimization",
      "Quarterly business review",
      "Dedicated creative team",
    ],
  },
  {
    name: "Monthly Retainer – Enterprise",
    description:
      "Enterprise retainer for comprehensive digital marketing coverage.",
    price: "₹12,499",
    features: [
      "Unlimited execution hours",
      "Dedicated marketing team",
      "All digital channels managed",
      "Enterprise SEO program",
      "Full paid ads management",
      "Advanced marketing automation",
      "Executive weekly reporting",
      "Board-level strategy sessions",
      "Custom CRM integrations",
      "AI-driven campaign optimization",
      "Multi-country campaign support",
      "Brand reputation management",
      "Full content production unit",
      "SLA guarantee (99.9% uptime)",
      "Dedicated account director",
      "Quarterly business planning",
    ],
  },
  {
    name: "Project Management Suite",
    description:
      "End-to-end project management for digital marketing campaigns.",
    price: "₹3,999",
    features: [
      "Campaign planning & scoping",
      "Project roadmap creation",
      "Task assignment & tracking",
      "Deadline management",
      "Resource allocation planning",
      "Client communication management",
      "Progress reporting (weekly)",
      "Budget tracking",
      "Risk & issue management",
      "Stakeholder updates",
      "Trello/Asana/ClickUp setup",
      "SOP documentation",
      "Quality assurance checks",
      "Post-campaign retrospective",
      "Scope change management",
      "Team performance tracking",
    ],
  },
  {
    name: "Digital Marketing Starter Bundle",
    description: "All-in-one starter bundle with social media, SEO & content.",
    price: "₹2,499",
    features: [
      "Social media (2 platforms)",
      "Basic SEO setup",
      "Content creation (12 assets/month)",
      "Monthly blog post",
      "Google Analytics setup",
      "Google My Business setup",
      "Email newsletter (1/month)",
      "Basic paid ad consultation",
      "Monthly performance report",
      "Brand audit",
      "Hashtag strategy",
      "Monthly strategy call",
      "Competitor snapshot",
      "Profile optimization",
      "Audience growth strategy",
      "Onboarding brand session",
    ],
  },
  {
    name: "Digital Marketing Growth Bundle",
    description: "Comprehensive growth bundle with social, SEO, ads & email.",
    price: "₹2,499",
    features: [
      "Social media (4 platforms)",
      "Full SEO management",
      "Paid ads (Google + Meta)",
      "Email marketing (4 campaigns/month)",
      "Content creation (24 assets/month)",
      "4 blog posts per month",
      "Bi-weekly strategy calls",
      "Lead generation campaigns",
      "CRM integration support",
      "Influencer outreach",
      "Monthly performance report",
      "Conversion optimization",
      "Competitor analysis",
      "Dedicated account manager",
      "Advanced analytics dashboard",
      "Quarterly growth review",
    ],
  },
  {
    name: "Digital Marketing Premium Bundle",
    description: "Premium all-inclusive bundle for aggressive growth.",
    price: "₹34,999",
    features: [
      "Social media (6 platforms)",
      "Enterprise SEO management",
      "Full paid ads management",
      "Advanced email automation",
      "Full content production",
      "8 blog articles per month",
      "Influencer marketing campaigns",
      "Advanced CRM automation",
      "Weekly strategy calls",
      "Dedicated senior manager",
      "AI-driven campaign optimization",
      "Custom analytics dashboard",
      "Brand reputation management",
      "Conversion rate optimization",
      "Weekly performance reports",
      "Quarterly business strategy review",
    ],
  },
  // Student
  {
    name: "Student Social Media Starter Pack",
    description:
      "Affordable social media management for student entrepreneurs.",
    price: "₹2,499",
    features: [
      "1 social platform managed",
      "8 posts per month",
      "Basic content design",
      "Caption writing",
      "Hashtag research",
      "Profile optimization",
      "Story posts (4/month)",
      "Audience growth basics",
      "Monthly analytics summary",
      "Content calendar",
      "Brand color consistency",
      "Basic engagement",
      "Post scheduling",
      "Content ideas bank",
      "Monthly review call",
      "Student-friendly onboarding",
    ],
  },
  {
    name: "Student SEO Pack",
    description:
      "Entry-level SEO for student projects, blogs & small websites.",
    price: "₹2,499",
    features: [
      "5 target keywords optimized",
      "On-page SEO basics",
      "Meta title & description",
      "Google Search Console setup",
      "Google Analytics setup",
      "Sitemap submission",
      "Image alt text",
      "Internal linking review",
      "Page speed check",
      "robots.txt setup",
      "Monthly ranking report",
      "Blog post optimization (1/month)",
      "Keyword research guide",
      "Competitor top-page check",
      "Basic SEO audit",
      "Student learning resources",
    ],
  },
  {
    name: "Student Content Creation Pack",
    description: "Budget-friendly content for student blogs & portfolios.",
    price: "₹2,499",
    features: [
      "8 social media graphics",
      "4 story designs",
      "1 blog article (500 words)",
      "Basic brand design",
      "Caption copywriting",
      "Hashtag sets",
      "Portfolio piece design",
      "Canva template delivery",
      "Profile cover design",
      "Content calendar template",
      "1 revision round",
      "Mobile-optimized formats",
      "Brand color usage",
      "Typography selection",
      "Delivery within 5 days",
      "Student brief template",
    ],
  },
  {
    name: "Student Brand Building Pack",
    description:
      "Personal brand building for students entering the job market.",
    price: "₹2,499",
    features: [
      "LinkedIn profile optimization",
      "Personal brand statement",
      "Professional bio writing",
      "Profile photo guidelines",
      "LinkedIn banner design",
      "Instagram personal brand setup",
      "Personal logo design",
      "Color palette selection",
      "Brand voice definition",
      "Portfolio page structure",
      "8 personal brand posts",
      "Connection growth strategy",
      "Skill highlight strategy",
      "Resume-aligned branding",
      "Online presence audit",
      "Career positioning guidance",
    ],
  },
  {
    name: "Student Digital Marketing Internship Pack",
    description: "Hands-on digital marketing project support for students.",
    price: "₹2,499",
    features: [
      "Project scoping & planning",
      "Campaign brief creation",
      "Keyword research project",
      "Social media audit",
      "Google Analytics analysis",
      "Competitor research report",
      "Content strategy draft",
      "Paid ads mock campaign",
      "Email marketing setup guide",
      "SEO report creation",
      "Performance data analysis",
      "Project documentation",
      "Presentation deck support",
      "Mentor review session",
      "Certificate of completion",
      "LinkedIn recommendation letter",
    ],
  },
  // Premium & Scale
  {
    name: "Premium Brand Accelerator",
    description:
      "High-impact brand acceleration combining SEO, ads & influencer marketing.",
    price: "₹37,499",
    features: [
      "Full SEO management",
      "Google + Meta + LinkedIn ads",
      "Content production (full)",
      "Influencer marketing campaign",
      "PR & media outreach",
      "Advanced CRM automation",
      "Conversion funnel optimization",
      "Weekly performance calls",
      "Brand positioning strategy",
      "Competitive market analysis",
      "Custom analytics dashboard",
      "Dedicated brand strategist",
      "Monthly brand audit",
      "Lead generation system",
      "Quarterly growth planning",
      "SLA-backed delivery",
    ],
  },
  {
    name: "Scale-Up Marketing Suite",
    description:
      "Comprehensive marketing suite for scaling with advanced automation.",
    price: "₹22,499",
    features: [
      "Full-stack marketing execution",
      "Advanced marketing automation",
      "All paid channels managed",
      "Enterprise-grade SEO",
      "Full content production unit",
      "Email + WhatsApp automation",
      "AI-driven campaign optimization",
      "Custom CRM workflows",
      "Weekly executive reporting",
      "Dedicated account director",
      "Influencer + PR program",
      "Conversion rate optimization",
      "Multi-channel attribution",
      "Scaling budget management",
      "Quarterly strategy intensives",
      "Priority 24/7 support",
    ],
  },
  {
    name: "Premium Content & SEO Bundle",
    description: "Premium content marketing & SEO for top search rankings.",
    price: "₹22,499",
    features: [
      "Unlimited keywords targeted",
      "8 long-form articles/month",
      "Aggressive link building (15+/month)",
      "Topic authority cluster strategy",
      "Featured snippet targeting",
      "Thought leadership content",
      "Guest post placements (4/month)",
      "Digital PR for backlinks",
      "Video content repurposing",
      "Full technical SEO",
      "Weekly ranking reports",
      "E-E-A-T optimization",
      "Content distribution strategy",
      "Advanced schema markup",
      "Dedicated SEO + content team",
      "Monthly strategy deep-dive",
    ],
  },
  {
    name: "Premium Paid Ads Management",
    description:
      "Full-service premium paid ads across Google, Meta, LinkedIn & YouTube.",
    price: "₹27,499",
    features: [
      "Google Ads full management",
      "Meta Ads full management",
      "LinkedIn Ads management",
      "YouTube Ads management",
      "Full-funnel campaign strategy",
      "Advanced audience targeting",
      "Cross-platform retargeting",
      "Dynamic product ads",
      "A/B testing (5 tests/month)",
      "Advanced attribution modeling",
      "Real-time performance dashboard",
      "Weekly spend review",
      "ROAS scaling strategy",
      "Dedicated paid ads strategist",
      "Landing page CRO",
      "Monthly performance deep-dive",
    ],
  },
  // Enterprise
  {
    name: "Enterprise Digital Marketing Suite",
    description:
      "End-to-end enterprise solution with dedicated team & full execution.",
    price: "₹37,499",
    features: [
      "Dedicated enterprise marketing team",
      "Custom multi-channel strategy",
      "All digital channels managed",
      "Enterprise SEO program",
      "Full paid ads management",
      "Advanced content production",
      "Marketing automation (full)",
      "CRM & technology integration",
      "Board-level executive reporting",
      "SLA-backed service guarantee",
      "Multi-country campaign support",
      "Brand reputation management",
      "AI-driven optimizations",
      "Quarterly strategy intensives",
      "Custom analytics & dashboards",
      "Dedicated account director",
    ],
  },
  {
    name: "Enterprise SEO & Content Program",
    description: "Large-scale SEO & content program for enterprise websites.",
    price: "₹39,999",
    features: [
      "Unlimited keywords managed",
      "Enterprise technical SEO audit",
      "Dedicated SEO program manager",
      "20+ DA links per month",
      "12 long-form articles/month",
      "Content cluster architecture",
      "International SEO strategy",
      "Core Web Vitals optimization",
      "Advanced schema markup",
      "E-E-A-T authority building",
      "Featured snippet domination",
      "Weekly SEO performance report",
      "Competitor displacement strategy",
      "Custom SEO analytics dashboard",
      "Full content distribution",
      "Quarterly authority review",
    ],
  },
  {
    name: "Enterprise Paid Ads & Analytics",
    description:
      "Enterprise-grade paid ads with advanced analytics & attribution.",
    price: "₹59,999",
    features: [
      "All paid ad platforms managed",
      "Enterprise campaign architecture",
      "Advanced attribution modeling",
      "Multi-touch ROI reporting",
      "Programmatic display advertising",
      "Unlimited A/B testing",
      "Custom analytics dashboards",
      "Real-time performance monitoring",
      "Dedicated paid media director",
      "Cross-channel budget optimization",
      "Looker Studio executive reports",
      "Audience intelligence platform",
      "Competitive intelligence reports",
      "Media mix modeling",
      "Weekly executive briefing",
      "On-demand strategy support",
    ],
  },
  // Web3 & Blockchain
  {
    name: "Web3 Toolbox",
    description:
      "Complete Web3 marketing with NFT promotion & crypto community management.",
    price: "₹2,499",
    features: [
      "NFT project promotion strategy",
      "Discord community management",
      "Telegram group management",
      "Twitter/X crypto presence",
      "Whitepaper content support",
      "Tokenomics content creation",
      "Crypto influencer outreach",
      "IDO/NFT launch marketing",
      "Community AMA planning",
      "Roadmap visualization content",
      "Reddit community engagement",
      "Crypto PR & media outreach",
      "Web3 SEO optimization",
      "On-chain analytics reporting",
      "Decentralized audience building",
      "Monthly Web3 campaign report",
    ],
  },
];

export default function AllPlansCarousel() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const sectionRef = useRef<HTMLElement>(null);

  // Combine master plans + all services
  const allCards = useCallback((): AllPlanCard[] => {
    const masters = buildAllPlans();
    const services: AllPlanCard[] = SERVICE_PLANS.map((s, i) => ({
      id: `service-${i}`,
      name: s.name,
      description: s.description,
      price: s.price,
      features: s.features,
    }));
    return [...masters, ...services];
  }, []);

  const cards = allCards();
  const totalCards = cards.length;

  useEffect(() => {
    const update = () => {
      setVisibleCount(window.innerWidth >= 768 ? 3 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, totalCards - visibleCount);

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  const handleGetQuote = (name: string, price: string) => {
    setSelectedName(name);
    setSelectedPrice(price);
    setModalOpen(true);
  };

  // Derived ocid for visible cards (positions 1-3)
  const getOcid = (absoluteIndex: number): string => {
    const rel = absoluteIndex - currentIndex + 1;
    if (rel >= 1 && rel <= 3) return `all_plans.card.${rel}`;
    return `all_plans.card.${absoluteIndex + 1}`;
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Inject keyframe styles */}
      <style>{ambientShapeStyles}</style>

      {/* 3D ambient floating shapes */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
        style={{ perspective: "800px" }}
      >
        {/* Cube — top left */}
        <AmbientCube
          style={{
            top: "8%",
            left: "3%",
            animation: "floatA 12s ease-in-out infinite",
            opacity: 0.7,
          }}
        />
        {/* Octahedron — top right */}
        <AmbientOctahedron
          style={{
            top: "5%",
            right: "5%",
            animation: "floatB 9s ease-in-out infinite",
            opacity: 0.55,
          }}
        />
        {/* Torus — bottom left */}
        <AmbientTorus
          style={{
            bottom: "10%",
            left: "6%",
            animation: "floatC 14s ease-in-out infinite",
            opacity: 0.5,
          }}
        />
        {/* Pyramid — bottom right */}
        <AmbientPyramid
          style={{
            bottom: "8%",
            right: "4%",
            animation: "floatD 11s ease-in-out infinite",
            opacity: 0.55,
          }}
        />
        {/* Extra small cube mid */}
        <AmbientCube
          style={{
            top: "50%",
            right: "1%",
            animation: "floatA 16s ease-in-out infinite reverse",
            opacity: 0.3,
            transform: "scale(0.5)",
          }}
        />
      </div>

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,255,198,0.04) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "oklch(0.88 0.18 168)", letterSpacing: "0.2em" }}
          >
            Complete Catalogue
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
            All{" "}
            <span style={{ color: "oklch(0.88 0.18 168)" }}>
              {totalCards}+ Plans
            </span>
          </h2>
          <p
            className="text-base max-w-xl mx-auto mb-2"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Browse every service we offer — master plans to niche specialists.
          </p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
            {currentIndex + 1}–
            {Math.min(currentIndex + visibleCount, totalCards)} of {totalCards}{" "}
            plans
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Left arrow */}
          <button
            type="button"
            onClick={prev}
            disabled={currentIndex === 0}
            data-ocid="all_plans.carousel_prev"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 flex items-center justify-center rounded-full transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              width: 56,
              height: 56,
              background: "rgba(0,255,198,0.1)",
              border: "1.5px solid rgba(0,255,198,0.4)",
              boxShadow:
                currentIndex > 0 ? "0 0 24px rgba(0,255,198,0.3)" : "none",
              color: "oklch(0.88 0.18 168)",
            }}
            aria-label="Previous plans"
          >
            <ChevronLeft size={26} />
          </button>

          {/* Right arrow */}
          <button
            type="button"
            onClick={next}
            disabled={currentIndex >= maxIndex}
            data-ocid="all_plans.carousel_next"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 flex items-center justify-center rounded-full transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              width: 56,
              height: 56,
              background: "rgba(0,255,198,0.1)",
              border: "1.5px solid rgba(0,255,198,0.4)",
              boxShadow:
                currentIndex < maxIndex
                  ? "0 0 24px rgba(0,255,198,0.3)"
                  : "none",
              color: "oklch(0.88 0.18 168)",
            }}
            aria-label="Next plans"
          >
            <ChevronRight size={26} />
          </button>

          {/* Viewport */}
          <div className="overflow-hidden mx-2">
            <div
              className="flex gap-5 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(calc(-${currentIndex} * (100% / ${visibleCount} + ${visibleCount > 1 ? "6.67px" : "0px"})))`,
              }}
            >
              {cards.map((card, idx) => (
                <div
                  key={card.id}
                  className="flex-shrink-0"
                  style={{
                    width:
                      visibleCount > 1
                        ? `calc(${100 / visibleCount}% - ${((visibleCount - 1) * 20) / visibleCount}px)`
                        : "100%",
                  }}
                >
                  <AllPlanCardView
                    card={card}
                    onGetQuote={handleGetQuote}
                    ocid={getOcid(idx)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Progress dots (grouped) */}
          <div className="flex justify-center gap-1.5 mt-8 flex-wrap max-w-xs mx-auto">
            {Array.from(
              { length: Math.ceil(totalCards / visibleCount) },
              (__, pageIdx) => pageIdx,
            ).map((pageIdx) => {
              const pageStart = pageIdx * visibleCount;
              const isActive =
                currentIndex >= pageStart &&
                currentIndex < pageStart + visibleCount;
              return (
                <button
                  key={`pg-${pageIdx}`}
                  type="button"
                  onClick={() => setCurrentIndex(Math.min(pageStart, maxIndex))}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? 20 : 6,
                    height: 6,
                    background: isActive
                      ? "oklch(0.88 0.18 168)"
                      : "rgba(255,255,255,0.2)",
                    boxShadow: isActive
                      ? "0 0 8px rgba(0,255,198,0.5)"
                      : "none",
                  }}
                  aria-label={`Go to page ${pageIdx + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        planName={selectedName}
        planPrice={selectedPrice}
      />
    </section>
  );
}
