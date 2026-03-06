import { Gift, X } from "lucide-react";
import { useEffect, useState } from "react";

const SESSION_KEY = "exit_popup_shown";

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let triggered = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (triggered) return;
      if (e.clientY < window.innerHeight * 0.1) {
        triggered = true;
        setVisible(true);
        sessionStorage.setItem(SESSION_KEY, "1");
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <dialog
        open
        className="relative w-full max-w-md rounded-2xl p-8 slide-in-up"
        style={{
          background: "rgba(5,15,12,0.97)",
          border: "1px solid rgba(0,255,198,0.25)",
          boxShadow:
            "0 0 60px rgba(0,255,198,0.12), 0 32px 80px rgba(0,0,0,0.7)",
          margin: 0,
        }}
        aria-labelledby="exit-popup-title"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors"
          style={{
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.5)",
          }}
          aria-label="Close popup"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
          }}
        >
          <X size={16} />
        </button>

        {!submitted ? (
          <>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{
                background: "rgba(0,255,198,0.1)",
                border: "1px solid rgba(0,255,198,0.25)",
              }}
            >
              <Gift size={26} style={{ color: "oklch(0.88 0.18 168)" }} />
            </div>

            <h3
              className="text-xl font-black text-white mb-2"
              id="exit-popup-title"
              style={{ letterSpacing: "-0.02em" }}
            >
              Wait — Before You Leave
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}
            >
              Get our free{" "}
              <strong style={{ color: "oklch(0.88 0.18 168)" }}>
                Revenue Audit Checklist
              </strong>{" "}
              — a strategic framework used by scaling businesses to identify
              growth leaks and opportunities.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@businessemail.com"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(0,255,198,0.2)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(0,255,198,0.5)";
                  e.target.style.boxShadow = "0 0 0 2px rgba(0,255,198,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(0,255,198,0.2)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                className="btn-teal py-3.5 rounded-xl text-sm font-bold"
              >
                Send Me the Checklist
              </button>
            </form>

            <button
              type="button"
              onClick={handleClose}
              className="mt-4 w-full text-xs text-center transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.3)";
              }}
            >
              No thanks, I'll pass on free value
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: "rgba(0,255,198,0.1)",
                border: "1px solid rgba(0,255,198,0.3)",
              }}
            >
              <span style={{ fontSize: "2rem" }}>✓</span>
            </div>
            <h3
              className="text-xl font-black text-white mb-2"
              id="exit-popup-title"
            >
              Sent!
            </h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              Check your inbox. The checklist is on its way.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="btn-teal mt-6 px-8 py-3 rounded-xl text-sm font-bold"
            >
              Continue
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
