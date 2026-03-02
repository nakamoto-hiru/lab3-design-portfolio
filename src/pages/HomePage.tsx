import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Hero from "@/components/home/Hero";
import ProjectGrid from "@/components/home/ProjectGrid";
import ProjectModal from "@/components/home/ProjectModal";
import { projects } from "@/content/loader";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectSlug = searchParams.get("project");
  const activeProject = projects.find((p) => p.meta.slug === projectSlug) ?? null;

  const handleProjectClick = useCallback(
    (slug: string) => {
      setSearchParams({ project: slug });
    },
    [setSearchParams],
  );

  const handleClose = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return (
    <>
      <Hero />
      <ProjectGrid onProjectClick={handleProjectClick} />
      <ProjectModal project={activeProject} onClose={handleClose} />
    </>
  );
}
