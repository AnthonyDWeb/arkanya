import type { Metadata } from "next"

export const metadata: Metadata = { title: "Catalogue" }

export default function CatalogPage() {
  return (
    <div>
      <div className="px-4 lg:px-6 h-16 flex flex-col justify-center border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Catalogue</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Templates, features, services</p>
      </div>
      <div className="p-6">
        <p className="text-sm text-zinc-600">Disponible en Phase 2</p>
      </div>
    </div>
  )
}
