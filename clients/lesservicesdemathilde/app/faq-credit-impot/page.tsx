import SectionTitle from "@/components/SectionTitle";
import FiscalBanner from "@/components/FiscalBanner";
import InfoCard from "@/components/faq/InfoCard";
import CreditExampleTable from "@/components/faq/CreditExampleTable";
import FAQAccordion from "@/components/faq/FAQAccordion";
import ContactCTA from "@/components/home/ContactCTA";

import { Calculator, CheckCircle, Percent } from "@arkanya/icons";

export default function FAQCreditImpotsPage() {
  const faqItems = [
    {
      question: "Dois-je avancer la totalité du montant ?",
      answer: "Non, grâce au crédit d’impôt, vous ne payez que la moitié immédiatement.",
    },
    {
      question: "Suis-je automatiquement éligible ?",
      answer:
        "Oui, tous les foyers fiscaux en France bénéficient du crédit d’impôt pour les services à domicile.",
    },
    {
      question: "Le crédit d’impôt fonctionne-t-il aussi pour la garde d’enfants ?",
      answer:
        "Oui, pour les enfants de plus de 3 ans. Avant 3 ans, c’est la CAF (PAJE) qui prend le relais.",
    },
    {
      question: "Dois-je envoyer un justificatif ?",
      answer:
        "Non, un justificatif annuel vous sera transmis automatiquement pour votre déclaration.",
    },
  ];

  return (
    <div className="min-h-screen w-full mx-auto text-[#444444] px-4 sm:px-6 py-16">
      {/* TITRE */}
      <SectionTitle>Crédit d’impôt : tout comprendre</SectionTitle>

      {/* BANNIÈRE COMPACTE */}
      <FiscalBanner compact text="Grâce au crédit d’impôt, vous ne payez que 10€/h seulement !" />

      {/* CARDS PÉDAGOGIQUES */}
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard icon={<Percent />} title="C’est quoi le crédit d’impôt ?">
          L’État prend en charge 50% du coût de vos prestations. Cela réduit immédiatement votre
          facture de moitié.
        </InfoCard>

        <InfoCard icon={<CheckCircle />} title="Comment ça fonctionne ?">
          Vous êtes automatiquement éligible. Aucun document compliqué, la réduction s&apos;applique
          directement.
        </InfoCard>

        <InfoCard icon={<Calculator />} title="Exemple concret">
          1h à 20€ → <strong className="text-[#809877]">10€</strong>
          <br />
          2h à 40€ → <strong className="text-[#809877]">20€</strong>
        </InfoCard>
      </div>

      {/* TABLEAU DES EXEMPLES */}
      <div className="max-w-4xl mx-auto mt-14">
        <CreditExampleTable />
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <FAQAccordion items={faqItems} />
      </div>

      {/* CTA FINAL */}
      <ContactCTA />
    </div>
  );
}
