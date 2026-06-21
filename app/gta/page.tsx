"use client";
import { useState, useEffect, useCallback } from "react";
import { MARKERS } from "./markers";
import HudNavbar from "./components/HudNavbar";
import CityMap from "./components/CityMap";
import DetailPanel from "./components/DetailPanel";

function EntryAnimation({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          timeoutId = setTimeout(onComplete, 200);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: "var(--gta-bg)" }}
    >
      <p
        className="font-bebas text-2xl tracking-[0.3em] mb-6"
        style={{ color: "var(--gta-pink)", textShadow: "0 0 20px rgba(255,0,110,0.6)" }}
      >
        LOADING VICE CITY...
      </p>
      <div
        className="w-64 h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.1)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-75"
          style={{
            width: `${progress}%`,
            background: "var(--gta-pink)",
            boxShadow: "0 0 8px rgba(255,0,110,0.8)",
          }}
        />
      </div>
      <p className="font-inter text-white/25 text-xs tracking-widest mt-4 uppercase">
        {progress < 100 ? "Initializing..." : "Ready"}
      </p>
    </div>
  );
}

export default function GTAPage() {
  const [loaded, setLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string | null) => setSelectedId(id);
  const handleClose = () => setSelectedId(null);
  const handleAnimationComplete = useCallback(() => setLoaded(true), []);

  const selectedDistrict =
    selectedId ? (MARKERS.find((m) => m.id === selectedId)?.district ?? null) : null;

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--gta-bg)" }}
    >
      {!loaded && <EntryAnimation onComplete={handleAnimationComplete} />}
      {loaded && (
        <div
          className="relative w-full h-full"
          style={{ animation: "fadeIn 0.5s ease-out both" }}
        >
          <HudNavbar selectedDistrict={selectedDistrict} onRadarClick={handleClose} />
          <div className="absolute inset-0" style={{ top: "52px" }}>
            <CityMap selectedId={selectedId} onSelect={handleSelect} />
          </div>
          <DetailPanel selectedId={selectedId} onClose={handleClose} />
        </div>
      )}
    </div>
  );
}
