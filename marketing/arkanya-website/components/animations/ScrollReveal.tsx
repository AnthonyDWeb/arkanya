"use client";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export default function ScrollReveal({ children }: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
        filter: "blur(5px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{
        once: true,
        margin: "-80px",
      }}
      transition={{
        duration: 0.82,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ position: "relative" }}
    >
      {children}
    </motion.div>
  );
}
