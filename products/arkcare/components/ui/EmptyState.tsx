import { EmptyState as CoreEmptyState } from "@arkanya/ui/core";
import { Button } from "./Button";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <CoreEmptyState
      title={title}
      description={description}
      action={actionHref && actionLabel ? <Button href={actionHref}>{actionLabel}</Button> : null}
      className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center"
    />
  );
}
