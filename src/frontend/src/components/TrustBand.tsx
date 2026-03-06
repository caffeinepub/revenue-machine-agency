import { useScrollReveal } from "../hooks/useScrollReveal";

const BRANDS = [
  "ScaleForce India",
  "NexGen Ventures",
  "ApexBrands Co.",
  "Catalyst Growth",
  "Elevate Digital",
];

export default function TrustBand() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="section-reveal py-14"
      style={{
        background: "rgba(0,255,198,0.02)",
        borderTop: "1px solid rgba(0,255,198,0.08)",
        borderBottom: "1px solid rgba(0,255,198,0.08)",
      }}
    >
      <div className="container mx-auto px-4">
        <p
          className="text-center mb-8 font-semibold tracking-widest uppercase text-xs"
          style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em" }}
        >
          Trusted by Scaling Brands Across India
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
          {BRANDS.map((brand) => (
            <div
              key={brand}
              className="glass-card px-6 py-3 rounded-full text-sm font-semibold tracking-wide"
              style={{
                color: "rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(0,255,198,0.1)",
                letterSpacing: "0.05em",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.color = "oklch(0.88 0.18 168)";
                el.style.borderColor = "rgba(0,255,198,0.3)";
                el.style.boxShadow = "0 0 16px rgba(0,255,198,0.12)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.color = "rgba(255,255,255,0.5)";
                el.style.borderColor = "rgba(0,255,198,0.1)";
                el.style.boxShadow = "none";
              }}
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
