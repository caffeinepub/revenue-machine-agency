import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";
import { useScrollReveal } from "../hooks/useScrollReveal";

/* ─── 3D Icon Meshes ─────────────────────────────────────────────── */

function RotatingTorus() {
  const meshRef = useRef<Mesh>(null);
  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.012;
    meshRef.current.rotation.y += 0.018;
  });
  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[0.55, 0.22, 16, 32]} />
      <meshStandardMaterial
        color="#00FFC6"
        emissive="#00FFC6"
        emissiveIntensity={0.4}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}

function RotatingIcosahedron() {
  const meshRef = useRef<Mesh>(null);
  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.015;
    meshRef.current.rotation.z += 0.008;
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial
        color="#00FFC6"
        emissive="#00FFC6"
        emissiveIntensity={0.4}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}

function RotatingBox() {
  const meshRef = useRef<Mesh>(null);
  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.014;
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.1, 0.75, 0.15]} />
      <meshStandardMaterial
        color="#00FFC6"
        emissive="#00FFC6"
        emissiveIntensity={0.4}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}

function ContactIcon3D({ shape }: { shape: "torus" | "icosahedron" | "box" }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.2], fov: 50 }}
      style={{ width: 80, height: 80, background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 2, 2]} intensity={1.5} color="#00FFC6" />
      <pointLight position={[-2, -1, 1]} intensity={0.4} color="#ffffff" />
      {shape === "torus" && <RotatingTorus />}
      {shape === "icosahedron" && <RotatingIcosahedron />}
      {shape === "box" && <RotatingBox />}
    </Canvas>
  );
}

/* ─── Contact cards data ─────────────────────────────────────────── */

const CONTACTS = [
  {
    id: "call",
    label: "Call Us",
    detail: "+91 9182768591",
    cta: "Call Now",
    href: "tel:+919182768591",
    shape: "torus" as const,
    ocidCard: "contact.call_card",
    ocidBtn: "contact.call_button",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    detail: "+91 9182768591",
    cta: "Chat on WhatsApp",
    href: "https://wa.me/919182768591?text=Hi%2C%20I%27m%20interested%20in%20your%20services.",
    shape: "icosahedron" as const,
    ocidCard: "contact.whatsapp_card",
    ocidBtn: "contact.whatsapp_button",
  },
  {
    id: "email",
    label: "Email Us",
    detail: "contact@quickbeeagency.com",
    cta: "Send Email",
    href: "mailto:contact@quickbeeagency.com",
    shape: "box" as const,
    ocidCard: "contact.email_card",
    ocidBtn: "contact.email_button",
  },
];

/* ─── ContactSection ─────────────────────────────────────────────── */

export default function ContactSection() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="contact-us"
      className="section-reveal relative py-24 px-4 sm:px-6 overflow-hidden"
    >
      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,255,198,0.06) 0%, rgba(0,255,198,0.02) 50%, transparent 75%)",
        }}
      />

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,198,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,198,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Top glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-md pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,255,198,0.5), transparent)",
        }}
      />

      <div className="container mx-auto max-w-5xl relative">
        {/* Section heading */}
        <div className="text-center mb-14">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "oklch(0.88 0.18 168)", letterSpacing: "0.2em" }}
          >
            Reach Out
          </p>
          <h2
            className="font-black mb-3"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "white",
              letterSpacing: "-0.03em",
            }}
          >
            Get In <span className="gradient-animate">Touch</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>
            We're one message away. Connect with us on your preferred channel.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CONTACTS.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Single contact card ────────────────────────────────────────── */

function ContactCard({
  contact,
}: {
  contact: (typeof CONTACTS)[number];
}) {
  return (
    <div
      data-ocid={contact.ocidCard}
      className="group flex flex-col items-center text-center rounded-2xl p-7 transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(0,255,198,0.15)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.border =
          "1px solid rgba(0,255,198,0.5)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 28px rgba(0,255,198,0.15), 0 4px 24px rgba(0,0,0,0.4)";
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.border =
          "1px solid rgba(0,255,198,0.15)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 24px rgba(0,0,0,0.3)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* 3D icon canvas */}
      <div
        className="mb-4 rounded-xl overflow-hidden"
        style={{
          width: 80,
          height: 80,
          background: "rgba(0,255,198,0.04)",
          border: "1px solid rgba(0,255,198,0.15)",
        }}
      >
        <Suspense fallback={<div style={{ width: 80, height: 80 }} />}>
          <ContactIcon3D shape={contact.shape} />
        </Suspense>
      </div>

      {/* Label */}
      <p
        className="text-xs font-bold tracking-widest uppercase mb-2"
        style={{ color: "oklch(0.88 0.18 168)", letterSpacing: "0.18em" }}
      >
        {contact.label}
      </p>

      {/* Contact detail */}
      <p
        className="font-semibold mb-5 break-all"
        style={{
          color: "rgba(255,255,255,0.85)",
          fontSize: "0.9rem",
          lineHeight: 1.4,
        }}
      >
        {contact.detail}
      </p>

      {/* CTA button */}
      <a
        href={contact.href}
        target={contact.id === "call" ? undefined : "_blank"}
        rel={contact.id === "call" ? undefined : "noopener noreferrer"}
        data-ocid={contact.ocidBtn}
        className="btn-teal btn-3d-lift w-full text-center py-3 px-5 rounded-xl text-sm font-bold tracking-wide"
        style={{ textDecoration: "none", display: "block" }}
      >
        {contact.cta}
      </a>
    </div>
  );
}
