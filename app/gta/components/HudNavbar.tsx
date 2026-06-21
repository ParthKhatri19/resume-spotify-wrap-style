"use client";
export default function HudNavbar(_props: {
  activeSection: string;
  sections: readonly { id: string; area: string }[];
  onMapOpen: () => void;
}) {
  return <div className="fixed top-0 left-0 right-0 h-[52px] z-50 bg-black/80 border-b border-pink-600/40" />;
}
