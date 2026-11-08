import { Link } from "react-router-dom";
import { useState } from "react";
import { ExternalLink, Edit2, Check, X, Layers, Film, Trash2 } from "lucide-react";
import type { Project } from "../types/project";

export interface ProjectCardProps {
  project: Project;
  onDelete: (id: string, name: string) => void;
  onRename: (id: string, newName: string) => Promise<void>;
}

export function ProjectCard({ project: proj, onDelete, onRename }: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(proj.name);
  const [savingEdit, setSavingEdit] = useState(false);

  const imageCount = proj.generatedAssets?.filter((a) => a.type === "IMAGE").length || 0;
  const videoCount = proj.generatedAssets?.filter((a) => a.type === "VIDEO").length || 0;
  const heroAsset =
    proj.generatedAssets?.find((a) => a.isSelected) ||
    proj.generatedAssets?.find((a) => a.type === "IMAGE") ||
    proj.generatedAssets?.[0];

  const handleSave = async () => {
    if (!editName.trim()) return;
    try {
      setSavingEdit(true);
      await onRename(proj.id, editName.trim());
      setIsEditing(false);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between border border-hairline bg-surface/30 transition-colors hover:border-primary/40">
      <div>
        {/* Visual Preview */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink border-b border-hairline">
          {heroAsset ? (
            <img
              src={heroAsset.url}
              alt={proj.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : proj.productImageUrl ? (
            <img
              src={proj.productImageUrl}
              alt={proj.productName}
              className="h-full w-full object-cover opacity-60"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/40 font-mono text-xs">
              No renders yet
            </div>
          )}

          <span className="absolute top-3 left-3 bg-ink/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary backdrop-blur">
            {proj.status.replace(/_/g, " ")}
          </span>

          <span className="absolute top-3 right-3 bg-ink/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground backdrop-blur">
            {proj.aspectRatio
              .replace("PORTRAIT_", "")
              .replace("SQUARE_", "")
              .replace("LANDSCAPE_", "")
              .replace(/_/g, ":")}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          {isEditing ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 border border-hairline bg-ink px-2.5 py-1 text-sm font-semibold outline-none focus:border-primary/60"
                autoFocus
              />
              <button
                onClick={handleSave}
                disabled={savingEdit}
                className="p-1.5 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                title="Save"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditName(proj.name);
                }}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-base font-semibold leading-tight line-clamp-1">
                {proj.name}
              </h3>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditName(proj.name);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                title="Rename"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <p className="mt-1 font-mono text-[11px] text-muted-foreground">{proj.productName}</p>

          {proj.userPrompt && (
            <p className="mt-2.5 text-xs text-muted-foreground/80 line-clamp-2 italic">
              "{proj.userPrompt}"
            </p>
          )}

          <div className="mt-4 flex items-center gap-3 border-t border-hairline pt-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3 text-primary" />
              {imageCount} stills
            </span>
            <span className="flex items-center gap-1">
              <Film className="h-3 w-3 text-primary" />
              {videoCount} video
            </span>
            <span className="ml-auto font-mono text-[10px]">
              {new Date(proj.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions footer */}
      <div className="flex items-center gap-2 border-t border-hairline p-3 bg-surface/20">
        <Link
          to={`/create?projectId=${proj.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 border border-hairline bg-ink px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Open in Studio
        </Link>
        <button
          onClick={() => onDelete(proj.id, proj.name)}
          className="inline-flex items-center justify-center p-2 border border-hairline bg-ink text-muted-foreground hover:border-destructive/40 hover:text-destructive transition-colors cursor-pointer"
          title="Delete campaign"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
