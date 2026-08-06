"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ fallbackHref = "/" }: { fallbackHref?: string }) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  }

  return (
    <button type="button" onClick={goBack} className="arknest-settings-back">
      ← Retour
    </button>
  );
}
