"use client";
import { useState, useEffect } from "react";

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const CONTACTS = [
  {
    icon: "📧",
    label: "EMAIL",
    value: "parth55610@gmail.com",
    href: "mailto:parth55610@gmail.com",
    color: "#FF006E",
  },
  {
    icon: "📞",
    label: "PHONE",
    value: "+91 94299 13616",
    href: "tel:+919429913616",
    color: "#00F5FF",
  },
  {
    icon: "💼",
    label: "LINKEDIN",
    value: "parth-khatri-398216138",
    href: "https://www.linkedin.com/in/parth-khatri-398216138",
    color: "#0A66C2",
  },
  {
    icon: "🐙",
    label: "GITHUB",
    value: "Coming soon",
    href: "#",
    color: "rgba(255,255,255,0.3)",
  },
];

export default function IFruitPhone() {
  const time = useClock();

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-4 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #050508 0%, #080810 100%)" }}
    >
      {/* Neon grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,245,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
        {/* Header */}
        <div className="text-center" style={{ animation: "slideUp 0.6s ease-out 0.1s both" }}>
          <p className="font-inter text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "var(--gta-green)" }}>
            IFRUIT NETWORK
          </p>
          <h2
            className="font-bebas text-5xl sm:text-6xl tracking-wider text-white"
            style={{ textShadow: "0 0 18px rgba(29,185,84,0.4)" }}
          >
            iFRUIT
          </h2>
        </div>

        {/* Phone frame */}
        <div
          className="w-[260px] sm:w-[280px] rounded-[36px] overflow-hidden flex flex-col"
          style={{
            background: "#111118",
            border: "2px solid rgba(255,255,255,0.12)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.04), 0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(29,185,84,0.12)",
            animation: "slideUp 0.7s ease-out 0.25s both",
          }}
        >
          {/* Status bar */}
          <div
            className="flex items-center justify-between px-5 pt-4 pb-2"
            style={{ background: "#0d0d14" }}
          >
            <span className="font-inter text-white/60 text-[11px] font-semibold">{time}</span>
            <div className="flex items-center gap-1 opacity-50">
              <span className="text-white text-[10px]">●●●</span>
            </div>
          </div>

          {/* App header */}
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ background: "#0d0d14", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-lg">📱</span>
            <span className="font-bebas text-white tracking-widest text-base">CONTACTS</span>
          </div>

          {/* Contact list */}
          <div className="flex flex-col px-3 py-3 gap-1" style={{ background: "#111118" }}>
            {CONTACTS.map((c, i) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-all active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  textDecoration: "none",
                  animation: `slideUp 0.5s ease-out ${0.4 + i * 0.07}s both`,
                  opacity: c.href === "#" ? 0.45 : 1,
                  pointerEvents: c.href === "#" ? "none" : "auto",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: `${c.color}18`, border: `1px solid ${c.color}30` }}
                >
                  {c.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-inter text-white/35 text-[9px] uppercase tracking-widest">{c.label}</p>
                  <p
                    className="font-inter text-sm font-medium truncate mt-0.5"
                    style={{ color: c.href === "#" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.85)" }}
                  >
                    {c.value}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Home bar */}
          <div className="flex justify-center pb-3 pt-2" style={{ background: "#111118" }}>
            <div className="w-20 h-1 rounded-full bg-white/20" />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center" style={{ animation: "fadeIn 0.6s ease-out 0.8s both" }}>
          <p
            className="font-bebas text-3xl sm:text-4xl text-white tracking-wider"
            style={{ textShadow: "0 0 16px rgba(29,185,84,0.4)" }}
          >
            Let&apos;s build something.
          </p>
          <p className="font-inter text-white/25 text-xs mt-2 tracking-wider">
            📍 Ahmedabad, Gujarat, India
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-5 font-inter text-white/15 text-xs tracking-wider">
        © 2026 Parth Khatri
      </p>
    </div>
  );
}
