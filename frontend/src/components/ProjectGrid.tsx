import { Link } from "react-router-dom";
import { FolderKanban, Plus, Sparkles, Loader2 } from "lucide-react";
import type { Project } from "../types/project";
import { ProjectCard } from "./ProjectCard";

export interface ProjectGridProps {
  projects: Project[];
  loading: boolean;
  onDelete: (id: string, name: string) => void;
  onRename: (id: string, newName: string) => Promise<void>;
}

export function ProjectGrid({ projects, loading, onDelete, onRename }: ProjectGridProps) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-8">
        <div>
          <p className="label-mono">Campaign Library</p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] leading-[1] font-semibold">
            Your AdGen Campaigns
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Review, edit, and export previously generated ad runs and creative sets.
          </p>
        </div>

        <Link
          to="/create"
          className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </Link>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Loading your campaigns...</span>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-16 border border-dashed border-hairline p-12 text-center">
          <FolderKanban className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <h3 className="mt-4 font-display text-lg font-semibold">No campaigns yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload two photos to generate three ad creatives and a short video.
          </p>
          <Link
            to="/create"
            className="mt-6 inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Create your first campaign
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} onDelete={onDelete} onRename={onRename} />
          ))}
        </div>
      )}
    </>
  );
}

export default ProjectGrid;
