import Navbar from "@/components/layout/Navbar";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Expertise from "@/components/sections/Expertise";
import Method from "@/components/sections/Method";
import Projects from "@/components/sections/Projects";
import Stack from "@/components/sections/Stack";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <div className="text-white">
      <Navbar />

      <Hero />

      <Expertise />

      <Projects />

      <Method />

      <About />

      <Stack />

      <CTA />
    </div>
  );
}
