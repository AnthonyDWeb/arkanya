"use client"

import {motion, useScroll, useTransform} from "framer-motion"
import {useRef} from "react"

interface Props {
    children: React.ReactNode
}

export default function ScrollCard({children}: Props) {

    const ref = useRef(null)

    const {scrollYProgress} = useScroll({
        target: ref,
        offset: ["start 0.9", "end 0.2"]
    })

    const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])
    const y = useTransform(scrollYProgress, [0, 1], [80, -40])
    const scale = useTransform(scrollYProgress, [0, 0.4], [0.95, 1])

    return (
        <motion.div
            ref={ref}
            style={{
                opacity,
                y,
                scale
            }}
        >
            {children}
        </motion.div>
    )
}