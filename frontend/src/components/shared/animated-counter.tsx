"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue, useTransform, motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export const AnimatedCounter = ({ value, duration = 2, prefix = "", suffix = "" }: AnimatedCounterProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return Math.floor(latest).toLocaleString();
  });

  useEffect(() => {
    const controls = animate(count, value, { duration: duration, ease: "easeOut" });
    return controls.stop;
  }, [value, duration, count]);

  return (
    <motion.span className="font-bold">
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
};
