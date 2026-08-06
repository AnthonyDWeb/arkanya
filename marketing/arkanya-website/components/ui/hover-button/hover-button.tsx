import Link from "next/link";
import styles from "./hover-button.module.css";

type HoverButtonProps = {
  href?: string;
  children: React.ReactNode;
};

export default function HoverButton({ href, children }: HoverButtonProps) {
  if (href) {
    return (
      <Link href={href} className={styles.button}>
        {children}
      </Link>
    );
  }

  return <button className={styles.button}>{children}</button>;
}
