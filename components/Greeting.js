"use client";

import { motion } from "framer-motion";

export default function Greeting({ title, emoji, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.1 }}
      className="px-1"
    >
      <h1 className="font-display text-[26px] leading-tight text-ink">
        {title} <span className="align-middle">{emoji}</span>
      </h1>
      <p className="mt-1 text-[15px] text-ink-soft">{subtitle}</p>
    </motion.div>
  );
}
