import type { Metadata } from "next"

export const metadata: Metadata = { title: "Maintenance" }

export default function MaintenancePage() {
  return (
    <div>
      <div className="px-4 lg:px-6 h-16 flex flex-col justify-center border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Maintenance</h1>
      </div>
      <div className="p-6">
        <p className="text-sm text-zinc-600">Disponible en Phase 1+</p>
      </div>
    </div>
  )
}
