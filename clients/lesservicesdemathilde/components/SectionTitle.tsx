interface SectionTitleProps {
  children: string;
  main?: boolean; // true = style Hero
}

export default function SectionTitle({ children, main }: SectionTitleProps) {
  return (
    <h1
      className={`
                text-center font-bold
                ${main ? "text-4xl md:text-6xl mb-8" : "text-3xl md:text-4xl mb-6"}
            `}
      style={{
        background: "linear-gradient(135deg, #809877, #C8B76A, #E8B79C)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </h1>
  );
}
