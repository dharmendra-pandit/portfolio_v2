import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Skills } from "@/components/sections/skills";
import { DsaDashboard } from "@/components/sections/dsa-dashboard";
import { Certifications } from "@/components/sections/certifications";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/layout/footer";
import statsCache from "@/data/stats-cache.json";

const toInt = (v: unknown) => Number.parseInt(String(v ?? 0), 10) || 0;

// Headline numbers come from the synced stats cache, so they stay in step with the live dashboard.
const heroStats = {
  problemsSolved:
    toInt(statsCache.leetcode?.totalSolved) + toInt(statsCache.code360?.solved) + toInt(statsCache.gfg?.solved),
  publicRepos: toInt(statsCache.github?.publicRepos),
};

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen w-full flex-col overflow-x-clip">
        <Hero stats={heroStats} />
        <About />
        <Experience />
        <FeaturedProjects />
        <Skills />
        <DsaDashboard />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
