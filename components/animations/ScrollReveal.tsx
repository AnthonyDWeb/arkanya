"use client"

import {motion} from "framer-motion"

interface Props {
    children: React.ReactNode
}

export default function ScrollReveal({children}: Props) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 40
            }}
            whileInView={{
                opacity: 1,
                y: 0
            }}
            viewport={{
                once: false,
                margin: "-80px"
            }}
            transition={{
                duration: 0.6,
                ease: "easeOut"
            }}
            style={{position: "relative"}}
        >
            {children}
        </motion.div>
    )
}