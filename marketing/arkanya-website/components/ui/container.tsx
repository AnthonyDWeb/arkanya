import { Container as CoreContainer } from "@arkanya/ui/core";
import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <CoreContainer className={`w-[90%] xl:w-[70%] mx-auto px-0 ${className}`}>
      {children}
    </CoreContainer>
  );
}
