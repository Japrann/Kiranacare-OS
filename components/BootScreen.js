"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bootLines } from "@/lib/messages";

const LINE_DELAY = 620;
const HOLD_AFTER_READY = 900;

export default function BootScreen({ onFinish }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= bootLines.length) {
      const t = setTimeout(onFinish, HOLD_AFTER_READY);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleCount((c) => c + 1), LINE_DELAY);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCount]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream px-8"
      exit={{ opacity: 0, filter: "blur(6px)" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative mb-10">
        <div className="absolute inset-0 -z-10 rounded-full bg-rose/50 blur-2xl animate-glow" />
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className="flex h-20 w-20 items-center justify-center rounded-4xl glass shadow-glass-lg"
        >
          <span className="text-3xl">🌸</span>
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-2xl italic tracking-tight text-ink text-shadow-soft"
      >
        Kirana Care OS
      </motion.h1>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-2.5">
        <AnimatePresence>
          {bootLines.slice(0, visibleCount).map((line, i) => {
            const isLast = i === visibleCount - 1 && visibleCount >= bootLines.length;
            return (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="flex items-center gap-2.5 text-sm text-ink-soft"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                    isLast ? "bg-rose text-white" : "bg-beige text-ink-soft"
                  }`}
                >
                  {isLast ? "✓" : "•"}
                </span>
                <span className={isLast ? "font-medium text-ink" : ""}>{line}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-10 h-1 w-40 overflow-hidden rounded-full bg-beige">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-rose to-rose-deep"
          initial={{ width: "0%" }}
          animate={{
            width: `${Math.min(100, (visibleCount / bootLines.length) * 100)}%`,
          }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}
