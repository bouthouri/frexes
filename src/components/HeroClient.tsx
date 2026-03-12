import { LazyMotion, domAnimation } from "motion/react";
import { TextWall } from "./TextWall";

export function HeroClient() {
  return (
    <LazyMotion features={domAnimation} strict>
      <TextWall />
    </LazyMotion>
  );
}
