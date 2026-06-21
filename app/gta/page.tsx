"use client";
import { useState, useEffect } from "react";
import { SECTIONS } from "./constants";
import HudNavbar from "./components/HudNavbar";
import DistrictMap from "./components/DistrictMap";
import LoadingScreen from "./components/LoadingScreen";
import MissionLog from "./components/MissionLog";
import Attributes from "./components/Attributes";
import HeistBoard from "./components/HeistBoard";
import SafeHouse from "./components/SafeHouse";
import IFruitPhone from "./components/IFruitPhone";

export default function GTAPage() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [mapOpen, setMapOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-52px 0px 0px 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "m" || e.key === "M") setMapOpen((v) => !v);
      if (e.key === "Escape") setMapOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const navigateTo = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setMapOpen(false);
  };

  return (
    <div className="relative" style={{ background: "var(--gta-bg)", fontFamily: "var(--font-inter)" }}>
      <HudNavbar
        activeSection={activeSection}
        sections={SECTIONS}
        onMapOpen={() => setMapOpen(true)}
      />
      <DistrictMap
        isOpen={mapOpen}
        activeSection={activeSection}
        sections={SECTIONS}
        onClose={() => setMapOpen(false)}
        onNavigate={navigateTo}
      />
      <section id="hero">
        <LoadingScreen />
      </section>
      <section id="mission-log">
        <MissionLog />
      </section>
      <section id="attributes">
        <Attributes />
      </section>
      <section id="heist-board">
        <HeistBoard />
      </section>
      <section id="safe-house">
        <SafeHouse />
      </section>
      <section id="ifruit-phone">
        <IFruitPhone />
      </section>
    </div>
  );
}
