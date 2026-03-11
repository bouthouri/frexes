import { m } from "motion/react";
import { usePrefersReducedMotion } from "../lib/motion";
import type { App } from "../data/apps";

export function AppCard({ app }: { app: App }) {
  const prefersReduced = usePrefersReducedMotion();

  const Tag = app.url ? "a" : "div";
  const linkProps = app.url
    ? { href: app.url, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <m.div
      whileHover={prefersReduced ? undefined : { y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="app-card rounded-2xl border border-border bg-background p-6 relative overflow-hidden"
      style={{ "--card-accent": app.accentColor } as React.CSSProperties}
    >
      <Tag {...linkProps} className="flex items-start gap-4">
        <img
          src={app.icon}
          alt={`${app.name} icon`}
          width={48}
          height={48}
          className="rounded-xl"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{app.name}</h3>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                app.status === "live"
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {app.status === "live" ? "Live" : "Coming Soon"}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{app.tagline}</p>
        </div>
      </Tag>
    </m.div>
  );
}
