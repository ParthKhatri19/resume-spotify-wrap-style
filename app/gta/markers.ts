export const MARKERS = [
  { id: "about",      district: "VICE CITY BEACH",  color: "#FF006E", cx: 680, cy: 420 },
  { id: "experience", district: "MISSION DISTRICT", color: "#FF6B35", cx: 320, cy: 280 },
  { id: "skills",     district: "SKILLS ZONE",      color: "#00F5FF", cx: 180, cy: 160 },
  { id: "projects",   district: "HEIST QUARTER",    color: "#7B2FBE", cx: 140, cy: 340 },
  { id: "education",  district: "VICE ACADEMY",     color: "#FFD700", cx: 440, cy: 130 },
  { id: "contact",    district: "IFRUIT NETWORK",   color: "#1DB954", cx: 580, cy: 210 },
] as const;

export type MarkerId = (typeof MARKERS)[number]["id"];
