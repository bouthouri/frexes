import { useRef, useState, useCallback } from "react";
import { m } from "motion/react";
import { usePrefersReducedMotion } from "../lib/motion";
import type { App } from "../data/apps";

export function AppCard({ app }: { app: App }) {
  const prefersReduced = usePrefersReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const isComingSoon = app.status === "coming-soon";

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const Tag = app.url ? "a" : "div";
  const linkProps = app.url
    ? { href: app.url, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <m.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={prefersReduced || isComingSoon ? undefined : { y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative rounded-2xl border border-foreground/[0.08] bg-background overflow-hidden group ${
        isComingSoon ? "cursor-default" : "cursor-pointer"
      }`}
    >
      {/* Spotlight border glow on hover */}
      {!isComingSoon && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: isHovered
              ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.4), transparent 40%)`
              : undefined,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "1px",
          }}
        />
      )}
      {/* Spotlight fill glow on hover */}
      {!isComingSoon && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: isHovered
              ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.06), transparent 40%)`
              : undefined,
          }}
        />
      )}
      <Tag {...linkProps} className="relative flex flex-col gap-5 p-8">
        {/* Icon in bordered container */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl border border-foreground/[0.08] flex items-center justify-center">
            <img
              src={app.icon}
              alt={`${app.name} icon`}
              width={28}
              height={28}
            />
          </div>
          {isComingSoon && (
            <span className="text-xs font-medium text-foreground/70 tracking-wide uppercase">
              Releasing soon
            </span>
          )}
        </div>
        <div>
          <h3 className="text-base font-bold">{app.name}</h3>
          <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
            {app.description}
          </p>
        </div>
      </Tag>
    </m.div>
  );
}
