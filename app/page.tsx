"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const SLIDES = [
  "intro",
  "experience",
  "languages",
  "projects",
  "certifications",
  "arsenal",
  "contact",
] as const;

type Slide = (typeof SLIDES)[number];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [animKey, setAnimKey] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= SLIDES.length) return;
    setVisible(false);
    setTimeout(() => {
      setCurrent(index);
      setAnimKey((k) => k + 1);
      setVisible(true);
    }, 350);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const handleClick = (e: React.MouseEvent) => {
    const x = e.clientX;
    const width = window.innerWidth;
    if (x > width * 0.25) next();
    else prev();
  };

  const slide = SLIDES[current];

  return (
    <div
      className="relative w-full h-screen overflow-hidden cursor-pointer select-none"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-3">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= current ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      {current > 0 && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white/40 text-2xl pointer-events-none hidden md:block">
          ‹
        </div>
      )}
      {current < SLIDES.length - 1 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white/40 text-2xl pointer-events-none hidden md:block">
          ›
        </div>
      )}

      <div
        className="w-full h-full"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.97)",
          transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
        }}
      >
        {slide === "intro" && <IntroSlide key={animKey} />}
        {slide === "experience" && <ExperienceSlide key={animKey} />}
        {slide === "languages" && <LanguagesSlide key={animKey} />}
        {slide === "projects" && <ProjectsSlide key={animKey} />}
        {slide === "certifications" && <CertificationsSlide key={animKey} />}
        {slide === "arsenal" && <TechArsenalSlide key={animKey} />}
        {slide === "contact" && <ContactSlide key={animKey} />}
      </div>

      {current === 0 && (
        <div
          className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 z-50"
          style={{ animation: "fadeIn 1s ease-out 2s both" }}
        >
          <p className="text-white/60 text-sm tracking-widest uppercase">Tap to continue</p>
          <div className="w-px h-6 bg-white/30" />
        </div>
      )}
    </div>
  );
}

/* ─── SLIDE 1: INTRO ─────────────────────────────────────────── */
function IntroSlide() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden">
      <div
        className="blob-1 absolute w-96 h-96 rounded-full opacity-60 -top-20 -left-20"
        style={{ background: "radial-gradient(circle, #1DB954 0%, transparent 70%)" }}
      />
      <div
        className="blob-2 absolute w-80 h-80 rounded-full opacity-40 -bottom-20 -right-10"
        style={{ background: "radial-gradient(circle, #9333ea 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
        <div
          className="bg-[#1DB954] text-black text-xs font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full"
          style={{ animation: "scaleIn 0.5s ease-out 0.1s both" }}
        >
          Dev Wrapped
        </div>

        <div style={{ animation: "slideUp 0.6s ease-out 0.3s both" }}>
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black text-white leading-none tracking-tight">
            Parth
          </h1>
          <h1
            className="text-6xl sm:text-7xl md:text-9xl font-black leading-none tracking-tight"
            style={{ color: "#1DB954" }}
          >
            Khatri
          </h1>
        </div>

        <div style={{ animation: "slideUp 0.6s ease-out 0.5s both" }}>
          <p className="text-white/70 text-lg sm:text-xl md:text-2xl font-light tracking-wider">
            Sr. Software Engineer
          </p>
        </div>

        <div style={{ animation: "fadeIn 0.8s ease-out 0.8s both" }}>
          <p className="text-white/40 text-sm md:text-base max-w-xs sm:max-w-sm leading-relaxed">
            4+ years of building production software.<br />Here&apos;s how the story goes.
          </p>
        </div>
      </div>

      <div className="absolute bottom-16 flex gap-2 z-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#1DB954]"
            style={{ animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── SLIDE 2: EXPERIENCE ────────────────────────────────────── */
function ExperienceSlide() {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-5 sm:gap-8">
        <p
          className="text-white/60 text-sm font-semibold tracking-[0.3em] uppercase"
          style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }}
        >
          Your Journey
        </p>

        <div style={{ animation: "scaleIn 0.6s ease-out 0.2s both" }}>
          <span className="text-[80px] sm:text-[120px] md:text-[180px] font-black text-white leading-none">4+</span>
        </div>

        <div style={{ animation: "slideUp 0.6s ease-out 0.4s both" }} className="space-y-2">
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Years of shipping<br />
            <span className="text-yellow-300">real products</span>
          </p>
        </div>

        <div style={{ animation: "slideUp 0.6s ease-out 0.6s both" }} className="flex flex-col items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl px-6 sm:px-8 py-4 sm:py-5 text-center">
            <p className="text-white font-bold text-base sm:text-lg">Sr. Software Engineer</p>
            <p className="text-white/70 text-sm mt-1">Ahmedabad, Gujarat</p>
            <p className="text-yellow-300 text-sm font-semibold mt-1">Jan 2022 → Present</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SLIDE 3: LANGUAGES ─────────────────────────────────────── */
const languages = [
  { name: "C#", pct: 92, color: "#9B59B6" },
  { name: "Python", pct: 78, color: "#3498DB" },
  { name: "JavaScript", pct: 85, color: "#F1C40F" },
  { name: "TypeScript", pct: 80, color: "#2980B9" },
  { name: "SQL", pct: 88, color: "#E74C3C" },
  { name: "HTML & CSS", pct: 75, color: "#E67E22" },
];

const aiTools = ["Devin", "Cursor", "Claude Code"];

function LanguagesSlide() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 100%)" }}
    >
      <div
        className="blob-1 absolute w-72 h-72 rounded-full opacity-30 top-0 right-0"
        style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-md px-5 sm:px-8 flex flex-col gap-4">
        <div style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }} className="text-center">
          <p className="text-indigo-400 text-xs font-bold tracking-[0.3em] uppercase mb-1">Your Top Languages</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">You coded in</h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-indigo-400">6 languages</h2>
        </div>

        <div className="flex flex-col gap-2.5">
          {languages.map((lang, i) => (
            <div
              key={lang.name}
              className="flex items-center gap-3"
              style={{ animation: `slideUp 0.5s ease-out ${0.2 + i * 0.1}s both` }}
            >
              <span className="text-white font-bold text-sm w-20 sm:w-24 shrink-0">{lang.name}</span>
              <div className="flex-1 bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    backgroundColor: lang.color,
                    width: started ? `${lang.pct}%` : "0%",
                    transitionDelay: `${0.3 + i * 0.1}s`,
                  }}
                />
              </div>
              <span className="text-white/50 text-xs w-8 text-right">{lang.pct}%</span>
            </div>
          ))}
        </div>

        <div style={{ animation: "fadeIn 0.5s ease-out 0.9s both" }} className="text-center space-y-2">
          <p className="text-white/40 text-xs">+ JQuery, Angular, ASP.NET Core, MSSQL</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-indigo-300 text-xs font-semibold tracking-wider uppercase">AI Tools</span>
            {aiTools.map((tool) => (
              <span
                key={tool}
                className="text-xs px-2.5 py-1 rounded-full font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SLIDE 4: PROJECTS ──────────────────────────────────────── */
const projects = [
  {
    name: "Booking & Chat Platform",
    tools: "ASP.NET • Twilio • MSSQL",
    tag: "Real-time chat + Auth",
    color: "#f97316",
    icon: "💬",
  },
  {
    name: "Sales & Route Management",
    tools: "Google Maps API • ASP.NET",
    tag: "Geo optimization",
    color: "#22c55e",
    icon: "🗺️",
  },
  {
    name: "Secure Supply Portal",
    tools: "Angular • API encryption",
    tag: "Security + SEO",
    color: "#3b82f6",
    icon: "🔐",
  },
];

function ProjectsSlide() {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #111827 0%, #1f2937 100%)" }}
    >
      <div
        className="blob-2 absolute w-96 h-96 rounded-full opacity-20 -bottom-20 -left-20"
        style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-md px-5 sm:px-6 flex flex-col gap-5">
        <div style={{ animation: "slideUp 0.5s ease-out 0.1s both" }} className="text-center">
          <p className="text-orange-400 text-xs font-bold tracking-[0.3em] uppercase mb-2">Projects Shipped</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
            3 products.<br />
            <span className="text-orange-400">Real impact.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {projects.map((p, i) => (
            <div
              key={p.name}
              className="project-card bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3"
              style={{ animation: `slideUp 0.5s ease-out ${0.2 + i * 0.15}s both` }}
            >
              <div className="text-2xl sm:text-3xl shrink-0">{p.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-tight">{p.name}</p>
                <p className="text-white/40 text-xs mt-0.5 truncate">{p.tools}</p>
              </div>
              <span
                className="text-xs font-semibold px-2 py-1 rounded-full shrink-0 whitespace-nowrap"
                style={{ backgroundColor: `${p.color}20`, color: p.color, border: `1px solid ${p.color}40` }}
              >
                {p.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SLIDE 5: CERTIFICATIONS ────────────────────────────────── */
const certs = [
  { name: "DevOps Engineer Expert (AZ-400)", year: "2024", highlight: true, icon: "🚀" },
  { name: "Azure Developer Associate", year: "2024", highlight: true, icon: "⚡" },
  { name: "Azure Fundamentals", year: "2024", highlight: true, icon: "☁️" },
  { name: "Python for Everybody", year: "2021", highlight: false, icon: "🐍" },
  { name: "Python Data Structure", year: "2020", highlight: false, icon: "📊" },
  { name: "Data Science in Python", year: "2020", highlight: false, icon: "🔬" },
];

function CertificationsSlide() {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0c4a6e 0%, #075985 50%, #0369a1 100%)" }}
    >
      <div
        className="blob-1 absolute w-80 h-80 rounded-full opacity-30 -top-10 right-0"
        style={{ background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-md px-5 sm:px-6 flex flex-col gap-4">
        <div style={{ animation: "slideUp 0.5s ease-out 0.1s both" }} className="text-center">
          <p className="text-sky-300 text-xs font-bold tracking-[0.3em] uppercase mb-2">Certifications</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Azure certified.<br />
            <span className="text-sky-300">Three times.</span>
          </h2>
          <p className="text-white/50 text-sm mt-1">6 certifications total</p>
        </div>

        <div className="flex flex-col gap-2">
          {certs.map((c, i) => (
            <div
              key={c.name}
              className={`flex items-center gap-3 rounded-xl p-2.5 sm:p-3 ${
                c.highlight
                  ? "bg-sky-400/20 border border-sky-400/40"
                  : "bg-white/5 border border-white/10"
              }`}
              style={{ animation: `slideUp 0.5s ease-out ${0.2 + i * 0.1}s both` }}
            >
              <span className="text-lg sm:text-xl">{c.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs sm:text-sm font-semibold leading-snug ${c.highlight ? "text-white" : "text-white/70"}`}>
                  {c.name}
                </p>
              </div>
              <span className={`text-xs font-bold shrink-0 ${c.highlight ? "text-sky-300" : "text-white/30"}`}>
                {c.year}
              </span>
              {c.highlight && <div className="w-2 h-2 rounded-full bg-sky-400 ping-slow shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SLIDE 6: TECH ARSENAL ──────────────────────────────────── */
const arsenal = [
  {
    category: "Backend",
    color: "#f97316",
    bg: "#f9731615",
    border: "#f9731630",
    skills: ["ASP.NET Core", "REST API", "JWT Auth", "ITextSharp", "ASP.NET MVC"],
  },
  {
    category: "Frontend",
    color: "#a855f7",
    bg: "#a855f715",
    border: "#a855f730",
    skills: ["Angular", "TypeScript", "Kendo Grid", "HTML & CSS", "SEO"],
  },
  {
    category: "Database",
    color: "#22c55e",
    bg: "#22c55e15",
    border: "#22c55e30",
    skills: ["MS SQL Server", "DB Triggers", "Stored Procs", "Symmetric Keys", "Query Optimization"],
  },
  {
    category: "Security",
    color: "#ef4444",
    bg: "#ef444415",
    border: "#ef444430",
    skills: ["API Encryption", "Role-based Access", "Certificate Auth", "Secure DB Fields"],
  },
  {
    category: "Integrations",
    color: "#38bdf8",
    bg: "#38bdf815",
    border: "#38bdf830",
    skills: ["Twilio", "Google Maps API", "Excel Import", "Fishbowl Inventory"],
  },
  {
    category: "Cloud & AI",
    color: "#1DB954",
    bg: "#1DB95415",
    border: "#1DB95430",
    skills: ["Azure", "Devin", "Cursor", "Claude Code"],
  },
];

function TechArsenalSlide() {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #09090b 0%, #18181b 100%)" }}
    >
      <div
        className="blob-1 absolute w-80 h-80 rounded-full opacity-20 -top-20 -right-20"
        style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }}
      />
      <div
        className="blob-2 absolute w-72 h-72 rounded-full opacity-15 -bottom-20 -left-10"
        style={{ background: "radial-gradient(circle, #22c55e 0%, transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-lg px-4 sm:px-5 flex flex-col gap-3">
        <div style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }} className="text-center">
          <p className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase mb-1">Built with</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
            Tech <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #a855f7, #38bdf8)" }}>Arsenal</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {arsenal.map((group, i) => (
            <div
              key={group.category}
              className="rounded-xl p-2.5 sm:p-3 flex flex-col gap-1.5"
              style={{
                background: group.bg,
                border: `1px solid ${group.border}`,
                animation: `slideUp 0.5s ease-out ${0.15 + i * 0.08}s both`,
              }}
            >
              <p className="text-xs font-black tracking-wider uppercase" style={{ color: group.color }}>
                {group.category}
              </p>
              <div className="flex flex-wrap gap-1">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-white/80 text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SLIDE 7: CONTACT ───────────────────────────────────────── */
function ContactSlide() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-black">
      <div
        className="blob-1 absolute w-[500px] h-[500px] rounded-full opacity-50 -top-40 -left-40"
        style={{ background: "radial-gradient(circle, #1DB954 0%, transparent 60%)" }}
      />
      <div
        className="blob-2 absolute w-96 h-96 rounded-full opacity-30 -bottom-20 -right-20"
        style={{ background: "radial-gradient(circle, #9333ea 0%, transparent 60%)" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6">
        <div style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }}>
          <p className="text-[#1DB954] text-xs font-bold tracking-[0.3em] uppercase">That&apos;s a wrap</p>
        </div>

        <div style={{ animation: "slideUp 0.6s ease-out 0.2s both" }}>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight">
            Let&apos;s build<br />
            <span style={{ color: "#1DB954" }}>something.</span>
          </h2>
        </div>

        <div style={{ animation: "slideUp 0.6s ease-out 0.4s both" }} className="flex flex-col gap-3 w-full max-w-xs sm:max-w-sm">
          <a
            href="mailto:parth55610@gmail.com"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 sm:px-6 py-4 text-left hover:bg-white/10 transition-colors"
          >
            <span className="text-2xl">📧</span>
            <div className="min-w-0">
              <p className="text-white/40 text-xs uppercase tracking-wider">Email</p>
              <p className="text-white font-semibold text-sm truncate">parth55610@gmail.com</p>
            </div>
          </a>

          <a
            href="tel:+919429913616"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 sm:px-6 py-4 text-left hover:bg-white/10 transition-colors"
          >
            <span className="text-2xl">📱</span>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider">Phone</p>
              <p className="text-white font-semibold text-sm">+91 94299 13616</p>
            </div>
          </a>
        </div>

        <div style={{ animation: "fadeIn 0.5s ease-out 0.7s both" }}>
          <div className="flex items-center gap-3 text-white/30 text-xs">
            <div className="w-8 h-px bg-white/20" />
            <span>Ahmedabad, Gujarat, India</span>
            <div className="w-8 h-px bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
