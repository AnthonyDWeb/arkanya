import { redirect } from "next/navigation"

export default function MaintenanceRedirectPage() {
  redirect("/console?tab=maintenance")
}
