import { useEffect, useRef } from "react";
import gsap from "gsap";

const ALL_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const WORDS = [
  "Transcend",
  "Evolve",
  "Elevate",
  "Mastery",
  "Growth",
  "Unlock",
  "Thrive",
  "Ascend",
  "Focus",
  "Ignite",
  "Relentless",
  "Overcome",
  "Discipline",
  "Potential",
  "Momentum",
  "Transform",
  "Clarity",
  "Purpose",
  "Grit",
  "Rise",
  "Peak",
  "Forge",
  "Awaken",
  "Unleash",
];

const NUM_LINES = 30;
const SPACER = "\u00A0"; // non-breaking space as invisible filler

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomArr<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function map(
  num: number,
  toMin: number,
  toMax: number,
  fromMin: number,
  fromMax: number,
) {
  if (num <= fromMin) return toMin;
  if (num >= fromMax) return toMax;
  return ((num - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin;
}

interface TextSegment {
  word: string;
  start: number;
  end: number;
}

class Line {
  el: HTMLDivElement;
  total: number;
  segments: TextSegment[] = [];
  showRateA = { val: 0 };
  showRateB = { val: 0 };
  isShowed = false;
  isLast: boolean;
  disposed = false;
  lastText = "";

  constructor(el: HTMLDivElement, isLast: boolean) {
    this.el = el;
    this.isLast = isLast;
    // Calculate chars needed to fill viewport at ~6px per char (monospace 10px)
    const charsNeeded = Math.ceil(window.innerWidth / 6);
    this.total = Math.max(charsNeeded, 200);

    let cursor = 0;
    const count = randomInt(2, 6);
    for (let i = 0; i < count; i++) {
      const word = randomArr(WORDS);
      if (cursor + word.length < this.total - 3) {
        const start = randomInt(cursor, this.total - 3 - word.length);
        const end = start + word.length;
        this.segments.push({ word, start, end });
        cursor = end;
      }
    }

    this.el.textContent = SPACER.repeat(this.total);
  }

  show(delay: number) {
    if (this.disposed) return;
    const dur = 1;

    gsap.killTweensOf(this.showRateA);
    gsap.killTweensOf(this.showRateB);

    gsap.fromTo(
      this.showRateA,
      { val: 0 },
      { val: 1, duration: dur, delay, ease: "expo.out" },
    );

    gsap.fromTo(
      this.showRateB,
      { val: 0 },
      {
        val: 1,
        duration: dur,
        delay: delay + dur * 0.75,
        ease: "expo.inOut",
        onComplete: () => this.hide(2),
      },
    );
  }

  hide(delay: number) {
    if (this.disposed) return;
    const dur = 1;

    gsap.killTweensOf(this.showRateA);
    gsap.killTweensOf(this.showRateB);

    gsap.to(this.showRateA, {
      val: 0,
      duration: dur,
      delay: delay + dur * 0.75,
      ease: "expo.out",
      onComplete: () => {
        if (this.disposed) return;
        if (!this.isLast) {
          this.el.textContent = SPACER;
          this.lastText = "";
        }
        this.show(2);
      },
    });

    gsap.to(this.showRateB, {
      val: 0,
      duration: dur,
      delay,
      ease: "expo.inOut",
      onStart: () => {
        this.isShowed = false;
      },
    });
  }

  update() {
    if (this.disposed) return;
    const sA = this.showRateA.val;
    const sB = this.showRateB.val;

    if (sA <= 0 || this.isShowed || this.isLast) return;

    const chars: string[] = [];
    const etc = map(sB, 0, this.total, 0, 1);
    const num = map(sA, 0, this.total, 0, 1);

    for (let i = 0; i < num; i++) {
      let isText = false;
      for (const seg of this.segments) {
        if (seg.start <= i && i <= seg.end) {
          chars.push(seg.word.charAt(i - seg.start));
          isText = true;
          break;
        }
      }
      if (!isText) {
        if (i >= etc) {
          chars.push(ALL_CHARS.charAt(randomInt(0, ALL_CHARS.length - 1)));
        } else {
          chars.push(SPACER);
        }
      }
    }

    const str = chars.join("");
    // Only touch DOM if content actually changed (skips settled lines)
    if (str !== this.lastText) {
      this.el.textContent = str;
      this.lastText = str;
    }

    if (sB >= 1) {
      this.isShowed = true;
    }
  }

  dispose() {
    this.disposed = true;
    gsap.killTweensOf(this.showRateA);
    gsap.killTweensOf(this.showRateB);
  }
}

export function TextWall() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const lines: Line[] = [];

    for (let i = 0; i < NUM_LINES; i++) {
      const el = document.createElement("div");
      el.className = "text-wall-line";
      wrapper.appendChild(el);

      const line = new Line(el, i === NUM_LINES - 1);
      lines.push(line);
      line.show(1 + i * 0.1);
    }

    let rafId: number;
    const tick = () => {
      for (const line of lines) {
        line.update();
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      for (const line of lines) {
        line.dispose();
      }
      wrapper.innerHTML = "";
    };
  }, []);

  return <div ref={wrapperRef} className="text-wall-wrapper" />;
}
