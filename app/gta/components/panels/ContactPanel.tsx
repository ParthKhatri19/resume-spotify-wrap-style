"use client";
import { useState, useEffect } from "react";

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const CONTACTS = [
  { icon: "📧", label: "EMAIL",    value: "parth55610@gmail.com",                         href: "mailto:parth55610@gmail.com",                       color: "#1DB954", disabled: false },
  { icon: "📞", label: "PHONE",    value: "+91 94299 13616",                              href: "tel:+919429913616",                                 color: "#00F5FF", disabled: false },
  { icon: "💼", label: "LINKEDIN", value: "parth-khatri-398216138",                       href: "https://www.linkedin.com/in/parth-khatri-398216138", color: "#0A66C2", disabled: false },
  { icon: "🐙", label: "GITHUB",   value: "ParthKhatri19",                               href: "https://github.com/ParthKhatri19",                  color: "#e6edf3", disabled: false },
];

export default function ContactPanel() {
  const time = useClock();

  return (
    <div className="flex flex-col gap-5">
      {/* Clock */}
      <div
        className="text-center"
        style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }}
      >
        <p
          className="font-bebas text-5xl tracking-widest"
          style={{ color: "var(--gta-green)", textShadow: "0 0 20px rgba(29,185,84,0.4)" }}
        >
          {time || "--:--"}
        </p>
        <p className="font-inter text-white/30 text-[10px] tracking-[0.3em] uppercase mt-1">
          LOCAL TIME
        </p>
      </div>

      {/* Contact rows */}
      <div className="flex flex-col gap-2">
        {CONTACTS.map((c, i) => (
          <a
            key={c.label}
            href={c.disabled ? undefined : c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
            style={{
              background: `${c.color}08`,
              border: `1px solid ${c.color}25`,
              opacity: c.disabled ? 0.4 : 1,
              pointerEvents: c.disabled ? "none" : "auto",
              cursor: c.disabled ? "default" : "pointer",
              animation: `slideUp 0.4s ease-out ${0.2 + i * 0.07}s both`,
            }}
          >
            <span className="text-lg flex-shrink-0">{c.icon}</span>
            <div className="flex-1 min-w-0">
              <p
                className="font-bebas text-[10px] tracking-[0.2em] mb-0.5"
                style={{ color: c.color }}
              >
                {c.label}
              </p>
              <p className="font-inter text-white/70 text-xs truncate">{c.value}</p>
            </div>
          </a>
        ))}
      </div>

      {/* CTA */}
      <p
        className="font-bebas text-xl tracking-wider text-center mt-2"
        style={{
          color: "var(--gta-green)",
          textShadow: "0 0 16px rgba(29,185,84,0.3)",
          animation: "slideUp 0.5s ease-out 0.55s both",
        }}
      >
        {"Let's build something."}
      </p>
      <p
        className="font-inter text-white/20 text-[10px] text-center tracking-widest"
        style={{ animation: "fadeIn 0.5s ease-out 0.65s both" }}
      >
        © 2026 Parth Khatri
      </p>
    </div>
  );
}
