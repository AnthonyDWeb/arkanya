"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

export default function ResponsiveBlock({
  mobile,
  desktop,
}: {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? desktop : mobile;
}
