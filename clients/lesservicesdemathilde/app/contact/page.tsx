import SectionTitle from "@/components/SectionTitle";
import ContactTabsWrapper from "@/components/contact/ContactTabsWrapper";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="w-full mx-auto text-[#444444] px-4 sm:px-6 py-16">
      <div className="contact-title">
        <SectionTitle>Contact & Réservation</SectionTitle>
      </div>

      <div className="max-w-2xl mx-auto">
        <ContactTabsWrapper service={params.service} />
      </div>
    </div>
  );
}
