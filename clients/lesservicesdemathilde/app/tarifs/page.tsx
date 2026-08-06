"use client";

import { useEffect } from "react";
import SectionTitle from "@/components/SectionTitle";
import FiscalBanner from "@/components/FiscalBanner";
import ContactCTA from "@/components/home/ContactCTA";
import ServicesTable from "@/components/pricing/ServicesTable";

export default function TarifsPage() {
  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full text-[#444444] px-4 sm:px-6 py-16">
      {/* TITRE */}
      <div className="pricing-title">
        <SectionTitle main>Tarifs des prestations</SectionTitle>
      </div>

      {/* TEXTE */}
      <p className="pricing-text text-center max-w-2xl mx-auto text-lg text-[#555] mt-4">
        Des services à domicile simples, accessibles et transparents. Grâce au crédit d’impôt, vous
        ne payez que 50% du prix.
      </p>

      {/* BANNER */}
      <div className="mt-10">
        <FiscalBanner
          text="50% de crédit d’impôt immédiat sur les services à domicile"
          delay={0.7}
          duration={0.35}
        />
      </div>

      {/* CARDS */}
      <div className="max-w-5xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="pricing-card bg-white border border-[#EDEDED] p-6 rounded-xl text-center"
            style={{
              animationDelay: `${0.5 + index * 0.4}s`,
            }}
          >
            {index === 0 && (
              <>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "#809877" }}>
                  1. Vous réservez
                </h3>
                <p className="text-sm text-[#555]">Choisissez le service adapté à vos besoins.</p>
              </>
            )}

            {index === 1 && (
              <>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "#809877" }}>
                  2. Intervention
                </h3>
                <p className="text-sm text-[#555]">Une prestation réalisée à votre domicile.</p>
              </>
            )}

            {index === 2 && (
              <>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "#809877" }}>
                  3. Vous payez moins
                </h3>
                <p className="text-sm text-[#555]">Vous bénéficiez de 50% de crédit d’impôt.</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* SECTION PRESTATIONS */}
      <div className="max-w-7xl mx-auto mt-20 pricing-section">
        <h2 className="text-2xl font-semibold text-center mb-10" style={{ color: "#809877" }}>
          Nos prestations et tarifs
        </h2>

        <ServicesTable />
      </div>

      {/* CONTACT (SCROLL) */}
      <div className="mt-20 scroll-reveal">
        <ContactCTA />
      </div>
    </div>
  );
}
