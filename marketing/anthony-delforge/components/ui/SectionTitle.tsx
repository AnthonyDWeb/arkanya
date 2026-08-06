import TitleHorizonLine from "@/components/effects/TitleHorizonLine";

export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex justify-center items-center mb-20">
      <TitleHorizonLine />

      <h2 className="relative z-10 px-6 text-3xl font-semibold text-white">{children}</h2>
      <TitleHorizonLine />
    </div>
  );
}
