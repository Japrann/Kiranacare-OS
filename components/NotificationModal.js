"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function NotificationModal({
  visible,
  status = "idle",
  onAllow,
  onDismiss,
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-40 flex items-end justify-center bg-ink/20 backdrop-blur-sm sm:items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative mx-4 mb-4 w-full max-w-sm rounded-4xl glass-deep p-6 text-center shadow-glass-lg sm:mb-0"
          >
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-blush/70 text-2xl">
                    🔔
                  </div>
                  <h3 className="font-display text-lg text-ink">
                    May I quietly remind you today?
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                    I'd love to send you tiny reminders while you're enjoying
                    your villa trip. Nothing annoying. Just small messages to
                    make sure you're eating, drinking, and resting.
                  </p>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      onClick={onAllow}
                      className="w-full rounded-2xl bg-gradient-to-r from-rose to-rose-deep px-4 py-3 text-[15px] font-semibold text-white shadow-glass"
                    >
                      Allow ❤️
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      onClick={onDismiss}
                      className="w-full rounded-2xl bg-white-soft/60 px-4 py-3 text-[15px] font-medium text-ink-soft"
                    >
                      Maybe Later
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                >
                  <motion.div
                    initial={{ scale: 0.6, rotate: -8 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 14 }}
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-blush/70 text-2xl"
                  >
                    ❤️
                  </motion.div>
                  <h3 className="font-display text-lg text-ink">
                    You're all set!
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                    I'll quietly remind you to take care of yourself while
                    you're away.
                  </p>
                </motion.div>
              )}

              {status === "declined" && (
                <motion.div
                  key="declined"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-beige/70 text-2xl">
                    🌸
                  </div>
                  <h3 className="font-display text-lg text-ink">
                    That's okay.
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                    No reminders for now — you can always turn them on later.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
