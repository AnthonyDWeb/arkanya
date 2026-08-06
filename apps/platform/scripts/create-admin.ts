/**
 * Script one-shot : crée le premier compte administrateur via Better Auth.
 *
 * Usage :
 *   pnpm --filter @arkanya/platform create-admin <email> <password> [name]
 *
 * Exemple :
 *   pnpm --filter @arkanya/platform create-admin anthony@arkanya.fr MonMotDePasse "Anthony Delforge"
 *
 * Prérequis : apps/platform/.env configuré avec DATABASE_URL et BETTER_AUTH_SECRET.
 */

import { auth } from "../lib/auth"

const [, , email, password, name = "Anthony Delforge"] = process.argv

async function main() {
  if (!email || !password) {
    console.error(
      "Usage : pnpm --filter @arkanya/platform create-admin <email> <password> [name]",
    )
    process.exit(1)
  }

  try {
    const result = await auth.api.signUpEmail({
      body: { email, password, name },
    })

    console.log(`Compte admin créé avec succès.`)
    console.log(`  Email : ${result.user.email}`)
    console.log(`  ID    : ${result.user.id}`)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes("already exists") || message.includes("UNIQUE")) {
      console.error(`Erreur : un compte avec cet email existe déjà.`)
    } else {
      console.error(`Erreur : ${message}`)
    }
    process.exit(1)
  }
}

main()
