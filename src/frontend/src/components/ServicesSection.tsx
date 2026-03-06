import { Check, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import InquiryModal from "./InquiryModal";

/* ─── 3D CSS shapes for category tabs ───────────────────────────── */
const shape3dKeyframes = `
@keyframes spin3d {
  0%   { transform: rotateY(0deg)   rotateX(12deg); }
  100% { transform: rotateY(360deg) rotateX(12deg); }
}
@keyframes spin3dX {
  0%   { transform: rotateX(0deg)   rotateZ(15deg); }
  100% { transform: rotateX(360deg) rotateZ(15deg); }
}
@keyframes spin3dZ {
  0%   { transform: rotateZ(0deg)   rotateY(20deg); }
  100% { transform: rotateZ(360deg) rotateY(20deg); }
}
@keyframes spin3dXY {
  0%   { transform: rotateX(0deg)   rotateY(0deg); }
  50%  { transform: rotateX(180deg) rotateY(180deg); }
  100% { transform: rotateX(360deg) rotateY(360deg); }
}
@keyframes spin3dDiamond {
  0%   { transform: rotateY(0deg)   rotateX(45deg); }
  100% { transform: rotateY(360deg) rotateX(45deg); }
}
`;

type ShapeType =
  | "cube"
  | "ring"
  | "diamond"
  | "box"
  | "wireCube"
  | "octahedron"
  | "cylinder"
  | "sphere"
  | "pyramid"
  | "prism"
  | "dodecahedron"
  | "torusKnot"
  | "tetrahedron"
  | "gem"
  | "largeCube"
  | "hexPrism";

function Shape3D({ type, active }: { type: ShapeType; active: boolean }) {
  const teal = active ? "rgba(0,255,198,0.9)" : "rgba(0,255,198,0.55)";
  const tealBg = active ? "rgba(0,255,198,0.12)" : "rgba(0,255,198,0.04)";
  const glow = active
    ? "0 0 12px rgba(0,255,198,0.8)"
    : "0 0 6px rgba(0,255,198,0.3)";
  const size = 22;
  const half = size / 2;

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    transformStyle: "preserve-3d",
    perspective: 120,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flexShrink: 0,
  };

  const faceStyle = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    position: "absolute",
    width: size,
    height: size,
    border: `1px solid ${teal}`,
    background: tealBg,
    boxSizing: "border-box",
    ...extra,
  });

  if (type === "cube" || type === "largeCube") {
    const s = type === "largeCube" ? size + 2 : size;
    const h = s / 2;
    return (
      <div style={{ ...containerStyle, width: s, height: s }}>
        <div
          style={{
            width: s,
            height: s,
            transformStyle: "preserve-3d",
            animation: "spin3d 4s linear infinite",
            position: "relative",
          }}
        >
          {[
            { transform: `translateZ(${h}px)`, isFirst: true },
            { transform: `rotateY(180deg) translateZ(${h}px)`, isFirst: false },
            { transform: `rotateY(90deg) translateZ(${h}px)`, isFirst: false },
            { transform: `rotateY(-90deg) translateZ(${h}px)`, isFirst: false },
            { transform: `rotateX(90deg) translateZ(${h}px)`, isFirst: false },
            { transform: `rotateX(-90deg) translateZ(${h}px)`, isFirst: false },
          ].map((f) => (
            <div
              key={f.transform}
              style={{
                ...faceStyle({ width: s, height: s }),
                transform: f.transform,
                boxShadow: f.isFirst ? glow : undefined,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === "wireCube") {
    return (
      <div style={containerStyle}>
        <div
          style={{
            width: size,
            height: size,
            transformStyle: "preserve-3d",
            animation: "spin3d 5s linear infinite",
            position: "relative",
          }}
        >
          {[
            { transform: `translateZ(${half}px)` },
            { transform: `rotateY(180deg) translateZ(${half}px)` },
            { transform: `rotateY(90deg) translateZ(${half}px)` },
            { transform: `rotateY(-90deg) translateZ(${half}px)` },
            { transform: `rotateX(90deg) translateZ(${half}px)` },
            { transform: `rotateX(-90deg) translateZ(${half}px)` },
          ].map((f) => (
            <div
              key={f.transform}
              style={{
                position: "absolute",
                width: size,
                height: size,
                border: `1px solid ${teal}`,
                background: "transparent",
                boxSizing: "border-box",
                ...f,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === "ring") {
    return (
      <div
        style={{ ...containerStyle, animation: "spin3dXY 5s linear infinite" }}
      >
        {[0, 30, 60, 90, 120, 150].map((angle, idx) => (
          <div
            key={`ring-${angle}`}
            style={{
              position: "absolute",
              width: size,
              height: size,
              border: `1.5px solid ${teal}`,
              borderRadius: "50%",
              opacity: 0.7 + idx * 0.05,
              transform: `rotateY(${angle}deg)`,
              boxShadow: angle === 0 ? glow : undefined,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "sphere") {
    return (
      <div
        style={{ ...containerStyle, animation: "spin3dXY 4s linear infinite" }}
      >
        {[0, 45, 90, 135].map((angle) => (
          <div
            key={`sv-${angle}`}
            style={{
              position: "absolute",
              width: size,
              height: size,
              border: `1px solid ${teal}`,
              borderRadius: "50%",
              transform: `rotateY(${angle}deg)`,
            }}
          />
        ))}
        {[0, 45].map((angle) => (
          <div
            key={`sh-${angle}`}
            style={{
              position: "absolute",
              width: size,
              height: size,
              border: `1px solid ${teal}`,
              borderRadius: "50%",
              transform: `rotateX(${angle}deg)`,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "diamond" || type === "gem") {
    const pts = type === "gem" ? 6 : 4;
    return (
      <div
        style={{
          ...containerStyle,
          animation: "spin3dDiamond 4s linear infinite",
        }}
      >
        {Array.from({ length: pts }, (__, gi) => gi).map((gi) => (
          <div
            key={`gem-${gi}`}
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              borderLeft: `${half}px solid transparent`,
              borderRight: `${half}px solid transparent`,
              borderBottom: `${size * 0.85}px solid ${gi % 2 === 0 ? teal.replace("0.9", "0.35").replace("0.55", "0.25") : "transparent"}`,
              transform: `rotateY(${(gi / pts) * 360}deg) rotateX(25deg)`,
              filter: `drop-shadow(0 0 3px ${teal})`,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "octahedron") {
    return (
      <div
        style={{ ...containerStyle, animation: "spin3d 4.5s linear infinite" }}
      >
        {[0, 90, 180, 270].map((rot, i) => (
          <div
            key={`oct-${rot}`}
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              borderLeft: `${half}px solid transparent`,
              borderRight: `${half}px solid transparent`,
              borderBottom:
                i < 2
                  ? `${size * 0.85}px solid ${tealBg.replace("0.12", "0.25").replace("0.04", "0.15")}`
                  : undefined,
              borderTop:
                i >= 2
                  ? `${size * 0.85}px solid ${tealBg.replace("0.12", "0.2").replace("0.04", "0.12")}`
                  : undefined,
              transform: `rotateY(${rot}deg) rotateX(${i < 2 ? 30 : -30}deg)`,
              filter: `drop-shadow(0 0 2px ${teal})`,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "tetrahedron") {
    return (
      <div
        style={{
          ...containerStyle,
          animation: "spin3dDiamond 5s linear infinite",
        }}
      >
        {[0, 120, 240].map((rot) => (
          <div
            key={`tet-${rot}`}
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              borderLeft: `${half}px solid transparent`,
              borderRight: `${half}px solid transparent`,
              borderBottom: `${size * 0.85}px solid ${tealBg.replace("0.12", "0.3").replace("0.04", "0.18")}`,
              transform: `rotateY(${rot}deg) rotateX(20deg)`,
              filter: `drop-shadow(0 0 2px ${teal})`,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "pyramid") {
    return (
      <div
        style={{ ...containerStyle, animation: "spin3d 5s linear infinite" }}
      >
        {[0, 90, 180, 270].map((rot, i) => (
          <div
            key={`pyr-${rot}`}
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              borderLeft: `${half}px solid transparent`,
              borderRight: `${half}px solid transparent`,
              borderBottom: `${size}px solid ${i % 2 === 0 ? tealBg.replace("0.12", "0.3").replace("0.04", "0.18") : tealBg.replace("0.12", "0.15").replace("0.04", "0.1")}`,
              transform: `rotateY(${rot}deg) rotateX(-20deg) translateZ(${half / 2}px)`,
              filter: `drop-shadow(0 0 2px ${teal})`,
            }}
          />
        ))}
      </div>
    );
  }

  // Cylinder, prism, box, torusKnot, dodecahedron — simplified to spinning box-like shape with rings
  if (type === "cylinder") {
    return (
      <div
        style={{ ...containerStyle, animation: "spin3dX 4s linear infinite" }}
      >
        <div
          style={{
            width: size,
            height: size * 1.2,
            transformStyle: "preserve-3d",
            position: "relative",
            animation: "spin3d 4s linear infinite",
          }}
        >
          {[0, 60, 120].map((angle, i) => (
            <div
              key={`cyl-${angle}`}
              style={{
                position: "absolute",
                width: size,
                height: size * 1.2,
                border: `1px solid ${teal}`,
                borderRadius: "50%",
                transform: `rotateX(${angle}deg)`,
                opacity: 0.6 + i * 0.15,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: 0,
              width: size,
              height: size,
              border: `1px solid ${teal}`,
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: size,
              height: size,
              border: `1px solid ${teal}`,
              borderRadius: "50%",
              transform: `translateZ(${half}px)`,
            }}
          />
        </div>
      </div>
    );
  }

  if (type === "box") {
    // Flat box like envelope
    return (
      <div
        style={{ ...containerStyle, animation: "spin3d 6s linear infinite" }}
      >
        <div
          style={{
            width: size,
            height: size * 0.6,
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          {[
            { transform: `translateZ(${size * 0.3}px)` },
            { transform: `rotateY(180deg) translateZ(${size * 0.3}px)` },
            { transform: `rotateY(90deg) translateZ(${half}px)` },
            { transform: `rotateY(-90deg) translateZ(${half}px)` },
            { transform: `rotateX(90deg) translateZ(${size * 0.3}px)` },
            { transform: `rotateX(-90deg) translateZ(${size * 0.3}px)` },
          ].map((f) => (
            <div
              key={f.transform}
              style={{
                position: "absolute",
                width: size,
                height: size * 0.6,
                border: `1px solid ${teal}`,
                background: tealBg,
                boxSizing: "border-box",
                ...f,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === "prism" || type === "hexPrism") {
    // Hexagonal prism via stacked rings
    const rings = type === "hexPrism" ? 6 : 4;
    return (
      <div
        style={{ ...containerStyle, animation: "spin3d 5s linear infinite" }}
      >
        <div
          style={{
            width: size,
            height: size,
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          {Array.from({ length: rings }, (__, ri) => ri).map((ri) => (
            <div
              key={`prism-${ri}`}
              style={{
                position: "absolute",
                width: size,
                height: size,
                border: `1px solid ${teal}`,
                borderRadius: type === "hexPrism" ? "0" : "3px",
                clipPath:
                  type === "hexPrism"
                    ? "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
                    : undefined,
                transform: `translateZ(${(ri / rings) * size - half}px)`,
                background:
                  ri === 0 || ri === rings - 1 ? tealBg : "transparent",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === "dodecahedron" || type === "torusKnot") {
    // Multi-ring spinning
    return (
      <div style={{ ...containerStyle }}>
        <div
          style={{
            width: size,
            height: size,
            transformStyle: "preserve-3d",
            animation: "spin3dXY 4s linear infinite",
            position: "relative",
          }}
        >
          {[0, 36, 72, 108, 144].map((angle, i) => (
            <div
              key={`dode-${angle}`}
              style={{
                position: "absolute",
                width: size,
                height: size,
                border: `1px solid ${teal}`,
                borderRadius:
                  type === "torusKnot"
                    ? "50% 50% 50% 50% / 60% 60% 40% 40%"
                    : "3px",
                transform: `rotateY(${angle}deg)`,
                opacity: 0.5 + i * 0.1,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // fallback cube
  return (
    <div style={containerStyle}>
      <div
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          animation: "spin3d 4s linear infinite",
          position: "relative",
        }}
      >
        {[
          { transform: `translateZ(${half}px)` },
          { transform: `rotateY(180deg) translateZ(${half}px)` },
          { transform: `rotateY(90deg) translateZ(${half}px)` },
          { transform: `rotateY(-90deg) translateZ(${half}px)` },
          { transform: `rotateX(90deg) translateZ(${half}px)` },
          { transform: `rotateX(-90deg) translateZ(${half}px)` },
        ].map((f) => (
          <div key={f.transform} style={{ ...faceStyle(), ...f }} />
        ))}
      </div>
    </div>
  );
}

const CATEGORY_SHAPES: Record<string, ShapeType> = {
  "social-media": "cube",
  seo: "ring",
  "paid-ads": "diamond",
  "content-marketing": "box",
  "email-marketing": "box",
  "web-development": "wireCube",
  "graphic-design": "octahedron",
  "video-production": "cylinder",
  "automation-ai": "sphere",
  "lead-generation": "pyramid",
  "reputation-management": "sphere",
  analytics: "prism",
  "digital-marketing": "dodecahedron",
  "business-agency": "torusKnot",
  student: "tetrahedron",
  "premium-scale": "gem",
  "enterprise-services": "largeCube",
  "web3-blockchain": "hexPrism",
};

interface Service {
  name: string;
  description: string;
  price: string;
  priceDisplay: string;
  features: string[];
}

interface Category {
  id: string;
  label: string;
  services: Service[];
}

const CATEGORIES: Category[] = [
  {
    id: "social-media",
    label: "Social Media",
    services: [
      {
        name: "Social Media Management – Starter",
        description:
          "Basic social media management for small businesses. Includes content planning, posting, and monthly reporting.",
        price: "₹4,000",
        priceDisplay: "₹4,000",
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
          "Comprehensive social media management with engagement, stories, and bi-weekly reporting.",
        price: "₹7,500",
        priceDisplay: "₹7,500",
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
          "Full-service social media management with reels, influencer coordination, and weekly reporting.",
        price: "₹12,500",
        priceDisplay: "₹12,500",
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
          "Dedicated Instagram growth service with content creation, hashtag strategy, engagement, and follower growth.",
        price: "₹3,500",
        priceDisplay: "₹3,500",
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
          "Professional LinkedIn presence management for personal brands and companies with thought leadership content.",
        price: "₹4,000",
        priceDisplay: "₹4,000",
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
          "Complete YouTube channel management including video optimization, thumbnail design, and audience growth.",
        price: "₹2,500",
        priceDisplay: "₹2,500",
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
          "All-in-one social media management covering content creation, scheduling, engagement, and reporting for 2 platforms.",
        price: "₹2,499",
        priceDisplay: "₹2,499",
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
          "Comprehensive social media management for 3 platforms with reels, stories, and bi-weekly strategy calls.",
        price: "₹4,499",
        priceDisplay: "₹4,499",
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
          "Premium social media management for 5 platforms with full content production, influencer tie-ups, and weekly reporting.",
        price: "₹7,499",
        priceDisplay: "₹7,499",
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
    ],
  },
  {
    id: "seo",
    label: "SEO",
    services: [
      {
        name: "SEO – Basic",
        description:
          "On-page SEO optimization, keyword research, and monthly ranking report for up to 10 keywords.",
        price: "₹3,000",
        priceDisplay: "₹3,000",
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
        description:
          "Comprehensive SEO with on-page, off-page, technical audit, and link building for up to 25 keywords.",
        price: "₹3,000",
        priceDisplay: "₹3,000",
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
        description:
          "Enterprise-grade SEO with unlimited keywords, dedicated account manager, and weekly reporting.",
        price: "₹12,500",
        priceDisplay: "₹12,500",
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
          "In-depth SEO audit and analysis covering technical SEO, on-page factors, backlink profile, and competitor benchmarking.",
        price: "₹2,500",
        priceDisplay: "₹2,500",
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
        description:
          "Dominate local search results with Google Maps optimization, local citations, and review management.",
        price: "₹3,000",
        priceDisplay: "₹3,000",
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
          "Entry-level SEO package with keyword research, on-page optimization, and monthly ranking reports.",
        price: "₹3,999",
        priceDisplay: "₹3,999",
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
          "Mid-tier SEO package with technical audit, link building, content optimization, and bi-weekly reporting.",
        price: "₹7,499",
        priceDisplay: "₹7,499",
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
          "Advanced SEO package with unlimited keywords, aggressive link building, and dedicated SEO manager.",
        price: "₹13,999",
        priceDisplay: "₹13,999",
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
    ],
  },
  {
    id: "paid-ads",
    label: "Paid Ads",
    services: [
      {
        name: "Google Ads Management",
        description:
          "Setup and management of Google Search, Display, and Shopping campaigns with monthly optimization.",
        price: "₹4,000",
        priceDisplay: "₹4,000",
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
          "Facebook and Instagram paid advertising with audience targeting, creative strategy, and reporting.",
        price: "₹3,500",
        priceDisplay: "₹3,500",
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
          "B2B LinkedIn advertising for lead generation, brand awareness, and event promotion.",
        price: "₹3,000",
        priceDisplay: "₹3,000",
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
          "Comprehensive paid advertising tracking and optimization service across Google, Meta, LinkedIn, and YouTube.",
        price: "₹4,000",
        priceDisplay: "₹4,000",
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
        description:
          "YouTube advertising campaigns including TrueView, bumper ads, and discovery ads with full optimization.",
        price: "₹4,500",
        priceDisplay: "₹4,500",
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
        description:
          "Niche platform advertising on Pinterest and Twitter/X for brand awareness and targeted audience reach.",
        price: "₹4,000",
        priceDisplay: "₹4,000",
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
        description:
          "Google Ads setup and management for small businesses with search campaigns and monthly optimization.",
        price: "₹4,499",
        priceDisplay: "₹4,499",
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
          "Facebook and Instagram ads management with retargeting, lookalike audiences, and creative strategy.",
        price: "₹6,499",
        priceDisplay: "₹6,499",
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
        description:
          "Complete paid advertising management across Google, Meta, and YouTube with full-funnel strategy.",
        price: "₹12,499",
        priceDisplay: "₹12,499",
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
    ],
  },
  {
    id: "content-marketing",
    label: "Content Marketing",
    services: [
      {
        name: "Blog Writing – Starter",
        description:
          "SEO-optimized blog articles written by expert content writers. 4 articles per month.",
        price: "₹2,500",
        priceDisplay: "₹2,500",
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
        description:
          "High-quality long-form blog content with keyword research and internal linking. 8 articles per month.",
        price: "₹4,500",
        priceDisplay: "₹4,500",
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
        description:
          "Professional video scripts for YouTube, reels, ads, and explainer videos.",
        price: "₹2,499",
        priceDisplay: "₹2,499",
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
        description:
          "End-to-end podcast production, editing, and marketing to grow your audience and brand authority.",
        price: "₹4,000",
        priceDisplay: "₹4,000",
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
        description:
          "Strategic digital PR campaigns to earn media coverage, backlinks, and brand mentions from top publications.",
        price: "₹7,500",
        priceDisplay: "₹7,500",
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
        description:
          "Monthly content creation bundle including social media posts, stories, and basic graphic design.",
        price: "₹3,499",
        priceDisplay: "₹3,499",
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
        description:
          "Premium content creation with reels, carousels, long-form blogs, and video scripts for maximum engagement.",
        price: "₹8,499",
        priceDisplay: "₹8,499",
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
    ],
  },
  {
    id: "email-marketing",
    label: "Email Marketing",
    services: [
      {
        name: "Email Marketing – Starter",
        description:
          "Monthly email newsletter design, copywriting, and campaign management for up to 2,000 subscribers.",
        price: "₹2,499",
        priceDisplay: "₹2,499",
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
        description:
          "Advanced email marketing with automation sequences, segmentation, and A/B testing.",
        price: "₹4,500",
        priceDisplay: "₹4,500",
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
          "Full-service email marketing with drip campaigns, CRM integration, and dedicated account manager.",
        price: "₹4,500",
        priceDisplay: "₹4,500",
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
          "Full-service email campaign management including strategy, design, copywriting, automation, and performance tracking.",
        price: "₹3,000",
        priceDisplay: "₹3,000",
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
    ],
  },
  {
    id: "web-development",
    label: "Web Development",
    services: [
      {
        name: "Landing Page Design",
        description:
          "High-converting landing page design and development with mobile responsiveness and CTA optimization.",
        price: "₹3,000",
        priceDisplay: "₹3,000",
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
        description:
          "Professional 5–10 page business website with CMS, contact forms, and SEO setup.",
        price: "₹17,500",
        priceDisplay: "₹17,500",
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
          "Full-featured e-commerce website with product catalog, payment gateway, and order management.",
        price: "₹12,500",
        priceDisplay: "₹12,500",
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
          "Professional landing page design and development service with conversion optimization and A/B testing.",
        price: "₹2,500",
        priceDisplay: "₹2,500",
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
          "Professional WordPress website design and development with SEO setup and mobile optimization.",
        price: "₹4,500",
        priceDisplay: "₹4,500",
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
          "Complete Shopify store setup with product listings, payment gateway, and conversion optimization.",
        price: "₹12,500",
        priceDisplay: "₹12,500",
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
    ],
  },
  {
    id: "graphic-design",
    label: "Graphic Design",
    services: [
      {
        name: "Brand Identity Design",
        description:
          "Complete brand identity including logo, color palette, typography, and brand guidelines.",
        price: "₹4,000",
        priceDisplay: "₹4,000",
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
        description:
          "Custom social media graphic templates for posts, stories, and covers across all platforms.",
        price: "₹2,499",
        priceDisplay: "₹2,499",
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
        description:
          "Professional print and digital brochure and flyer design for marketing campaigns.",
        price: "₹2,499",
        priceDisplay: "₹2,499",
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
          "Comprehensive digital asset management service including content library organization, brand asset creation, and distribution.",
        price: "₹3,000",
        priceDisplay: "₹3,000",
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
          "Custom infographic design for data visualization, process flows, and educational content marketing.",
        price: "₹2,499",
        priceDisplay: "₹2,499",
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
          "Full brand identity creation including logo, color palette, typography, brand guidelines, and all brand collateral.",
        price: "₹3,000",
        priceDisplay: "₹3,000",
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
    ],
  },
  {
    id: "video-production",
    label: "Video Production",
    services: [
      {
        name: "Reels & Short Video Editing",
        description:
          "Professional editing of Instagram Reels, YouTube Shorts, and TikTok videos with captions and music.",
        price: "₹2,499",
        priceDisplay: "₹2,499",
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
          "End-to-end corporate video production including scripting, shooting, and post-production.",
        price: "₹12,500",
        priceDisplay: "₹12,500",
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
          "Animated explainer videos for products, services, and onboarding with voiceover.",
        price: "₹7,500",
        priceDisplay: "₹7,500",
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
    ],
  },
  {
    id: "automation-ai",
    label: "Automation & AI",
    services: [
      {
        name: "WhatsApp Business Automation",
        description:
          "Set up WhatsApp Business API with automated replies, chatbot flows, and lead capture.",
        price: "₹2,500",
        priceDisplay: "₹2,500",
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
          "Setup and configure CRM with automated lead nurturing, pipeline management, and reporting.",
        price: "₹3,000",
        priceDisplay: "₹3,000",
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
          "Custom AI-powered chatbot for website, WhatsApp, or social media with NLP capabilities.",
        price: "₹4,500",
        priceDisplay: "₹4,500",
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
          "Targeted WhatsApp marketing campaigns with broadcast messages, catalog setup, and customer engagement.",
        price: "₹2,500",
        priceDisplay: "₹2,500",
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
    ],
  },
  {
    id: "lead-generation",
    label: "Lead Generation",
    services: [
      {
        name: "Lead Generation – Starter",
        description:
          "Targeted lead generation using LinkedIn, email outreach, and landing pages.",
        price: "₹2,500",
        priceDisplay: "₹2,500",
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
          "Multi-channel lead generation with paid ads, SEO, and content marketing integration.",
        price: "₹2,500",
        priceDisplay: "₹2,500",
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
          "Specialized B2B lead generation with account-based marketing and decision-maker targeting.",
        price: "₹7,500",
        priceDisplay: "₹7,500",
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
    ],
  },
  {
    id: "reputation-management",
    label: "Reputation",
    services: [
      {
        name: "Online Reputation Management",
        description:
          "Monitor, manage, and improve your online reputation across Google, social media, and review platforms.",
        price: "₹4,000",
        priceDisplay: "₹4,000",
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
          "Complete GMB profile optimization, post management, and review response service.",
        price: "₹2,500",
        priceDisplay: "₹2,500",
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
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    services: [
      {
        name: "Marketing Analytics Setup",
        description:
          "Setup Google Analytics 4, Tag Manager, and custom dashboards for comprehensive marketing tracking.",
        price: "₹4,000",
        priceDisplay: "₹4,000",
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
        description:
          "Comprehensive monthly marketing performance report with insights and recommendations.",
        price: "₹2,500",
        priceDisplay: "₹2,500",
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
        description:
          "In-depth competitor analysis covering SEO, social media, ads, and content strategy.",
        price: "₹3,500",
        priceDisplay: "₹3,500",
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
          "Advanced data analytics and reporting service to turn your marketing data into actionable business insights.",
        price: "₹4,000",
        priceDisplay: "₹4,000",
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
        description:
          "Data-driven CRO service to improve website conversion rates through testing, analysis, and optimization.",
        price: "₹3,000",
        priceDisplay: "₹3,000",
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
    ],
  },
  {
    id: "digital-marketing",
    label: "Digital Marketing",
    services: [
      {
        name: "Digital Marketing Strategy Consultation",
        description:
          "One-on-one strategy session to build a customized digital marketing roadmap for your business.",
        price: "₹2,500",
        priceDisplay: "₹2,500",
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
        description:
          "Data-driven performance marketing campaigns focused on measurable ROI across all digital channels.",
        price: "₹3,000",
        priceDisplay: "₹3,000",
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
          "End-to-end influencer marketing campaigns including identification, outreach, and performance tracking.",
        price: "₹7,500",
        priceDisplay: "₹7,500",
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
    ],
  },
  {
    id: "business-agency",
    label: "Business & Agency",
    services: [
      {
        name: "Startup Launch Pack",
        description:
          "Complete digital marketing launch package for startups — brand identity, social setup, and initial campaigns.",
        price: "₹12,500",
        priceDisplay: "₹12,500",
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
          "Bundled digital marketing services tailored for small businesses looking to grow their online presence.",
        price: "₹4,500",
        priceDisplay: "₹4,500",
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
          "Specialized digital marketing for restaurants, cafes, and food businesses with local SEO and social media.",
        price: "₹3,000",
        priceDisplay: "₹3,000",
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
          "Targeted digital marketing for real estate agents and developers with lead generation and property promotion.",
        price: "₹2,500",
        priceDisplay: "₹2,500",
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
        description:
          "HIPAA-compliant digital marketing for clinics, hospitals, and healthcare professionals.",
        price: "₹7,500",
        priceDisplay: "₹7,500",
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
          "Digital marketing solutions for coaching institutes, ed-tech platforms, and educational institutions.",
        price: "₹3,500",
        priceDisplay: "₹3,500",
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
        description:
          "Comprehensive digital marketing for e-commerce stores to drive traffic, conversions, and repeat purchases.",
        price: "₹2,500",
        priceDisplay: "₹2,500",
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
          "White-label digital marketing services for agencies to resell under their own brand.",
        price: "₹7,500",
        priceDisplay: "₹7,500",
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
          "Flexible monthly retainer for ongoing digital marketing support and execution.",
        price: "₹7,500",
        priceDisplay: "₹7,500",
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
        description:
          "Standard monthly retainer covering social media, SEO, and paid ads management.",
        price: "₹7,500",
        priceDisplay: "₹7,500",
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
          "Pro monthly retainer with full-service digital marketing, dedicated manager, and priority support.",
        price: "₹12,500",
        priceDisplay: "₹12,500",
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
          "Enterprise monthly retainer for large businesses requiring comprehensive digital marketing coverage.",
        price: "₹12,500",
        priceDisplay: "₹12,500",
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
          "End-to-end project management for digital marketing campaigns including planning, execution, and reporting.",
        price: "₹4,000",
        priceDisplay: "₹4,000",
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
        description:
          "All-in-one starter bundle combining social media, SEO, and content creation for new businesses.",
        price: "₹2,499",
        priceDisplay: "₹2,499",
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
        description:
          "Comprehensive growth bundle with social media, SEO, paid ads, and email marketing for scaling businesses.",
        price: "₹2,499",
        priceDisplay: "₹2,499",
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
        description:
          "Premium all-inclusive digital marketing bundle for established businesses targeting aggressive growth.",
        price: "₹34,999",
        priceDisplay: "₹34,999",
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
    ],
  },
  {
    id: "student",
    label: "Student",
    services: [
      {
        name: "Student Social Media Starter Pack",
        description:
          "Affordable social media management package designed for student entrepreneurs and small personal brands.",
        price: "₹2,499",
        priceDisplay: "₹2,499",
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
          "Entry-level SEO package for student projects, blogs, and small websites.",
        price: "₹2,499",
        priceDisplay: "₹2,499",
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
        description:
          "Budget-friendly content creation for student blogs, portfolios, and social media channels.",
        price: "₹2,499",
        priceDisplay: "₹2,499",
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
          "Personal brand building package for students and fresh graduates entering the job market.",
        price: "₹2,499",
        priceDisplay: "₹2,499",
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
        description:
          "Hands-on digital marketing project support for students completing internships or academic projects.",
        price: "₹2,500",
        priceDisplay: "₹2,500",
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
    ],
  },
  {
    id: "premium-scale",
    label: "Premium & Scale",
    services: [
      {
        name: "Premium Brand Accelerator",
        description:
          "High-impact brand acceleration program combining SEO, paid ads, content, and influencer marketing.",
        price: "₹37,500",
        priceDisplay: "₹37,500",
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
          "Comprehensive marketing suite for businesses ready to scale with advanced automation and analytics.",
        price: "₹22,500",
        priceDisplay: "₹22,500",
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
        description:
          "Premium content marketing and SEO bundle for businesses targeting top search rankings and thought leadership.",
        price: "₹22,500",
        priceDisplay: "₹22,500",
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
          "Full-service premium paid advertising management across Google, Meta, LinkedIn, and YouTube.",
        price: "₹27,500",
        priceDisplay: "₹27,500",
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
    ],
  },
  {
    id: "enterprise-services",
    label: "Enterprise",
    services: [
      {
        name: "Enterprise Digital Marketing Suite",
        description:
          "End-to-end enterprise digital marketing solution with dedicated team, custom strategy, and full-service execution.",
        price: "₹37,500",
        priceDisplay: "₹37,500",
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
        description:
          "Large-scale SEO and content marketing program for enterprise websites with hundreds of pages.",
        price: "₹40,000",
        priceDisplay: "₹40,000",
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
          "Enterprise-grade paid advertising with advanced analytics, attribution modeling, and custom reporting.",
        price: "₹60,000",
        priceDisplay: "₹60,000",
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
    ],
  },
  {
    id: "web3-blockchain",
    label: "Web3 & Blockchain",
    services: [
      {
        name: "Web3 Toolbox",
        description:
          "Complete Web3 marketing toolkit including NFT promotion, crypto community management, and blockchain project marketing.",
        price: "₹2,500",
        priceDisplay: "₹2,500",
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
    ],
  },
];

interface SelectedService {
  name: string;
  price: string;
}

function ServiceCard({
  service,
  onGetQuote,
  delay,
}: {
  service: Service;
  onGetQuote: (s: SelectedService) => void;
  delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const revealRef = useScrollReveal<HTMLDivElement>(delay);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    }
  };

  const waLink = `https://wa.me/919182768591?text=${encodeURIComponent(`Hi, I'm interested in ${service.name}. Please share more details.`)}`;

  return (
    <div ref={revealRef} className="section-reveal">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={(e) => {
          const card = e.currentTarget;
          card.style.background = "rgba(0,255,198,0.04)";
          card.style.borderColor = "rgba(0,255,198,0.35)";
          card.style.boxShadow =
            "0 0 40px rgba(0,255,198,0.12), 0 0 80px rgba(0,255,198,0.04), 0 20px 60px rgba(0,0,0,0.5)";
        }}
        className="relative rounded-2xl flex flex-col h-full p-6"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(0,255,198,0.12)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Service name */}
        <h3
          className="font-black mb-1.5 leading-tight"
          style={{
            fontSize: "1.1rem",
            color: "white",
            letterSpacing: "-0.01em",
          }}
        >
          {service.name}
        </h3>

        {/* Description */}
        <p
          className="text-sm mb-4 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {service.description}
        </p>

        {/* Price */}
        <div className="mb-5">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Starting From
          </span>
          <div
            className="font-black mt-0.5"
            style={{
              fontSize: "1.5rem",
              color: "oklch(0.88 0.18 168)",
              textShadow: "0 0 20px rgba(0,255,198,0.4)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {service.priceDisplay}
          </div>
        </div>

        {/* Features — 2-col grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 mb-5 flex-1">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-start gap-1.5 text-xs">
              <Check
                size={13}
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

        {/* Dual CTA Buttons */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() =>
              onGetQuote({ name: service.name, price: service.priceDisplay })
            }
            className="btn-teal btn-3d-lift"
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
    </div>
  );
}

function CategorySection({
  category,
  onGetQuote,
}: {
  category: Category;
  onGetQuote: (s: SelectedService) => void;
}) {
  const headingRef = useScrollReveal<HTMLDivElement>();

  return (
    <div id={`cat-${category.id}`} className="mb-20">
      <div ref={headingRef} className="section-reveal mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="h-px flex-1 max-w-8"
            style={{ background: "rgba(0,255,198,0.4)" }}
          />
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "oklch(0.88 0.18 168)", letterSpacing: "0.2em" }}
          >
            {category.label}
          </span>
        </div>
        <h3
          className="font-black"
          style={{
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            color: "white",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {category.label === "Social Media"
            ? "Social Media Management"
            : category.label === "Reputation"
              ? "Reputation Management"
              : category.label === "Web3 & Blockchain"
                ? "Web3 & Blockchain Marketing"
                : `${category.label} Services`}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {category.services.map((service, i) => (
          <ServiceCard
            key={service.name}
            service={service}
            onGetQuote={onGetQuote}
            delay={i * 80}
          />
        ))}
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<SelectedService | null>(null);
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const headerRef = useScrollReveal<HTMLDivElement>();
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  const updateScrollState = useCallback(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollTabs = (dir: "left" | "right") => {
    const el = tabsScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });
  };

  const handleGetQuote = (service: SelectedService) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const scrollToCategory = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(`cat-${id}`);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
    // Scroll the active tab into view in the tabs bar
    setTimeout(() => {
      const tabEl = tabsScrollRef.current?.querySelector(
        `[data-ocid="services.${id}.tab"]`,
      );
      if (tabEl) {
        (tabEl as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, 50);
  };

  return (
    <section id="services" className="relative py-24 px-4 sm:px-6">
      {/* Inject 3D shape keyframes */}
      <style>{shape3dKeyframes}</style>

      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,255,198,0.04) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto relative">
        {/* Section header */}
        <div ref={headerRef} className="section-reveal text-center mb-12">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "oklch(0.88 0.18 168)", letterSpacing: "0.2em" }}
          >
            Our Services
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
            Full-Suite{" "}
            <span style={{ color: "oklch(0.88 0.18 168)" }}>
              Digital Marketing
            </span>{" "}
            Services
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Every service engineered for measurable growth.
          </p>
        </div>

        {/* Category tabs — sticky, horizontally scrollable with arrow indicators */}
        <div
          className="sticky top-0 z-20 mb-12 py-3"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,10,10,0.97) 80%, transparent 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="relative flex items-center gap-1">
            {/* Left arrow */}
            <button
              type="button"
              aria-label="Scroll categories left"
              data-ocid="services.categories.pagination_prev"
              onClick={() => scrollTabs("left")}
              className="flex-shrink-0 flex items-center justify-center rounded-xl transition-all duration-200"
              style={{
                width: 34,
                height: 34,
                background: canScrollLeft
                  ? "rgba(0,255,198,0.1)"
                  : "rgba(255,255,255,0.04)",
                border: canScrollLeft
                  ? "1px solid rgba(0,255,198,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",
                color: canScrollLeft
                  ? "oklch(0.88 0.18 168)"
                  : "rgba(255,255,255,0.2)",
                boxShadow: canScrollLeft
                  ? "0 0 12px rgba(0,255,198,0.2)"
                  : "none",
                cursor: canScrollLeft ? "pointer" : "default",
                opacity: canScrollLeft ? 1 : 0.4,
              }}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Scrollable tab strip */}
            <div
              ref={tabsScrollRef}
              className="overflow-x-auto scrollbar-hide flex-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="flex gap-2 pb-1 min-w-max px-1">
                {CATEGORIES.map((cat) => {
                  const isActive = activeTab === cat.id;
                  const shapeType = CATEGORY_SHAPES[cat.id] ?? "cube";
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => scrollToCategory(cat.id)}
                      data-ocid={`services.${cat.id}.tab`}
                      className="flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-300 whitespace-nowrap flex flex-col items-center gap-1.5"
                      style={
                        isActive
                          ? {
                              background: "rgba(0,255,198,0.1)",
                              color: "oklch(0.88 0.18 168)",
                              border: "1px solid rgba(0,255,198,0.5)",
                              boxShadow: "0 0 16px rgba(0,255,198,0.25)",
                              letterSpacing: "0.04em",
                              minWidth: 72,
                            }
                          : {
                              background: "rgba(255,255,255,0.04)",
                              color: "rgba(255,255,255,0.55)",
                              border: "1px solid rgba(0,255,198,0.08)",
                              letterSpacing: "0.04em",
                              minWidth: 72,
                            }
                      }
                    >
                      <div style={{ perspective: 120 }}>
                        <Shape3D type={shapeType} active={isActive} />
                      </div>
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right arrow */}
            <button
              type="button"
              aria-label="Scroll categories right"
              data-ocid="services.categories.pagination_next"
              onClick={() => scrollTabs("right")}
              className="flex-shrink-0 flex items-center justify-center rounded-xl transition-all duration-200"
              style={{
                width: 34,
                height: 34,
                background: canScrollRight
                  ? "rgba(0,255,198,0.1)"
                  : "rgba(255,255,255,0.04)",
                border: canScrollRight
                  ? "1px solid rgba(0,255,198,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",
                color: canScrollRight
                  ? "oklch(0.88 0.18 168)"
                  : "rgba(255,255,255,0.2)",
                boxShadow: canScrollRight
                  ? "0 0 12px rgba(0,255,198,0.2)"
                  : "none",
                cursor: canScrollRight ? "pointer" : "default",
                opacity: canScrollRight ? 1 : 0.4,
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Scroll hint text */}
          <p
            className="text-center mt-2 text-xs"
            style={{ color: "rgba(255,255,255,0.28)", letterSpacing: "0.06em" }}
          >
            ← Swipe or click arrows to browse categories →
          </p>
        </div>

        {/* All categories */}
        {CATEGORIES.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            onGetQuote={handleGetQuote}
          />
        ))}
      </div>

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        planName={selectedService?.name ?? ""}
        planPrice={selectedService?.price ?? ""}
      />
    </section>
  );
}
