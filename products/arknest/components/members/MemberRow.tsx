"use client";

import { useState } from "react";
import { Button, Input } from "@arkanya/ui/core";
import { Inline } from "@arkanya/ui/layout";
import { Member } from "@/types";

type Props = {
  Member: Member;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
};

export default function MemberRow({ Member, onUpdate, onDelete }: Props) {
  const [name, setName] = useState(Member.name);

  return (
    <Inline gap="sm">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => onUpdate(Member.id, name)}
        className="min-w-0 flex-1"
      />

      <Button variant="danger" size="sm" onClick={() => onDelete(Member.id)}>
        Supprimer
      </Button>
    </Inline>
  );
}
