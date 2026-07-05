"use client";

import { motion } from "framer-motion";

export default function CareCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.2 }}
      className="relative overflow-hidden rounded-4xl glass-deep p-6 shadow-glass"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blush/60 blur-2xl animate-float" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-rose/30 blur-2xl animate-float [animation-delay:1.2s]" />

      <span className="text-xl">💌</span>
      <p className="mt-3 font-display text-[19px] italic leading-relaxed text-ink">
        I'm not here to interrupt your vacation.
        <br />
        I just wanted to quietly remind you to take care of yourself.
      </p>
    </motion.div>
  );
}
