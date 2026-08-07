import { NextResponse } from "next/server"
import { readTemplates } from "@/lib/catalogue/load-manifests"

export type {
  TemplateConfigField,
  TemplatePage,
  TemplateSummary,
} from "@/types/catalogue"

export async function GET() {
  try {
    return NextResponse.json(readTemplates())
  } catch {
    return NextResponse.json({ error: "Erreur lecture templates" }, { status: 500 })
  }
}
