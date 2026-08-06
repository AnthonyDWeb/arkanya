import { ExternalLink as CoreExternalLink } from "@arkanya/ui/core";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function ExternalLink({ href, children, className }: Props) {
  return (
    <CoreExternalLink href={href} className={className}>
      {children}
    </CoreExternalLink>
  );
}
