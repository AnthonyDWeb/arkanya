import React from "react";

export type Children = React.ReactNode;

export interface ContactPayload {
  nom: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  service?: string;
  date?: string;
  heureDebut?: string;
  heureFin?: string;
  message: string;
}
