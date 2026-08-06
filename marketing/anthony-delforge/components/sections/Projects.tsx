import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import ProjectCard from "../ui/ProjectCard";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <section id="projects" className="section">
      <Container>
        <SectionTitle>Projets</SectionTitle>

        <div className="grid md:grid-cols-2 gap-10 mt-12">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
