"use client";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export default function StaggerItem({ children }: Props) {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 40,
          scale: 0.96,
        },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
        },
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
