"use client"

import {motion, useScroll, useTransform} from "framer-motion"
import {useRef} from "react"

interface Props {
    children: React.ReactNode
    index?: number
}

export default function ScrollCard({children, index = 0}: Props) {

    const ref = useRef(null)

    const {scrollYProgress} = useScroll({
        target: ref,
        offset: ["start 0.9", "end 0.3"]
    })

    const opacity = useTransform(
        scrollYProgress,
        [0, 0.3],
        [0, 1]
    )

    const y = useTransform(
        scrollYProgress,
        [0, 1],
        [80 - index * 20, -40]
    )

    const scale = useTransform(
        scrollYProgress,
        [0, 0.3],
        [0.95, 1]
    )

    return (
        <motion.div
            ref={ref}
            style={{
                opacity,
                y,
                scale
            }}
            transition={{
                duration: 0.5,
                delay: index * 0.15
            }}
        >
            {children}
        </motion.div>
    )
}