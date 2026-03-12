import { m } from "motion/react";
import { usePrefersReducedMotion } from "../lib/motion";

export function HeroAnimation() {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <m.div
    >
<p>Hello</p>
    </m.div>
  );
}
