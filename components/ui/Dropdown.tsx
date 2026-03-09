"use client";

import {ReactNode, useState} from "react";
import Link from "next/link";

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
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >

            {/* Trigger */}
            <div className="cursor-pointer">
                {label}
            </div>

            {open && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50">

                    {/* Pointe */}
                    <div className="flex justify-center">
                        <div className="
                            w-3 h-3
                            bg-white dark:bg-neutral-900
                            rotate-45
                            -mb-2
                        "/>
                    </div>

                    {/* Menu */}
                    <div className="
                        w-60
                        bg-white dark:bg-neutral-900
                        border border-neutral-200 dark:border-neutral-800
                        rounded-md
                        shadow-lg
                        py-2
                    ">

                        {items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="
                                block
                                px-4 py-2.5
                                text-sm
                                text-neutral-700 dark:text-neutral-300
                                hover:bg-neutral-200
                                dark:hover:bg-neutral-700
                                hover:text-neutral-900
                                dark:hover:text-white
                                transition
                                "
                            >
                                {item.label}
                            </Link>
                        ))}

                    </div>

                </div>
            )}

        </div>
    );
}