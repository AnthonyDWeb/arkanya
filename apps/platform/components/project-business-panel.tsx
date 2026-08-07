import offers from "@/data/business-offers.json"

type BusinessOffersProps = {
  templateId: string
  clientCompany: string | null
}

export function ProjectBusinessPanel({ templateId, clientCompany }: BusinessOffersProps) {
  const offer =
    offers.templateOffers[templateId as keyof typeof offers.templateOffers] ?? null

  return (
    <div className="space-y-3">
      {offer ? (
        <div className="rounded-xl border border-white/[0.08] bg-surface/80 px-2.5 py-2 space-y-1">
          <p className="metric text-[10px] text-zinc-400">Offre liée au modèle</p>
          <p className="text-[13px] font-semibold text-white">{offer.title}</p>
          <p className="text-[11px] text-zinc-400 leading-snug">{offer.description}</p>
          <p className="metric text-[12px] text-brand">{offer.price}</p>
          {clientCompany && (
            <p className="text-[11px] text-zinc-500">Client : {clientCompany}</p>
          )}
        </div>
      ) : (
        <p className="text-[12px] text-zinc-500">
          Aucune offre catalogue associée au modèle{" "}
          <code className="metric text-zinc-400">{templateId}</code>.
        </p>
      )}

      <div>
        <h2 className="metric text-[10px] text-zinc-400 mb-1.5">Catalogue Arkanya</h2>
        <div className="rounded-xl border border-white/[0.08] bg-surface/80 divide-y divide-white/[0.05] overflow-hidden">
          {offers.solutions.map((s) => (
            <div
              key={s.slug}
              className="px-2.5 py-1.5 grid grid-cols-[minmax(0,1fr)_auto] gap-2 items-baseline"
            >
              <div className="min-w-0">
                <p className="text-[12px] text-zinc-100 truncate">{s.title}</p>
                <p className="text-[10px] text-zinc-500 truncate">{s.tagline}</p>
              </div>
              <span className="metric text-[10px] text-brand shrink-0 whitespace-nowrap">
                {s.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
