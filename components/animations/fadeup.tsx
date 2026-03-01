"use client";

import {motion} from "framer-motion";
import {ReactNode} from "react";

type Props = {
    children: ReactNode;
    delay?: number;
    className?: string;
};

export default function FadeUp({children, delay = 0, className}: Props) {
    return (
        <motion.div
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, amount: 0.3}}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}