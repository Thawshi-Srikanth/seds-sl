"use client";

import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/sections/section-header";
import Link from "next/link";
import { fetchProjects, type UnifiedProjectItem } from "@/actions/projects";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

const ProjectCard = ({
  project,
  index,
}: {
  project: UnifiedProjectItem;
  index: number;
}) => {
  const targetLink = project.customLink || `/projects/${project.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="p-6 md:p-8 bg-background group flex flex-col h-full"
    >
      <div className="flex flex-col h-full">
        {project.badgeLabel && (
          <div className="mb-2 text-[10px] font-mono font-bold uppercase text-primary tracking-wider">
            {project.badgeLabel}
          </div>
        )}

        <h3 className="text-xl font-bold mb-3 text-foreground transition-colors group-hover:text-primary">
          {project.name}
        </h3>

        {project.chapterName && (
          <div className="text-sm text-muted-foreground mb-2 font-mono">
            {project.chapterName}
          </div>
        )}

        <p className="text-sm leading-relaxed mb-4 text-muted-foreground flex-1">
          {project?.description?.length > 120
            ? `${project.description.substring(0, 120)}...`
            : project.description}
        </p>

        {/* Bottom Section with Date and Button */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs">
            <Calendar className="size-3.5" />
            <span>
              {new Date(project.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <Link href={targetLink}>
            <Button variant="outline" size="sm" bleed={true}>
              Know More
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export function ProjectsSection() {
  const [projects, setProjects] = useState<UnifiedProjectItem[]>([]);

  useEffect(() => {
    fetchProjects()
      .then((data) => setProjects(data.slice(0, 3)))
      .catch(console.error);
  }, []);

  return (
    <section className="light-mode-section relative w-full pt-8 md:pt-12 lg:pt-16">
      <div className="section-background bg-background dark:bg-black" />
      <div className="grid-container section-content">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <SectionHeader
            title="Ongoing Local Projects & Flagship Initiatives"
            description={
              <>
                Here are our ongoing local projects and flagship space
                initiatives by SEDS Sri Lanka that showcase the organization's
                commitment to advancing space <br />
                exploration and technology:
              </>
            }
            image="/section-header/space-projects-bg.jpeg"
          />

          <div className="mt-12 relative">
            {/* Extended Horizontal Bleed Lines */}
            <div className="absolute -left-6 -right-6 top-0 border-t border-border/60 pointer-events-none" />
            <div className="absolute -left-6 -right-6 bottom-0 border-b border-border/60 pointer-events-none" />

            {/* Extended Vertical Bleed Lines */}
            <div className="absolute -top-6 -bottom-6 left-0 border-l border-border/60 pointer-events-none" />
            <div className="absolute -top-6 -bottom-6 right-0 border-r border-border/60 pointer-events-none" />
            <div className="hidden md:block absolute -top-6 -bottom-6 left-1/2 border-l border-border/40 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 border border-border/60 divide-y divide-border/60 md:divide-y-0 md:divide-x bg-background relative z-0">
              {projects.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx} />
              ))}

              {/* View All Projects Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                <Link
                  href="/projects"
                  className="block h-full group bg-background p-8 flex items-center justify-center"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-bold mb-4 text-foreground">
                      Explore More Projects
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                      Discover all student chapter projects, rovers, and
                      flagship space missions across Sri Lanka.
                    </p>
                    <Button variant="default" size="sm" bleed={true}>
                      View All Projects
                    </Button>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
