import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import { stack } from "@/data/stack";

export default function Stack() {
  return (
    <section id="stack" className="section">
      <Container>
        <SectionTitle>Technologies</SectionTitle>

        <div className="flex flex-wrap justify-center gap-6 mt-12">
          {stack.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 border border-[#4ade80] rounded-lg text-neutral-300 hover:bg-[#4ade80] hover:text-black delay-150"
            >
              {tech}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
