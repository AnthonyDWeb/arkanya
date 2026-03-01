"use client";

import {motion} from "framer-motion";
import {ReactNode} from "react";

type Props = {
    children: ReactNode;
    direction?: "left" | "right";
    className?: string;
};

export default function SlideIn({children, direction = "left", className}: Props) {
    const x = direction === "left" ? -60 : 60;

    return (
        <motion.div
            initial={{opacity: 0, x}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, amount: 0.3}}
            transition={{duration: 0.7, ease: [0.25, 0.1, 0.25, 1]}}
            className={className}
        >
            {children}
        </motion.div>
    );
}