"use client";

import { Button } from "@/components/ui";
import { PostponeDoseForm } from "./PostponeDoseForm";

export function DoseActions({
  onTaken,
  onMissed,
  onPostpone,
}: {
  onTaken: () => void;
  onMissed: () => void;
  onPostpone: (date: string) => void;
}) {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <Button onClick={onTaken} type="button">
          Marquer prise
        </Button>
        <Button onClick={onMissed} type="button" variant="secondary">
          Oubliée
        </Button>
      </div>
      <PostponeDoseForm onPostpone={onPostpone} />
    </div>
  );
}
