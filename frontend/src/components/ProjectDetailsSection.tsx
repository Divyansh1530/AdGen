import { Sparkles, Loader2 } from "lucide-react";

export const RATIOS = ["9:16", "4:5", "1:1", "16:9", "2:3", "3:2", "4:3"];

export interface ProjectDetailsSectionProps {
  projectName: string;
  setProjectName: (name: string) => void;
  productName: string;
  setProductName: (name: string) => void;
  ratios: string[];
  toggleRatio: (ratio: string) => void;
  generateVideoCut: boolean;
  setGenerateVideoCut: (checked: boolean) => void;
  direction: string;
  setDirection: (direction: string) => void;
  busy: boolean;
  stepText: string;
  onSubmit: () => void;
}

export function ProjectDetailsSection({
  projectName,
  setProjectName,
  productName,
  setProductName,
  ratios,
  toggleRatio,
  generateVideoCut,
  setGenerateVideoCut,
  direction,
  setDirection,
  busy,
  stepText,
  onSubmit,
}: ProjectDetailsSectionProps) {
  return (
    <aside className="border border-hairline bg-surface/40 p-6">
      <p className="label-mono">Campaign & Output Settings</p>

      {/* Campaign Name */}
      <div className="mt-4">
        <label htmlFor="campaign-name" className="text-xs font-medium text-muted-foreground">
          Campaign Name
        </label>
        <input
          id="campaign-name"
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="e.g. Summer Glow Serum"
          className="mt-1.5 w-full border border-hairline bg-ink px-3 py-2 text-xs outline-none focus:border-primary/60"
        />
      </div>

      {/* Product Name */}
      <div className="mt-3">
        <label htmlFor="product-name" className="text-xs font-medium text-muted-foreground">
          Product Name
        </label>
        <input
          id="product-name"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="e.g. Radiance Serum"
          className="mt-1.5 w-full border border-hairline bg-ink px-3 py-2 text-xs outline-none focus:border-primary/60"
        />
      </div>

      {/* Aspect Ratio Chips */}
      <div>
        <p className="mt-5 text-sm font-medium">Aspect ratios</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {RATIOS.map((r) => {
            const on = ratios.includes(r);
            return (
              <button
                key={r}
                type="button"
                onClick={() => toggleRatio(r)}
                className={`px-3 py-1.5 font-mono text-[12px] tracking-wider transition-colors cursor-pointer ${
                  on
                    ? "bg-primary text-primary-foreground"
                    : "border border-hairline text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Video Cut Checkbox */}
      <label className="mt-5 flex cursor-pointer items-start gap-3 border border-hairline p-3.5">
        <input
          type="checkbox"
          checked={generateVideoCut}
          onChange={(e) => setGenerateVideoCut(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[var(--primary)] cursor-pointer"
        />
        <span>
          <span className="block text-sm font-medium">Also cut a short ad video</span>
          <span className="mt-1 block text-[13px] text-muted-foreground">
            12s motion cut, camera movement, adds video asset.
          </span>
        </span>
      </label>

      {/* Scene Direction */}
      <p className="mt-5 text-sm font-medium">Scene direction</p>
      <textarea
        value={direction}
        onChange={(e) => setDirection(e.target.value)}
        rows={3}
        placeholder="e.g. warm evening light, matte charcoal backdrop, editorial close-up"
        className="mt-2.5 w-full resize-none border border-hairline bg-ink p-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-primary/60"
      />

      {/* Submit Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={busy}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {stepText || "Processing run..."}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" /> Generate 3 ads (3 credits)
          </>
        )}
      </button>

      {/* Generation Status */}
      {busy ? (
        <div className="mt-4 flex flex-col items-center gap-2 border border-primary/20 bg-primary/5 p-3 text-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="font-mono text-xs text-primary">
              {stepText || "Processing run..."}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Please keep this window open while AI generates your campaign assets.
          </p>
        </div>
      ) : (
        <p className="label-mono mt-3 text-center">
          Uses mock generation · Real Cloudinary storage
        </p>
      )}
    </aside>
  );
}

export default ProjectDetailsSection;
