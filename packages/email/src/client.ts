export type EmailRequestResult = {
  ok?: boolean
  error?: string
}

async function parseResponseJson(response: Response): Promise<EmailRequestResult> {
  try {
    return (await response.json()) as EmailRequestResult
  } catch {
    return {}
  }
}

export async function sendEmailRequest<TPayload>(
  endpoint: string,
  payload: TPayload,
): Promise<EmailRequestResult> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const data = await parseResponseJson(response)

  if (!response.ok) {
    throw new Error(data.error || "Erreur serveur")
  }

  return data
}
