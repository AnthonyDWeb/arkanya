import Link from "next/link";
import services from "@/data/services.json";
import InfoTooltip from "@/components/ui/InfoTooltip";

export default function ServicesTable() {
  return (
    <div className="mt-12 overflow-x-auto">
      <div className="min-w-[700px]">
        <table className="w-full border border-[#EDEDED] rounded-xl overflow-hidden">
          <thead className="bg-[#F9F9F9] text-[#444444]">
            <tr>
              <th className="p-4 text-left">Prestations</th>
              <th className="p-4 text-center">Tarif</th>
              <th className="p-4 text-center">Après crédit</th>
              <th className="p-4 text-center">Éligible</th>
              <th className="p-4 text-center">Réserver</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service, index) => {
              const isSAP = service.category === "sap";
              const pricing = service.pricing;

              return (
                <tr
                  key={service.slug}
                  className={`border-t border-[#EDEDED] ${
                    index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
                  }`}
                >
                  <td className="p-4">
                    <div className="font-semibold text-[#809877]">{service.title}</div>

                    {pricing.options && (
                      <div className="text-xs text-[#666] mt-1 space-y-1">
                        {pricing.options.map((opt, i) => (
                          <div key={i}>• {opt}</div>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    {pricing.variants ? (
                      <div className="text-sm space-y-4">
                        {pricing.variants.map((variant, i) => (
                          <div key={i} className="flex items-center justify-center gap-2">
                            {variant.label}
                            <InfoTooltip content={variant.description} />:{" "}
                            <strong>{variant.price}</strong>
                          </div>
                        ))}
                      </div>
                    ) : (
                      pricing.base
                    )}
                  </td>

                  <td className="p-4 text-center">
                    {isSAP && pricing.reduced ? (
                      <span className="font-semibold text-[#809877]">{pricing.reduced}</span>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-4 text-center">
                    {isSAP ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm">
                        Oui
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-md text-sm">
                        Non
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <Link
                      href={`/contact?service=${service.slug}`}
                      className="
                                            px-4 py-2 rounded-md text-sm font-medium
                                            bg-[#809877] text-white
                                            hover:bg-[#6c8064] transition
                                        "
                    >
                      Réserver
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
