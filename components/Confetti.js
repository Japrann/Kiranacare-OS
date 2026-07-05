"use client";

import { motion } from "framer-motion";

const COLORS = ["#EBAEB8", "#F8DCE1", "#F1E7D8", "#DE8E9B", "#FFFDF9"];

function seededParticles(count) {
  return Array.from({ length: count }).map((_, i) => {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const distance = 40 + Math.random() * 50;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 20,
      rotate: Math.random() * 360,
      color: COLORS[i % COLORS.length],
      size: 5 + Math.random() * 5,
      shape: Math.random() > 0.5 ? "50%" : "3px",
    };
  });
}

export default function Confetti({ id }) {
  const particles = seededParticles(14);

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-0 w-0">
      {particles.map((p) => (
        <motion.span
          key={`${id}-${p.id}`}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y + 30,
            opacity: 0,
            scale: 1,
            rotate: p.rotate,
          }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: p.shape,
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}
