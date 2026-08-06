import FiscalBanner from "@/components/FiscalBanner";
import PriceCard from "@/components/pricing/PriceCard";

export default function PricingSection() {
  return (
    <section className="py-16 md:py-20 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        <h1
          className="text-4xl font-bold text-center mb-2"
          style={{
            background: "linear-gradient(135deg, #809877, #C8B76A, #E8B79C)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Tarifs des prestations
        </h1>
      </div>

      <FiscalBanner compact text="Grâce au crédit d’impôt, vous ne payez que 50% du prix !" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-10">
        <div
          className="
                    bg-white border border-[#E5E5E5]
                    shadow-sm rounded-2xl p-8 text-center
                    flex flex-col gap-4 items-center
                "
        >
          <h2 className="text-2xl font-semibold" style={{ color: "#809877" }}>
            Des tarifs simples et transparents
          </h2>

          <p className="text-neutral-700">
            Les prestations à domicile bénéficient d’un crédit d’impôt de 50%.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mt-14">
          <PriceCard
            title="Entretien du domicile"
            slug="menage-entretien"
            image="/images/femme_de_menage.jpg"
            details={["Ménage complet", "Entretien régulier", "Repassage possible"]}
          />

          <PriceCard
            title="Aide à la personne"
            slug="aide-personne"
            image="/images/aide_personne.webp"
            details={[
              "Préparation des repas",
              "Présence et compagnie",
              "Surveillance du bien-être",
            ]}
          />

          <PriceCard
            title="Garde d’enfants"
            slug="garde-enfants"
            image="/images/garde_enfants.png"
            details={["Surveillance", "Activités adaptées", "Accompagnement quotidien"]}
          />

          <PriceCard
            title="Garde d’animaux & surveillance"
            slug="garde-animaux"
            image="/images/animaux.webp"
            details={["Visite à domicile", "Nourrissage", "Surveillance du logement"]}
          />
        </div>
      </div>
    </section>
  );
}
