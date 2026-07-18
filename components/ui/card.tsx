"use client";

import Link from "next/link";
import type {ReactNode} from "react";
import {motion} from "framer-motion";

type CardProps = {
    children: ReactNode;
    href?: string;
};

const cardClassName = "premium-card group h-full flex flex-col p-8 sm:p-10";

export default function Card({children, href}: CardProps) {

    if (href) {
        return (
            <motion.div
                className="h-full"
                whileHover={{y: -6, scale: 1.012}}
                whileTap={{scale: 0.992}}
                transition={{duration: 0.55, ease: [0.22, 1, 0.36, 1]}}
            >
                <Link href={href} className={cardClassName}>
                    {children}
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={cardClassName}
            whileHover={{y: -6, scale: 1.012}}
            transition={{duration: 0.55, ease: [0.22, 1, 0.36, 1]}}
        >
            {children}
        </motion.div>
    );
}
