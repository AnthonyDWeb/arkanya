"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"

type FormState = {
  name: string
  email: string
  message: string
}

type SubmitState = "idle" | "loading" | "success" | "error"

export function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" })
  const [submitState, setSubmitState] = useState<SubmitState>("idle")

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitState("loading")
    await new Promise((r) => setTimeout(r, 800))
    setSubmitState("success")
  }

  if (submitState === "success") {
    return (
      <div className="p-6 bg-green-50 rounded-xl border border-green-200 text-center">
        <p className="text-green-700 font-medium">Message envoyé avec succès !</p>
        <p className="text-sm text-green-600 mt-1">Nous vous répondrons dans les meilleurs délais.</p>
      </div>
    )
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nom
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={form.message}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitState === "loading"}
        className="w-full py-2.5 px-4 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium transition-opacity duration-[120ms] ease-out disabled:opacity-60 hover:opacity-90"
      >
        {submitState === "loading" ? "Envoi…" : "Envoyer le message"}
      </button>
    </form>
  )
}
