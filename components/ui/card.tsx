import Link from "next/link";
import type {ReactNode} from "react";

type CardProps = {
    children: ReactNode;
    href?: string;
};

const cardBaseClassName = "group bg-surface h-full flex flex-col p-10 shadow-soft";
const cardBorderClassName = "border-subtle rounded-2xl";
const cardTransitionClassName = "transition-all duration-300 ease-out";
const cardHoverClassName = "cardgoldhover hover:scale-[1.1]";

const cardClassName = [
    cardBaseClassName,
    cardBorderClassName,
    cardTransitionClassName,
    cardHoverClassName,
].join(" ");

export default function Card({children, href}: CardProps) {

    if (href) {
        return (
            <Link href={href} className={cardClassName}>
                {children}
            </Link>
        );
    }

    return (
        <div className={cardClassName}>
            {children}
        </div>
    );
}
