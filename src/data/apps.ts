export type AppStatus = "live" | "coming-soon";

export interface App {
  id: string;
  name: string;
  tagline: string;
  description: string;
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
    description:
      "Plan your day around your energy, not just your calendar. Track tasks with energy costs, earn XP for completing them, and learn when you're most productive.",
    status: "live",
    url: "https://energyxp.app",
    icon: "/icons/energy-xp.svg",
    accentColor: "#6366f1",
  },
  {
    id: "progres",
    name: "Progres",
    tagline: "Goal tracking your way",
    description:
      "Track goals as paths, lists, or numbers. Whether it's a reading list, a savings target, or a multi-step project — Progres adapts to how you think about progress.",
    status: "live",
    url: "https://progres.ing",
    icon: "/icons/progres.svg",
    accentColor: "#22c55e",
  },
  {
    id: "voila",
    name: "Voila",
    tagline: "Behavior tracking & AI analysis",
    description:
      "Log daily behaviors and let AI surface the patterns you can't see. Understand what drives your best days and what's holding you back.",
    status: "live",
    url: "https://voila.app",
    icon: "/icons/voila.svg",
    accentColor: "#f59e0b",
  },
  {
    id: "karv",
    name: "Karv",
    tagline: "Habit tracking, simplified",
    description:
      "No streaks, no guilt. Build habits with a calm, minimal tracker that focuses on consistency over perfection.",
    status: "live",
    url: "https://karv.ing",
    icon: "/icons/karv.svg",
    accentColor: "#ec4899",
  },
];
