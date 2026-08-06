"use client";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export default function ScrollTitle({ children }: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.985,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      viewport={{
        once: true,
        margin: "-100px",
      }}
      transition={{
        duration: 0.95,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ position: "relative" }}
    >
      {children}
    </motion.div>
  );
}
