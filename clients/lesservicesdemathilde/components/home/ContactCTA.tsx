import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="contact-reveal py-14 md:py-18 text-center w-full px-4 sm:px-6">
      <h2
        className="text-2xl font-bold mb-5"
        style={{
          background: "linear-gradient(135deg, #809877, #C8B76A, #E8B79C)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Informations pratiques
      </h2>

      <p className="text-[#444444] mb-3">Auto-entrepreneuse déclarée</p>

      <p className="text-[#444444] mb-6">✔ Éligible au crédit d’impôt (50% déductible)</p>

      <Link
        href="/contact"
        className="
                    inline-block px-8 py-4 text-lg text-white font-semibold rounded-lg
                    transition-all duration-300
                    hover:scale-[1.04]
                    active:scale-[0.98]
                    hover:shadow-lg
                "
        style={{
          background: "linear-gradient(135deg, #809877, #6d8660)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        }}
      >
        Prendre contact
      </Link>
    </section>
  );
}
