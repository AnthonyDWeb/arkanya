"use client";

import { useEffect, useState } from "react";
import { getStorage, setStorage } from "@/lib/storage";
import { AppData } from "@/types";

export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setData(getStorage());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const update = (callback: (d: AppData) => AppData) => {
    setData((current) => {
      if (!current) return current;

      const updated = callback(current);
      return setStorage(updated);
    });
  };

  return { data, update };
}
