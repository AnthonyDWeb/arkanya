"use client";

import {motion} from "framer-motion";
import {ReactNode} from "react";

export default function AnimatedCard({children}: { children: ReactNode }) {
    return (
        <motion.div
            variants={{
                hidden: {opacity: 0, y: 30},
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {duration: 0.6},
                },
            }}
            whileHover={{y: -6}}
            transition={{duration: 0.3}}
        >
            {children}
        </motion.div>
    );
}