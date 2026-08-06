"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function MotionButton({ children, href, className, style }: Props) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -3, scale: 1.012 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`premium-button ${className ?? ""}`}
      style={style}
    >
      {children}
    </motion.a>
  );
}
