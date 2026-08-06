import Image from "next/image";

interface FiscalBannerProps {
  compact?: boolean;
  text?: string;
  delay?: number;
  duration?: number;
}

export default function FiscalBanner({
  compact,
  text,
  delay = 0,
  duration = 0.5,
}: FiscalBannerProps) {
  const textStyle = compact
    ? { color: "#444444" }
    : {
        background: "linear-gradient(135deg, #809877, #C8B76A, #E8B79C)",
        WebkitBackgroundClip: "text",
        color: "transparent",
      };

  return (
    <div
      className="banner-reveal"
      style={{
        animation: `expandCenter ${duration}s ease-out ${delay}s forwards`,
        transformOrigin: "center",
        transform: "scaleY(0)",
        opacity: 0,
      }}
    >
      <div
        className={`
                    w-full
                    ${compact ? "py-4" : "py-10"}
                    px-4 sm:px-6 md:px-6
                    backdrop-blur-md shadow-sm
                `}
        style={{
          backgroundColor: "#F9F9F9",
          borderTop: "1px solid rgba(200,183,106,0.6)",
          borderBottom: "1px solid rgba(200,183,106,0.6)",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* LEFT IMAGE */}
          <div className="w-20 h-16 md:w-32 md:h-24 relative">
            <Image
              src="/images/services_a_la_personne.png"
              alt="Services à la personne"
              fill
              className="object-contain"
            />
          </div>

          {/* TEXT */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-base md:text-xl font-medium" style={textStyle}>
              {text ?? "Bénéficiez de 50% de crédit d’impôt"}
            </p>

            {!compact && (
              <>
                <p className="text-sm opacity-80">
                  Réduction immédiate sur vos services à domicile
                </p>

                <p className="text-sm font-semibold text-[#809877]">
                  Exemple : 20€/h → 10€/h après réduction
                </p>
              </>
            )}
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-20 h-16 md:w-32 md:h-24 relative">
            <Image
              src="/images/credit_impots.png"
              alt="Crédit d'impôt 50%"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
