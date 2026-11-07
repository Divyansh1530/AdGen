import { Check, Download, Film, Heart, Layers, Loader2, RefreshCw, Trash2 } from "lucide-react";
import type { GeneratedAsset, Project } from "../types/project";

export interface AssetGallerySectionProps {
  assets: GeneratedAsset[];
  currentProject: Project | null;
  activeTab: "stills" | "video";
  setActiveTab: (tab: "stills" | "video") => void;
  ratios: string[];
  selectedRatio: string;
  setSelectedRatio: (ratio: string) => void;
  busy: boolean;
  onReRoll: () => void;
  onToggleFavorite: (assetId: string) => void;
  onDeleteAsset: (assetId: string) => void;
  onGenerateVideo: (assetId: string) => void;
  onDownload: (url: string, name: string) => void;
  generatingVideoForId: string | null;
}

export function AssetGallerySection({
  assets,
  currentProject,
  activeTab,
  setActiveTab,
  ratios,
  selectedRatio,
  setSelectedRatio,
  busy,
  onReRoll,
  onToggleFavorite,
  onDeleteAsset,
  onGenerateVideo,
  onDownload,
  generatingVideoForId,
}: AssetGallerySectionProps) {
  if (assets.length === 0) return null;

  const imageAssets = assets.filter((a) => a.type === "IMAGE");
  const videoAssets = assets.filter((a) => a.type === "VIDEO");

  return (
    <section className="mt-16 border-t border-hairline pt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label-mono">Generated Output</p>
          <h2 className="mt-2 text-2xl font-semibold">
            {currentProject?.name || "Your finished ad campaign"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex border border-hairline bg-ink p-1">
            <button
              type="button"
              onClick={() => setActiveTab("stills")}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "stills" ? "bg-surface text-foreground" : "text-muted-foreground"
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-primary" /> Stills ({imageAssets.length})
            </button>
            {videoAssets.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab("video")}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === "video" ? "bg-surface text-foreground" : "text-muted-foreground"
                }`}
              >
                <Film className="h-3.5 w-3.5 text-primary" /> Motion Video ({videoAssets.length})
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onReRoll}
            disabled={busy}
            className="inline-flex items-center gap-1.5 border border-hairline px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Re-roll
          </button>
        </div>
      </div>

      {/* Aspect Ratio Switcher */}
      <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-hairline pb-4">
        <span className="label-mono mr-2">Preview Ratio:</span>
        {ratios.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setSelectedRatio(r)}
            className={`px-3 py-1 font-mono text-[11px] transition-colors cursor-pointer ${
              selectedRatio === r
                ? "border border-primary bg-primary/20 text-primary"
                : "border border-hairline text-muted-foreground hover:text-foreground"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {activeTab === "stills" ? (
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {imageAssets.map((asset, index) => {
            const titles = ["Hero Studio", "Editorial Close-Up", "Minimal Still-Life"];
            const subtitles = [
              "Bold product focus with cinematic lighting",
              "Model spotlight with soft warm grade",
              "Clean studio backdrop with shadow play",
            ];
            const badges = ["CONCEPT A", "CONCEPT B", "CONCEPT C"];
            const headlines = [
              "THE DAILY RADIANCE BOTTLE",
              "GLOW THAT SPEAKS FOR ITSELF",
              "PURE FORMULA. ZERO FILLERS.",
            ];

            const title = titles[index % titles.length] || "Ad Creative";
            const subtitle = subtitles[index % subtitles.length] || "Editorial Ad Concept";
            const badge = badges[index % badges.length] || "CONCEPT";
            const headline = headlines[index % headlines.length] || "THE RADIANCE BOTTLE";

            return (
              <div
                key={asset.id}
                className={`group relative border bg-surface/30 transition-all ${
                  asset.isSelected
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-hairline"
                }`}
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-[4/5] w-full overflow-hidden bg-ink">
                    <img
                      src={asset.url}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <span className="absolute top-3 left-3 bg-ink/80 px-2 py-1 font-mono text-[10px] tracking-wider text-primary backdrop-blur">
                    {badge}
                  </span>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(asset.id)}
                      className={`grid h-7 w-7 place-items-center backdrop-blur transition-colors cursor-pointer ${
                        asset.isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-ink/80 text-muted-foreground hover:text-foreground"
                      }`}
                      title={asset.isSelected ? "Selected hero image" : "Mark as hero"}
                    >
                      <Heart className={`h-3.5 w-3.5 ${asset.isSelected ? "fill-current" : ""}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteAsset(asset.id)}
                      className="grid h-7 w-7 place-items-center bg-ink/80 text-muted-foreground hover:text-destructive backdrop-blur transition-colors cursor-pointer"
                      title="Delete image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold">{title}</h3>
                    {asset.isSelected && (
                      <span className="flex items-center gap-1 font-mono text-[10px] text-primary">
                        <Check className="h-3 w-3" /> HERO
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>

                  <div className="mt-4 border-t border-hairline pt-3">
                    <p className="label-mono">Overlay copy</p>
                    <p className="mt-1 text-xs font-semibold tracking-wide text-foreground">
                      "{headline}"
                    </p>
                    <p className="mt-0.5 text-[11px] text-primary">Shop The Formula →</p>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onDownload(asset.url, title)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 border border-hairline bg-ink px-3 py-2 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" /> Export ({selectedRatio})
                    </button>
                    <button
                      type="button"
                      onClick={() => onGenerateVideo(asset.id)}
                      disabled={generatingVideoForId === asset.id}
                      className="inline-flex items-center justify-center gap-1.5 border border-hairline bg-surface px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors cursor-pointer disabled:opacity-60"
                      title="Generate motion video from this still"
                    >
                      {generatingVideoForId === asset.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Film className="h-3.5 w-3.5" />
                      )}
                      <span>Video</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {videoAssets.map((vid, idx) => (
            <div
              key={vid.id}
              className="border border-hairline bg-surface/30 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden border border-hairline bg-ink">
                  <video
                    src={vid.url}
                    controls
                    className="h-full w-full object-cover"
                    playsInline
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="font-display text-lg font-semibold">Motion Cut #{idx + 1}</p>
                  <button
                    type="button"
                    onClick={() => onDeleteAsset(vid.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer"
                    title="Delete video"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Rendered with cinematic camera pan, soft light sweep, and product focus.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onDownload(vid.url, `Motion Cut ${idx + 1}`)}
                className="mt-5 inline-flex items-center justify-center gap-2 bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Download className="h-4 w-4" /> Download MP4 Video (1080p)
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AssetGallerySection;
