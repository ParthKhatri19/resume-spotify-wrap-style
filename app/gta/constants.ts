export const SECTIONS = [
  { id: "hero",         area: "VICE CITY LOADING..." },
  { id: "mission-log",  area: "MISSION DISTRICT" },
  { id: "attributes",   area: "SKILLS ZONE" },
  { id: "heist-board",  area: "HEIST QUARTER" },
  { id: "safe-house",   area: "VICE ACADEMY" },
  { id: "ifruit-phone", area: "IFRUIT NETWORK" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
