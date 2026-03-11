export type AppStatus = "live" | "coming-soon";

export interface App {
  id: string;
  name: string;
  tagline: string;
  status: AppStatus;
  url: string | null;
  icon: string;
  accentColor: string;
}

export const apps: App[] = [
  {
    id: "energy-xp",
    name: "Energy XP",
    tagline: "Task & energy management",
    status: "live",
    url: "https://energyxp.app",
    icon: "/icons/energy-xp.svg",
    accentColor: "#6366f1",
  },
  {
    id: "progres",
    name: "Progres",
    tagline: "Goal tracking your way",
    status: "live",
    url: "https://progres.ing",
    icon: "/icons/progres.svg",
    accentColor: "#22c55e",
  },
  {
    id: "voila",
    name: "Voila",
    tagline: "Behavior tracking & AI analysis",
    status: "coming-soon",
    url: null,
    icon: "/icons/voila.svg",
    accentColor: "#f59e0b",
  },
  {
    id: "karv",
    name: "Karv",
    tagline: "Habit tracking, simplified",
    status: "coming-soon",
    url: null,
    icon: "/icons/karv.svg",
    accentColor: "#ec4899",
  },
];
