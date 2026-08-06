"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitState("loading");
    setFeedback("");

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      projectType: String(formData.get("projectType") ?? ""),
      budget: String(formData.get("budget") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    console.log("[ContactForm] Form payload:", payload);

    try {
      console.log("[ContactForm] Sending POST /api/contact");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      console.log("[ContactForm] API response:", {
        ok: response.ok,
        status: response.status,
        result,
      });

      if (!response.ok) {
        setSubmitState("error");
        setFeedback(result.message ?? "L'envoi a echoue.");
        return;
      }

      form.reset();
      setSubmitState("success");
      setFeedback("Votre demande a bien ete envoyee.");
    } catch (error) {
      console.error("[ContactForm] Submit error:", error);
      setSubmitState("error");
      setFeedback("Impossible d'envoyer le message pour le moment.");
    }
  }

  const isLoading = submitState === "loading";

  return (
    <form onSubmit={handleSubmit} className="premium-form space-y-6 p-8 sm:p-10">
      <div className="space-y-2">
        <label htmlFor="contact-name" className="text-sm font-medium">
          Nom
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full bg-white border border-neutral-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full bg-white border border-neutral-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-project-type" className="text-sm font-medium">
          Type de projet
        </label>
        <select
          id="contact-project-type"
          name="projectType"
          className="w-full bg-white border border-neutral-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition"
        >
          <option>Modernisation / Refonte</option>
          <option>Creation site</option>
          <option>Outil metier / Web app</option>
          <option>Accompagnement technique</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-budget" className="text-sm font-medium">
          Budget estimatif
        </label>
        <select
          id="contact-budget"
          name="budget"
          className="w-full bg-white border border-neutral-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition"
        >
          <option>1 000 - 2 500 EUR</option>
          <option>2 500 - 5 000 EUR</option>
          <option>5 000 - 10 000 EUR</option>
          <option>10 000 EUR +</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          className="w-full bg-white border border-neutral-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="cta-button w-full px-8 py-3 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Envoi en cours..." : "Envoyer la demande"}
      </button>

      {feedback && (
        <p
          className={`text-sm ${submitState === "success" ? "text-green-700" : "text-red-700"}`}
          role="status"
        >
          {feedback}
        </p>
      )}
    </form>
  );
}
