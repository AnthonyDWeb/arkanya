import Container from "../ui/Container";
import TitleHorizonLine from "@/components/effects/TitleHorizonLine";
import ExternalLink from "../ui/ExternalLink";

export default function CTA() {
  return (
    <section className="py-20">
      <Container>
        <div className="flex items-center justify-center gap-6 mb-8">
          <TitleHorizonLine />

          <h2 className="text-2xl md:text-3xl font-semibold text-white whitespace-nowrap">
            Envie de créer un projet ?
          </h2>

          <TitleHorizonLine />
        </div>

        <div className="relative w-fit mx-auto">
          <div
            className="
                        absolute
                        inset-0
                        blur-2xl
                        opacity-60
                        bg-[radial-gradient(circle,rgba(74,222,128,0.6),transparent_70%)]
                        "
          />

          <ExternalLink href="https://arkanya.fr/contact">
            <button
              className="
                            relative
                            px-10
                            py-3
                            rounded-lg
                            font-medium
                            bg-green-400
                            text-black
                            hover:bg-green-300
                            transition
                            duration-300
                            cursor-pointer
                            "
            >
              Contacter Arkanya
            </button>
          </ExternalLink>
        </div>

        <p className="text-center text-neutral-400 mt-12">Site conçu et développé par Arkanya</p>
      </Container>
    </section>
  );
}
