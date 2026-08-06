import Hero from "@/components/home/Hero";
import FiscalBanner from "@/components/FiscalBanner";
import ContactCTA from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <div className="relative text-[#444444]">
      <Hero />
      <FiscalBanner delay={2.7} duration={0.7} />
      <ContactCTA />
    </div>
  );
}
