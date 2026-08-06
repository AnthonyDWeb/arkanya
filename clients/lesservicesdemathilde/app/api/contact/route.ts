import { createSmtpEmailProvider, escapeHtml, safeEmailValue } from "@arkanya/email";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const fallbackValue = "Non indiqué";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { nom, adresse, telephone, email, service, date, heureDebut, heureFin, message } = data;

    if (!process.env.OVH_MAIL_USER || !process.env.OVH_MAIL_PASSWORD) {
      console.error("Variables SMTP manquantes");
      return NextResponse.json(
        { ok: false, error: "Configuration SMTP manquante" },
        { status: 500 },
      );
    }

    const emailProvider = createSmtpEmailProvider({
      host: "ssl0.ovh.net",
      port: 465,
      secure: true,
      user: process.env.OVH_MAIL_USER,
      password: process.env.OVH_MAIL_PASSWORD,
      tlsRejectUnauthorized: false,
    });

    const safeNom = safeEmailValue(nom, fallbackValue);
    const safeAdresse = safeEmailValue(adresse, fallbackValue);
    const safeTelephone = safeEmailValue(telephone, fallbackValue);
    const safeEmail = safeEmailValue(email, fallbackValue);
    const safeService = safeEmailValue(service, fallbackValue);
    const safeDate = safeEmailValue(date, fallbackValue);
    const safeHeureDebut = safeEmailValue(heureDebut, fallbackValue);
    const safeHeureFin = safeEmailValue(heureFin, fallbackValue);
    const safeMessage = safeEmailValue(message, fallbackValue);

    const result = await emailProvider.sendEmail({
      from: process.env.OVH_MAIL_USER,
      to: process.env.OVH_MAIL_USER,
      replyTo: safeEmail !== fallbackValue ? safeEmail : undefined,
      subject: "Nouvelle demande",
      text: `
NOM : ${safeNom}
ADRESSE : ${safeAdresse}
TÉLÉPHONE : ${safeTelephone}
EMAIL : ${safeEmail}

SERVICE : ${safeService}
DATE : ${safeDate}
HORAIRE : ${safeHeureDebut} -> ${safeHeureFin}

MESSAGE :
${safeMessage}
      `,
      html: `
        <h2>Nouvelle demande</h2>
        <p><b>Nom :</b> ${escapeHtml(safeNom)}</p>
        <p><b>Adresse :</b> ${escapeHtml(safeAdresse)}</p>
        <p><b>Téléphone :</b> ${escapeHtml(safeTelephone)}</p>
        <p><b>Email :</b> ${escapeHtml(safeEmail)}</p>
        <p><b>Service :</b> ${escapeHtml(safeService)}</p>
        <p><b>Date :</b> ${escapeHtml(safeDate)}</p>
        <p><b>Horaire :</b> ${escapeHtml(safeHeureDebut)} -> ${escapeHtml(safeHeureFin)}</p>
        <p><b>Message :</b><br>${escapeHtml(safeMessage).replace(/\n/g, "<br>")}</p>
      `,
    });

    if (!result.ok) {
      throw result.error;
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("ERREUR EMAIL:", error);

    const message = error instanceof Error ? error.message : "Erreur inconnue";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
