"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SecretMessage({ message }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.4 }}
      className="rounded-4xl glass p-5 shadow-glass"
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="font-display text-lg text-ink">Secret Message</h2>
        <span className="text-xs text-ink-soft">tap to reveal</span>
      </div>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="relative flex w-full min-h-[84px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blush/70 to-beige/70 px-5 py-5 text-center"
      >
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.div
              key="closed"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="text-2xl">💌</span>
              <span className="text-sm text-ink-soft">A little note is waiting</span>
            </motion.div>
          ) : (
            <motion.p
              key="open"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="font-display text-[17px] italic leading-snug text-ink"
            >
              "{message}"
            </motion.p>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
