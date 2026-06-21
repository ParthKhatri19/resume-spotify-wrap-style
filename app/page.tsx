"use client";
import { useRouter } from "next/navigation";

export default function StyleSelector() {
  const router = useRouter();

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col sm:flex-row">
      {/* ── Wrapped Half ── */}
      <button
        className="relative flex-1 flex flex-col items-center justify-center cursor-pointer group border-0 p-0"
        style={{ background: "#040d06" }}
        onClick={() => router.push("/wrapped")}
        aria-label="Open Spotify Wrapped style resume"
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-500"
          style={{ background: "radial-gradient(circle at 50% 55%, #1DB954, transparent 65%)" }}
        />
        {/* Hover scale layer */}
        <div className="absolute inset-0 scale-100 group-hover:scale-[1.02] transition-transform duration-400" />

        <div className="relative z-10 flex flex-col items-center gap-5 text-center px-8">
          <span className="bg-[#1DB954] text-black text-xs font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full">
            DEV WRAPPED
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Spotify Style
          </h2>
          <p className="text-white/40 text-sm tracking-wider">The story so far.</p>
          <span className="mt-2 text-white/25 text-xs tracking-widest uppercase">
            Click to enter →
          </span>
        </div>
      </button>

      {/* ── Divider ── */}
      <div className="hidden sm:flex items-center justify-center absolute left-1/2 top-0 bottom-0 w-px bg-white/10 z-20">
        <span className="absolute text-white/25 text-sm bg-black px-1">◆</span>
      </div>
      <div className="h-px bg-white/10 w-full sm:hidden flex-none" />

      {/* ── GTA Half ── */}
      <button
        className="relative flex-1 flex flex-col items-center justify-center cursor-pointer group border-0 p-0"
        style={{ background: "#0a0412" }}
        onClick={() => router.push("/gta")}
        aria-label="Open GTA VI style resume"
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-500"
          style={{ background: "radial-gradient(circle at 50% 55%, #FF006E, transparent 65%)" }}
        />

        <div className="relative z-10 flex flex-col items-center gap-5 text-center px-8">
          <span
            className="font-bebas text-xs tracking-[0.3em] uppercase px-4 py-2 rounded-full"
            style={{
              background: "rgba(255,0,110,0.15)",
              border: "1px solid rgba(255,0,110,0.45)",
              color: "var(--gta-pink)",
              letterSpacing: "0.3em",
            }}
          >
            GTA VI STYLE
          </span>
          <h2
            className="font-bebas text-4xl sm:text-5xl tracking-wider text-white leading-tight"
            style={{ textShadow: "0 0 30px rgba(255,0,110,0.4)" }}
          >
            VICE CITY STYLE
          </h2>
          <p className="font-inter text-white/40 text-sm tracking-wider">
            Welcome to Vice City.
          </p>
          <span className="mt-2 text-white/25 text-xs tracking-widest uppercase font-inter">
            Click to enter →
          </span>
        </div>
      </button>
    </div>
  );
}
