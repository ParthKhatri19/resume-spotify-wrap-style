"use client";
import { MARKERS } from "../markers";
import AboutPanel      from "./panels/AboutPanel";
import ExperiencePanel from "./panels/ExperiencePanel";
import SkillsPanel     from "./panels/SkillsPanel";
import ProjectsPanel   from "./panels/ProjectsPanel";
import EducationPanel  from "./panels/EducationPanel";
import ContactPanel    from "./panels/ContactPanel";

const PANEL_TITLES: Record<string, string> = {
  about:      "ABOUT",
  experience: "MISSION LOG",
  skills:     "ATTRIBUTES",
  projects:   "ACTIVE HEISTS",
  education:  "PROPERTIES",
  contact:    "IFRUIT NETWORK",
};

const PANEL_COMPONENTS = {
  about:      AboutPanel,
  experience: ExperiencePanel,
  skills:     SkillsPanel,
  projects:   ProjectsPanel,
  education:  EducationPanel,
  contact:    ContactPanel,
};

export default function DetailPanel({
  selectedId,
  onClose,
}: {
  selectedId: string | null;
  onClose: () => void;
}) {
  const marker = selectedId ? MARKERS.find((m) => m.id === selectedId) : null;
  const isOpen = !!selectedId && !!marker;
  const PanelContent = selectedId
    ? PANEL_COMPONENTS[selectedId as keyof typeof PANEL_COMPONENTS] ?? null
    : null;

  return (
    <>
      {/* Desktop: right sidebar */}
      <div
        className="fixed top-0 right-0 bottom-0 hidden sm:flex flex-col z-40"
        style={{
          width: "380px",
          paddingTop: "52px",
          background: "rgba(8,8,20,0.97)",
          backdropFilter: "blur(20px)",
          borderLeft: isOpen ? `2px solid ${marker?.color}` : "2px solid transparent",
          boxShadow: isOpen ? `inset 0 0 20px ${marker?.color}18` : "none",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.3s, box-shadow 0.3s",
        }}
      >
        {marker && (
          <>
            {/* Panel header */}
            <div
              className="flex items-start justify-between px-5 pt-5 pb-4 flex-shrink-0"
              style={{ borderBottom: `1px solid ${marker.color}22` }}
            >
              <div>
                <p
                  className="font-bebas text-xs tracking-[0.25em] uppercase mb-1"
                  style={{ color: marker.color }}
                >
                  ◉ {marker.district}
                </p>
                <p className="font-bebas text-2xl tracking-wider text-white">
                  {PANEL_TITLES[selectedId!]}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white text-xl leading-none transition-colors mt-1 font-inter"
                aria-label="Close panel"
              >
                ✕
              </button>
            </div>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: "thin", scrollbarColor: `${marker.color}44 transparent` }}>
              {PanelContent && <PanelContent />}
            </div>
          </>
        )}
      </div>

      {/* Mobile: bottom sheet */}
      <div
        className="fixed left-0 right-0 bottom-0 flex sm:hidden flex-col z-40"
        style={{
          height: "65vh",
          background: "rgba(8,8,20,0.97)",
          backdropFilter: "blur(20px)",
          borderTop: isOpen ? `2px solid ${marker?.color}` : "2px solid transparent",
          boxShadow: isOpen ? `0 -8px 30px ${marker?.color}18` : "none",
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.3s",
          borderRadius: "16px 16px 0 0",
        }}
      >
        {marker && (
          <>
            {/* Panel header */}
            <div
              className="flex items-start justify-between px-5 pt-4 pb-3 flex-shrink-0"
              style={{ borderBottom: `1px solid ${marker.color}22` }}
            >
              <div>
                <p
                  className="font-bebas text-xs tracking-[0.25em] uppercase mb-1"
                  style={{ color: marker.color }}
                >
                  ◉ {marker.district}
                </p>
                <p className="font-bebas text-xl tracking-wider text-white">
                  {PANEL_TITLES[selectedId!]}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white text-xl leading-none transition-colors mt-1 font-inter"
                aria-label="Close panel"
              >
                ✕
              </button>
            </div>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: "thin", scrollbarColor: `${marker.color}44 transparent` }}>
              {PanelContent && <PanelContent />}
            </div>
          </>
        )}
      </div>
    </>
  );
}
