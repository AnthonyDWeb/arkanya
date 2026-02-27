import {ContactPayload} from "@/types";

export async function sendEmail(payload: ContactPayload) {
    const res = await fetch("/api/contact", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Erreur serveur");
    return res.json();
}
