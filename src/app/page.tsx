import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { DsaDashboard } from "@/components/sections/dsa-dashboard";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Experience } from "@/components/sections/experience";
import { Certifications } from "@/components/sections/certifications";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full overflow-x-hidden">
      <Hero />
      <About />
      <Skills />
      <DsaDashboard />
      <FeaturedProjects />
      <Experience />
      <Certifications />
      <Contact />
    </main>
  );
}
