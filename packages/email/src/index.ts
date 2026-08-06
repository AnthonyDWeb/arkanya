import nodemailer from "nodemailer"

export type SmtpEmailConfig = {
  host: string
  port: number
  secure: boolean
  user: string
  password: string
  tlsRejectUnauthorized?: boolean
}

export type SendEmailInput = {
  from: string
  to: string
  replyTo?: string
  subject: string
  text: string
  html?: string
}

export type SendEmailResult =
  | { ok: true }
  | { ok: false; error: Error }

export type EmailProvider = {
  sendEmail: (input: SendEmailInput) => Promise<SendEmailResult>
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export function safeEmailValue(value: unknown, fallback = "Non indique"): string {
  if (typeof value !== "string" || !value.trim() || value === "null" || value === "undefined") {
    return fallback
  }
  return value.trim()
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function createSmtpEmailProvider(config: SmtpEmailConfig): EmailProvider {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
    tls: {
      rejectUnauthorized: config.tlsRejectUnauthorized ?? true,
    },
  })

  return {
    async sendEmail(input) {
      try {
        await transporter.sendMail({
          from: input.from,
          to: input.to,
          replyTo: input.replyTo,
          subject: input.subject,
          text: input.text,
          html: input.html,
        })
        return { ok: true }
      } catch (error) {
        return {
          ok: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }
      }
    },
  }
}

export type ResendEmailConfig = {
  apiKey: string
}

export function createResendEmailProvider(config: ResendEmailConfig): EmailProvider {
  return {
    async sendEmail(input) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: input.from,
            to: [input.to],
            reply_to: input.replyTo,
            subject: input.subject,
            text: input.text,
            html: input.html,
          }),
        })

        if (!res.ok) {
          const body = await res.text()
          return { ok: false, error: new Error(`Resend ${res.status}: ${body}`) }
        }

        return { ok: true }
      } catch (error) {
        return {
          ok: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }
      }
    },
  }
}
