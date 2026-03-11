import gsap from "gsap";

export function initGsap() {
  const mm = gsap.matchMedia();

  mm.add(
    {
      motionOk: "(prefers-reduced-motion: no-preference)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { motionOk } = context.conditions!;

      if (motionOk) {
        // Full animations — Phase 3 will add actual targets here
      } else {
        // Reduced motion — static fallbacks
      }

      return () => {
        // Cleanup when conditions change
      };
    }
  );

  return mm;
}
