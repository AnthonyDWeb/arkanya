"use client";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export default function FadeLeft({ children }: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -24,
        filter: "blur(6px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
