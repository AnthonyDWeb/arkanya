"use client";

import { useRouter } from "next/navigation";

export function BackButton({ fallbackHref = "/" }: { fallbackHref?: string }) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className="inline-flex w-fit items-center text-sm font-semibold text-teal-700 hover:text-teal-800"
    >
      ← Retour
    </button>
  );
}
