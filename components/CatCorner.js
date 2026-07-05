"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { catLines } from "@/lib/messages";

function CatAvatar({ emoji, name, gradient }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-glass border border-white/60 ${gradient}`}
      >
        {emoji}
      </div>
      <span className="text-xs font-medium text-ink-soft">{name}</span>
    </div>
  );
}

export default function CatCorner() {
  const [cilaIndex, setCilaIndex] = useState(0);
  const [zoroIndex, setZoroIndex] = useState(1);

  useEffect(() => {
    const t1 = setInterval(() => {
      setCilaIndex((i) => (i + 1) % catLines.cila.length);
    }, 7000);
    const t2 = setInterval(() => {
      setZoroIndex((i) => (i + 1) % catLines.zoro.length);
    }, 8500);
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.5 }}
      className="rounded-4xl glass p-5 shadow-glass"
    >
      <h2 className="mb-4 px-1 font-display text-lg text-ink">Cat Corner</h2>

      <div className="flex items-start justify-around gap-3">
        <div className="flex flex-col items-center gap-2.5">
          <CatAvatar emoji="🐈‍⬛" name="Cila" gradient="bg-gradient-to-br from-blush to-rose/40" />
          <AnimatePresence mode="wait">
            <motion.div
              key={cilaIndex}
              initial={{ opacity: 0, y: 6, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="max-w-[130px] rounded-2xl bg-white-soft/80 px-3 py-2 text-center text-[11px] leading-snug text-ink-soft shadow-inner-glow"
            >
              {catLines.cila[cilaIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-2.5">
          <CatAvatar emoji="🐱" name="Zoro" gradient="bg-gradient-to-br from-beige to-rose/30" />
          <AnimatePresence mode="wait">
            <motion.div
              key={zoroIndex}
              initial={{ opacity: 0, y: 6, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="max-w-[130px] rounded-2xl bg-white-soft/80 px-3 py-2 text-center text-[11px] leading-snug text-ink-soft shadow-inner-glow"
            >
              {catLines.zoro[zoroIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
