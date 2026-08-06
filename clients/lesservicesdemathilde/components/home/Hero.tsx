import Link from "next/link";

export default function Hero() {
  return (
    <section className="max-w-3xl mx-auto text-center pt-32 md:pt-40 pb-16 px-6 relative">
      <h1
        className="hero-title text-[2.3rem] leading-tight md:text-6xl font-bold mb-8 md:mb-10"
        style={{
          background: "linear-gradient(135deg, #809877, #C8B76A, #E8B79C)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Les Services de Mathilde
      </h1>

      <p className="hero-text text-lg md:text-xl text-[#444444] mb-10 max-w-2xl mx-auto">
        Ménage professionnel et garde d&apos;enfants à domicile. Un service premium, chaleureux et
        de confiance pour votre quotidien.
      </p>

      <Link
        href="/contact"
        className="
                    hero-cta
                    inline-block px-8 py-3 rounded-lg text-white font-semibold
                    transition-all duration-300
                    hover:scale-[1.04]
                    active:scale-[0.98]
                    hover:shadow-lg
                    mb-8
                "
        style={{
          background: "linear-gradient(135deg, #809877, #6d8660)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        }}
      >
        Demander un devis gratuit
      </Link>

      <div
        className="hero-location mt-3 text-sm md:text-base font-medium"
        style={{ color: "#809877" }}
      >
        📍 La Ferté-Gaucher, Coulommiers et les villes alentours
      </div>
    </section>
  );
}
