import offers from "@/data/business-offers.json"

type BusinessOffersProps = {
  templateId: string
  clientCompany: string | null
}

export function ProjectBusinessPanel({ templateId, clientCompany }: BusinessOffersProps) {
  const offer =
    offers.templateOffers[templateId as keyof typeof offers.templateOffers] ?? null

  return (
    <div className="max-w-2xl space-y-5">
      {offer ? (
        <div className="p-4 bg-zinc-800/40 border border-zinc-700/40 rounded-lg space-y-2">
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider">Offre liée au template</p>
          <p className="text-sm font-medium text-zinc-100">{offer.title}</p>
          <p className="text-xs text-zinc-400">{offer.description}</p>
          <p className="text-sm text-brand font-medium">{offer.price}</p>
          {clientCompany && (
            <p className="text-xs text-zinc-500 pt-1">Client : {clientCompany}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-zinc-600">
          Aucune offre catalogue associée au template <code className="text-zinc-500">{templateId}</code>.
        </p>
      )}

      <div>
        <h2 className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
          Catalogue Arkanya
        </h2>
        <div className="rounded-lg border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden">
          {offers.solutions.map((s) => (
            <div key={s.slug} className="px-3 py-2.5 flex items-start justify-between gap-3 bg-zinc-900/40">
              <div className="min-w-0">
                <p className="text-sm text-zinc-200">{s.title}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{s.tagline}</p>
              </div>
              <span className="text-xs text-zinc-300 shrink-0 whitespace-nowrap">{s.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
