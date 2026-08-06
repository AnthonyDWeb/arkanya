import { createResendEmailProvider, escapeHtml, isValidEmail } from "@arkanya/email";
import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  projectType?: string;
  budget?: string;
  message?: string;
};

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactToEmail = process.env.CONTACT_TO_EMAIL;
  const contactFromEmail = process.env.CONTACT_FROM_EMAIL ?? "Arkanya <onboarding@resend.dev>";

  if (!resendApiKey || !contactToEmail) {
    console.error("[Contact API] Missing email configuration:", {
      hasResendApiKey: Boolean(resendApiKey),
      hasContactToEmail: Boolean(contactToEmail),
      contactFromEmail,
    });

    return NextResponse.json({ message: "Configuration d'envoi manquante." }, { status: 500 });
  }

  let payload: ContactPayload;

  try {
    payload = await request.json();
    console.log("[Contact API] Received payload:", payload);
  } catch {
    console.error("[Contact API] Invalid JSON payload");

    return NextResponse.json({ message: "Requete invalide." }, { status: 400 });
  }

  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const projectType = payload.projectType?.trim() ?? "";
  const budget = payload.budget?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  console.log("[Contact API] Parsed fields:", {
    name,
    email,
    projectType,
    budget,
    message,
  });

  if (!name || !email || !message) {
    console.warn("[Contact API] Missing required fields:", {
      hasName: Boolean(name),
      hasEmail: Boolean(email),
      hasMessage: Boolean(message),
    });

    return NextResponse.json(
      { message: "Le nom, l'email et le message sont obligatoires." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    console.warn("[Contact API] Invalid email:", email);

    return NextResponse.json({ message: "L'adresse email est invalide." }, { status: 400 });
  }

  const emailProvider = createResendEmailProvider({ apiKey: resendApiKey });
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeProjectType = escapeHtml(projectType || "Non precise");
  const safeBudget = escapeHtml(budget || "Non precise");
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  const emailBody = {
    from: contactFromEmail,
    to: contactToEmail,
    replyTo: email,
    subject: `Nouvelle demande Arkanya - ${name}`,
    text: [
      "Nouvelle demande de contact",
      `Nom : ${name}`,
      `Email : ${email}`,
      `Type de projet : ${projectType || "Non precise"}`,
      `Budget : ${budget || "Non precise"}`,
      "",
      "Message :",
      message,
    ].join("\n"),
    html: `
      <h2>Nouvelle demande de contact</h2>
      <p><strong>Nom :</strong> ${safeName}</p>
      <p><strong>Email :</strong> ${safeEmail}</p>
      <p><strong>Type de projet :</strong> ${safeProjectType}</p>
      <p><strong>Budget :</strong> ${safeBudget}</p>
      <p><strong>Message :</strong></p>
      <p>${safeMessage}</p>
    `,
  };

  console.log("[Contact API] Resend email body:", emailBody);

  const resendResponse = await emailProvider.sendEmail(emailBody);

  console.log("[Contact API] Resend response:", resendResponse);

  if (!resendResponse.ok) {
    console.error("[Contact API] Resend error:", resendResponse.error);

    return NextResponse.json({ message: "L'envoi du message a echoue." }, { status: 502 });
  }

  console.log("[Contact API] Message sent successfully");

  return NextResponse.json({ message: "Message envoye." });
}
