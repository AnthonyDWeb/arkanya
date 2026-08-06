"use client";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export default function Stagger({ children }: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
