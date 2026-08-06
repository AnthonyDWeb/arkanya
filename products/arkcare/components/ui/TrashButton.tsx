"use client";

export function TrashButton({
  label = "Supprimer",
  confirmMessage = "Confirmer la suppression ?",
  onClick,
}: {
  label?: string;
  confirmMessage?: string;
  onClick: () => void;
}) {
  function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    onClick();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-rose-600 transition hover:bg-rose-50 hover:text-rose-800"
      aria-label={label}
      title={label}
    >
      🗑
    </button>
  );
}
