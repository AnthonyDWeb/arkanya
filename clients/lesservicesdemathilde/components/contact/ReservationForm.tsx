"use client";

import { useState } from "react";
import { sendEmailRequest } from "@arkanya/email/client";

import services from "@/data/services.json";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DateInput from "@/components/ui/DateInput";
import TimeRange from "@/components/ui/TimeRange";
import FloatingTextarea from "@/components/ui/FloatingTextarea";
import { ContactPayload } from "@/types";

export default function ReservationForm({ service }: { service?: string }) {
  const validService = services.find((s) => s.slug === service);

  const [mode, setMode] = useState<"contact" | "reservation">(
    validService ? "reservation" : "contact",
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function safe(value: FormDataEntryValue | null): string {
    return value ? String(value) : "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setSuccess(false);
    setError("");

    const form = new FormData(e.currentTarget);

    const payload: ContactPayload = {
      nom: safe(form.get("nom")),
      adresse: safe(form.get("adresse")),
      telephone: safe(form.get("telephone")),
      email: safe(form.get("email")),
      service: safe(form.get("service")),
      date: safe(form.get("date")),
      heureDebut: safe(form.get("heureDebut")),
      heureFin: safe(form.get("heureFin")),
      message: safe(form.get("message")),
    };

    try {
      await sendEmailRequest("/api/contact", payload);
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue";

      console.error(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-[#EDEDED] rounded-2xl p-6 bg-white">
      <h2 className="text-2xl font-semibold mb-2 text-[#809877] text-center">
        Contact ou Réservation
      </h2>

      <p className="text-sm opacity-70 mb-6 text-center">Réponse rapide sous 24h • Devis gratuit</p>

      {/* SWITCH */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setMode("contact")}
          className={`
                        flex-1 py-2 rounded-lg border transition
                        ${
                          mode === "contact"
                            ? "bg-[#809877] text-white border-[#809877]"
                            : "bg-white text-gray-500 border-[#E2E2E2]"
                        }
                    `}
        >
          Prise de contact
        </button>

        <button
          type="button"
          onClick={() => setMode("reservation")}
          className={`
                        flex-1 py-2 rounded-lg border transition
                        ${
                          mode === "reservation"
                            ? "bg-[#809877] text-white border-[#809877]"
                            : "bg-white text-gray-500 border-[#E2E2E2]"
                        }
                    `}
        >
          Réservation
        </button>
      </div>

      {/* SERVICE INFO */}
      {validService && mode === "reservation" && (
        <div className="mb-4 text-sm text-[#809877] font-medium text-center">
          Service sélectionné : {validService.title}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* COMMUN */}
        <Input label="Nom" name="nom" required />
        <Input label="E-mail" name="email" type="email" required />

        {/* CONTACT */}
        {mode === "contact" && <FloatingTextarea label="Votre message" name="message" />}

        {/* RESERVATION */}
        {mode === "reservation" && (
          <>
            <Input label="Adresse" name="adresse" />
            <Input label="Téléphone" name="telephone" type="tel" />

            <Select
              label="Service souhaité"
              name="service"
              required
              defaultValue={validService ? validService.slug : ""}
            >
              <option value="" disabled>
                Choisir un service
              </option>

              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </Select>

            <DateInput label="Date souhaitée" name="date" />

            <TimeRange startName="heureDebut" endName="heureFin" />

            <FloatingTextarea label="Message (optionnel)" name="message" />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="
                        w-full py-3 rounded-lg text-white font-semibold
                        transition-all duration-300 hover:scale-[1.02]
                    "
          style={{
            background: "linear-gradient(135deg, #809877, #6d8660)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Envoi..." : "Envoyer"}
        </button>

        {success && <p className="text-green-600 text-center">Message envoyé 🎉</p>}

        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
}
