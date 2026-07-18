"use client";

import {ReactNode, useState} from "react";
import Link from "next/link";
import {AnimatePresence, motion} from "framer-motion";

type DropdownItem = {
    label: string;
    href: string;
};

type DropdownProps = {
    label: ReactNode;
    items: DropdownItem[];
};

export default function Dropdown({label, items}: DropdownProps) {

    const [open, setOpen] = useState(false);

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >

            <div className="flex cursor-pointer items-center">
                {label}
            </div>

            <AnimatePresence>
            {open && (
                <motion.div
                    initial={{opacity: 0, y: 8, scale: 0.98, filter: "blur(4px)"}}
                    animate={{opacity: 1, y: 0, scale: 1, filter: "blur(0px)"}}
                    exit={{opacity: 0, y: 6, scale: 0.98, filter: "blur(4px)"}}
                    transition={{duration: 0.28, ease: [0.22, 1, 0.36, 1]}}
                    className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4"
                >

                    <div className="flex justify-center">
                        <div className="h-3 w-3 -mb-2 rotate-45 border-l border-t border-[#ebe4ca]/12 bg-[#10141c]"/>
                    </div>

                    <div
                        className="w-72 rounded-xl border border-[#ebe4ca]/12 bg-[#10141c]/94 p-2 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl"
                    >

                        {items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block rounded-lg px-4 py-3 text-sm text-white/72 transition duration-300 hover:bg-[#ebe4ca]/8 hover:text-white focus-visible:bg-[#ebe4ca]/10 focus-visible:text-white focus-visible:outline-none"
                            >
                                {item.label}
                            </Link>
                        ))}

                    </div>

                </motion.div>
            )}
            </AnimatePresence>

        </div>
    );
}
