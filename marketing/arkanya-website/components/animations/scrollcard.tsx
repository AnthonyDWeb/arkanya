"use client";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  index?: number;
  variant?: "fade" | "left" | "right";
}

export default function ScrollCard({ children, index = 0, variant = "fade" }: Props) {
  const x = variant === "left" ? -62 : variant === "right" ? 62 : 0;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{
        duration: 0.78,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
