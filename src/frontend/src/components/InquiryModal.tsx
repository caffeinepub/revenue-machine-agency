import { CheckCircle2, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: string;
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(0,255,198,0.15)",
  transition: "border-color 0.2s ease",
};

const inputFocusStyle: React.CSSProperties = {
  borderColor: "rgba(0,255,198,0.5)",
  boxShadow: "0 0 0 2px rgba(0,255,198,0.1)",
};

const inputBlurStyle: React.CSSProperties = {
  borderColor: "rgba(0,255,198,0.15)",
  boxShadow: "none",
};

const labelClass =
  "block text-xs font-semibold mb-1.5 uppercase tracking-wider";
const labelStyle: React.CSSProperties = { color: "rgba(255,255,255,0.5)" };
const inputClass =
  "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none";

export default function InquiryModal({
  isOpen,
  onClose,
  planName,
  planPrice,
}: InquiryModalProps) {
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSubmitting(true);
    setError("");
    try {
      // Submit to backend with core fields; extra fields collected for UX
      await actor.submitInquiry(
        name,
        email,
        company || businessName || null,
        planName,
      );
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSuccess(false);
      setError("");
      setName("");
      setEmail("");
      setCompany("");
      setBusinessName("");
      setPhone("");
      setBudget("");
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <dialog
        open
        className="relative w-full max-w-md rounded-2xl slide-in-up"
        style={{
          background: "rgba(5,15,12,0.95)",
          border: "1px solid rgba(0,255,198,0.25)",
          boxShadow:
            "0 0 60px rgba(0,255,198,0.12), 0 32px 80px rgba(0,0,0,0.6)",
          margin: 0,
          backdropFilter: "blur(16px)",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
        }}
        aria-labelledby="modal-title"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-white/50 hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.05)" }}
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(0,255,198,0.1)",
                border: "2px solid rgba(0,255,198,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                boxShadow: "0 0 32px rgba(0,255,198,0.3)",
                animation: "pulse-glow 2s ease-in-out infinite",
              }}
            >
              <CheckCircle2
                size={36}
                style={{ color: "oklch(0.88 0.18 168)" }}
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-2" id="modal-title">
              Application Received
            </h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              We'll reach out within 24 hours. Expect a strategic conversation,
              not a sales pitch.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="btn-teal mt-6 px-6 py-3 rounded-xl text-sm font-bold w-full"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{
                  background: "rgba(0,255,198,0.08)",
                  border: "1px solid rgba(0,255,198,0.2)",
                  color: "oklch(0.88 0.18 168)",
                }}
              >
                {planName} — {planPrice}
              </div>
              <h3 className="text-xl font-bold text-white" id="modal-title">
                Apply for{" "}
                <span style={{ color: "oklch(0.88 0.18 168)" }}>
                  {planName}
                </span>
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Fill in your details and we'll be in touch within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name */}
              <div>
                <label
                  className={labelClass}
                  style={labelStyle}
                  htmlFor="modal-name"
                >
                  Full Name *
                </label>
                <input
                  id="modal-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) =>
                    Object.assign(e.target.style, inputFocusStyle)
                  }
                  onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
                />
              </div>

              {/* Business Name */}
              <div>
                <label
                  className={labelClass}
                  style={labelStyle}
                  htmlFor="modal-business"
                >
                  Business Name *
                </label>
                <input
                  id="modal-business"
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your business name"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) =>
                    Object.assign(e.target.style, inputFocusStyle)
                  }
                  onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  className={labelClass}
                  style={labelStyle}
                  htmlFor="modal-phone"
                >
                  Phone *
                </label>
                <input
                  id="modal-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) =>
                    Object.assign(e.target.style, inputFocusStyle)
                  }
                  onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
                />
              </div>

              {/* Business Email */}
              <div>
                <label
                  className={labelClass}
                  style={labelStyle}
                  htmlFor="modal-email"
                >
                  Business Email *
                </label>
                <input
                  id="modal-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) =>
                    Object.assign(e.target.style, inputFocusStyle)
                  }
                  onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
                />
              </div>

              {/* Company Name (optional) */}
              <div>
                <label
                  className={labelClass}
                  style={labelStyle}
                  htmlFor="modal-company"
                >
                  Company Name{" "}
                  <span
                    style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}
                  >
                    (Optional)
                  </span>
                </label>
                <input
                  id="modal-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Registered company name"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) =>
                    Object.assign(e.target.style, inputFocusStyle)
                  }
                  onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
                />
              </div>

              {/* Budget Range */}
              <div>
                <label
                  className={labelClass}
                  style={labelStyle}
                  htmlFor="modal-budget"
                >
                  Budget Range
                </label>
                <select
                  id="modal-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className={inputClass}
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                  }}
                  onFocus={(e) =>
                    Object.assign(e.target.style, inputFocusStyle)
                  }
                  onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
                >
                  <option value="" style={{ background: "#050A0A" }}>
                    Select Budget Range
                  </option>
                  <option value="under-10k" style={{ background: "#050A0A" }}>
                    Under ₹10,000
                  </option>
                  <option value="10k-25k" style={{ background: "#050A0A" }}>
                    ₹10,000 – ₹25,000
                  </option>
                  <option value="25k-50k" style={{ background: "#050A0A" }}>
                    ₹25,000 – ₹50,000
                  </option>
                  <option value="50k-100k" style={{ background: "#050A0A" }}>
                    ₹50,000 – ₹1,00,000
                  </option>
                  <option value="100k-plus" style={{ background: "#050A0A" }}>
                    ₹1,00,000+
                  </option>
                </select>
              </div>

              {/* Service Required (read-only) */}
              <div>
                <label
                  className={labelClass}
                  style={labelStyle}
                  htmlFor="modal-plan"
                >
                  Service Required
                </label>
                <div
                  id="modal-plan"
                  className="px-4 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: "rgba(0,255,198,0.06)",
                    border: "1px solid rgba(0,255,198,0.2)",
                    color: "oklch(0.88 0.18 168)",
                  }}
                >
                  {planName} — {planPrice} one-time
                </div>
              </div>

              {error && (
                <p
                  className="text-sm text-center"
                  style={{ color: "oklch(0.65 0.22 25)" }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-teal px-6 py-4 rounded-xl text-sm font-bold mt-2 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting
                  ? "Submitting Application..."
                  : "Submit Application"}
              </button>
            </form>
          </>
        )}
      </dialog>
    </div>
  );
}
