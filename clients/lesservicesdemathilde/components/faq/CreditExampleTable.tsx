export default function CreditExampleTable() {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full text-left border border-[#EDEDED] rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-[#F9F9F9] text-[#809877]">
            <th className="p-3 font-semibold">Prestation</th>
            <th className="p-3 font-semibold">Tarif réel</th>
            <th className="p-3 font-semibold">Après crédit d’impôt</th>
          </tr>
        </thead>

        <tbody className="text-[#444444]">
          <tr className="border-t border-[#EDEDED]">
            <td className="p-3">1h ménage</td>
            <td className="p-3">20€</td>
            <td className="p-3 font-semibold text-[#809877]">10€</td>
          </tr>

          <tr className="border-t border-[#EDEDED]">
            <td className="p-3">2h ménage</td>
            <td className="p-3">40€</td>
            <td className="p-3 font-semibold text-[#809877]">20€</td>
          </tr>

          <tr className="border-t border-[#EDEDED]">
            <td className="p-3">2h garde d’enfants</td>
            <td className="p-3">40€</td>
            <td className="p-3 font-semibold text-[#809877]">20€</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
