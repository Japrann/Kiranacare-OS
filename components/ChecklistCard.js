"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { checklistDefaults } from "@/lib/messages";
import Confetti from "./Confetti";

export default function ChecklistCard() {
  const [checked, setChecked] = useState({});
  const [burstId, setBurstId] = useState(null);

  const doneCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  );

  function toggle(id) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        setBurstId(`${id}-${Date.now()}`);
        if (typeof window !== "undefined" && window.navigator?.vibrate) {
          window.navigator.vibrate(12);
        }
      }
      return next;
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.3 }}
      className="rounded-4xl glass p-5 shadow-glass"
    >
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="font-display text-lg text-ink">Today's Care Checklist</h2>
        <span className="rounded-full bg-white-soft/70 px-2.5 py-1 text-xs font-medium text-rose-deep shadow-inner-glow">
          {doneCount}/{checklistDefaults.length}
        </span>
      </div>

      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-beige/70">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-rose to-rose-deep"
          animate={{
            width: `${(doneCount / checklistDefaults.length) * 100}%`,
          }}
          transition={{ type: "spring", stiffness: 160, damping: 24 }}
        />
      </div>

      <ul className="flex flex-col gap-1.5">
        {checklistDefaults.map((item) => {
          const isChecked = !!checked[item.id];
          return (
            <li key={item.id} className="relative">
              <motion.button
                onClick={() => toggle(item.id)}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-300 ${
                  isChecked ? "bg-blush/50" : "bg-white-soft/40 hover:bg-white-soft/70"
                }`}
              >
                <motion.span
                  animate={{
                    backgroundColor: isChecked ? "#EBAEB8" : "rgba(255,255,255,0.7)",
                    scale: isChecked ? [1, 1.25, 1] : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-rose/40"
                >
                  <AnimatePresence>
                    {isChecked && (
                      <motion.svg
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5 text-white"
                        fill="none"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                  {burstId?.startsWith(item.id) && <Confetti id={burstId} />}
                </motion.span>

                <span className="text-lg">{item.emoji}</span>
                <span
                  className={`flex-1 text-[15px] transition-all duration-300 ${
                    isChecked ? "text-ink-soft line-through" : "text-ink"
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {doneCount === checklistDefaults.length && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 14 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="rounded-2xl bg-rose/15 px-3 py-2.5 text-center text-sm font-medium text-rose-deep"
          >
            All done. Proud of you, gently. 🌷
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
