import type { Metadata } from "next"

export const metadata: Metadata = { title: "Paramètres" }

export default function SettingsPage() {
  return (
    <div>
      <div className="px-4 lg:px-6 h-16 flex flex-col justify-center border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Paramètres</h1>
      </div>
      <div className="p-6">
        <p className="text-sm text-zinc-600">Disponible en Phase 1+</p>
      </div>
    </div>
  )
}
