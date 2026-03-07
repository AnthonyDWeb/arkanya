"use client"

import {motion, useScroll, useTransform} from "framer-motion"
import {useRef} from "react"

type Props = {
    children: React.ReactNode
    speed?: number
}

export default function ParallaxSection({children, speed = 60}: Props) {

    const ref = useRef(null)

    const {scrollYProgress} = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [-speed, speed])

    return (
        <section ref={ref} className="relative overflow-hidden">

            <motion.div
                style={{y}}
                className="relative"
            >
                {children}
            </motion.div>

        </section>
    )
}