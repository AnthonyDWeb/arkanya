import { Button as CoreButton } from "@arkanya/ui/core";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const variants = {
  primary: "bg-teal-700 text-white hover:bg-teal-800",
  secondary: "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

export function Button({ href, children, variant = "primary", className = "", ...props }: Props) {
  const classes = `inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <CoreButton className={classes} {...props}>
      {children}
    </CoreButton>
  );
}
