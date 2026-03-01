"use client";

import {motion} from "framer-motion";
import {ReactNode} from "react";

type Props = {
    children: ReactNode;
    href: string;
    className?: string;
    style?: React.CSSProperties;
};

export default function MotionButton({children, href, className, style}: Props) {
    return (
        <motion.a
            href={href}
            whileHover={{y: -5}}
            transition={{duration: 0.25, ease: "easeOut"}}
            className={className}
            style={style}
        >
            {children}
        </motion.a>
    );
}