import { Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function StickyFloatingCTA() {
  const [visible, setVisible] = useState(false);
  const heroRef = useRef<Element | null>(null);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    heroRef.current = hero;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "1.5rem",
        zIndex: 40,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(20px) scale(0.8)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition:
          "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        className="bounce-gentle flex items-center gap-2.5 px-5 py-3.5 rounded-full font-bold text-sm"
        style={{
          background: "oklch(0.88 0.18 168)",
          color: "#050A0A",
          boxShadow:
            "0 0 24px rgba(0,255,198,0.7), 0 0 48px rgba(0,255,198,0.3), 0 8px 32px rgba(0,0,0,0.5)",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        }}
        aria-label="Book Free Call"
      >
        <Phone size={15} />
        Book Free Call
      </button>
    </div>
  );
}
