"use client";

import { useState } from "react";
import { Button, Field } from "@/components/ui";
import { formatDateTimeLocal } from "@/lib/dates";

export function PostponeDoseForm({ onPostpone }: { onPostpone: (date: string) => void }) {
  const [date, setDate] = useState(() => {
    return formatDateTimeLocal(new Date(Date.now() + 60 * 60 * 1000));
  });

  return (
    <form
      className="flex flex-col gap-2 sm:flex-row sm:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        onPostpone(new Date(date).toISOString());
      }}
    >
      <Field
        label="Reporter à"
        type="datetime-local"
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />
      <Button type="submit" variant="secondary">
        Reporter
      </Button>
    </form>
  );
}
