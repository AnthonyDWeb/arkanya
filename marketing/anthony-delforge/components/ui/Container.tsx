import { Container as CoreContainer } from "@arkanya/ui/core";

export default function Container({ children }: { children: React.ReactNode }) {
  return <CoreContainer className="w-[90%] max-w-[1300px] mx-auto px-0">{children}</CoreContainer>;
}
