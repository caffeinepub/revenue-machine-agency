import { ExternalLink } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="relative py-14 px-4 sm:px-6"
      style={{
        background: "rgba(0,0,0,0.6)",
        borderTop: "1px solid rgba(0,255,198,0.08)",
      }}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
          {/* Brand */}
          <div className="max-w-xs">
            <div
              className="font-black text-2xl mb-2"
              style={{
                color: "oklch(0.88 0.18 168)",
                letterSpacing: "-0.03em",
                textShadow: "0 0 20px rgba(0,255,198,0.3)",
              }}
            >
              Revenue Machine
            </div>
            <p
              className="text-sm"
              style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}
            >
              Strategic Digital Growth Systems for Businesses Targeting 8-Figure
              Revenue.
            </p>
          </div>

          {/* Nav links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-3">
            {[
              { label: "Pricing", id: "pricing" },
              { label: "Enterprise", id: "enterprise" },
              { label: "ROI Calculator", id: "roi-calculator" },
              { label: "Compare Plans", id: "compare" },
              { label: "FAQ", id: "faq" },
              { label: "Contact", id: "contact" },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm text-left transition-colors"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.88 0.18 168)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(255,255,255,0.4)";
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-6"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,255,198,0.15), transparent)",
          }}
        />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            © {year} Revenue Machine. All rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Built with ❤ using caffeine.ai
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </footer>
  );
}
