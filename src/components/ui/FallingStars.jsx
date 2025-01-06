"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * FallingStars Component
 *
 * Generates small, circular yellow stars that move diagonally across the screen.
 * Each star has a random starting horizontal/vertical position, delay, duration,
 * and slope. They are rendered only on the client to prevent SSR mismatches.
 */
export function FallingStars({ count = 40 }) {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      return Array.from({ length: count }, () => {
        // Horizontal start: 0–100% (within or beyond the screen)
        const startX = Math.random() * 100;

        // Vertical start: -20% to +120% (some well above/below the screen)
        const startY = -20 + Math.random() * 140;

        // We'll move downward 40–100% beyond the startY
        // ensuring a downward movement across a wide range
        const endY = startY + 40 + Math.random() * 60;

        // Slope: horizontal shift from -50% to +50%
        const slope = (Math.random() - 0.5) * 100;

        // Duration: 3–10 seconds
        const duration = 3 + Math.random() * 7;

        // Delay: 0–5 seconds
        const delay = Math.random() * 5;

        // Star size: 2–5px
        const size = 2 + Math.random() * 3;

        // Opacity: 0.3–1 for variety
        const opacity = 0.3 + Math.random() * 0.7;

        return {
          startX,
          startY,
          endY,
          slope,
          duration,
          delay,
          size,
          opacity,
        };
      });
    };

    setStars(generateStars());
  }, [count]);

  if (!stars.length) return null;

  return (
    <>
      {stars.map((star, i) => (
        <motion.div
          key={i}
          // Initial position & opacity
          initial={{
            x: `${star.startX}%`,
            y: `${star.startY}%`,
            opacity: 0,
          }}
          // Final position & target opacity
          animate={{
            x: `${star.startX + star.slope}%`,
            y: `${star.endY}%`,
            opacity: star.opacity,
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
          // Star styling
          className="absolute bg-yellow-300 rounded-full shadow-md"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
        />
      ))}
    </>
  );
}
