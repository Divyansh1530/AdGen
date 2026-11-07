import { useRef, useState, useCallback, type ReactNode } from "react";
import { ImageUp, User, Wand2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export interface ImageUploadSectionProps {
  productPreview: string | null;
  modelPreview: string | null;
  onSelectProduct: (file: File | null) => void;
  onSelectModel: (file: File | null) => void;
  onLoadPreset: () => void;
}

export function ImageUploadSection({
  productPreview,
  modelPreview,
  onSelectProduct,
  onSelectModel,
  onLoadPreset,
}: ImageUploadSectionProps) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-mono">New run</p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.2rem)] leading-[1] font-semibold">
            Two photos. Then step back.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            JPG or PNG, up to 10MB each. The clearer the product edges, the sharper the composite.
          </p>
        </div>

        {!productPreview && !modelPreview && (
          <button
            type="button"
            onClick={onLoadPreset}
            className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20 cursor-pointer"
          >
            <Wand2 className="h-3.5 w-3.5" />
            Try with sample photos
          </button>
        )}
      </div>

      <div className="mt-10 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
        <Dropzone
          label="01 — Product image"
          hint="The thing you sell, any background"
          icon={<ImageUp className="h-5 w-5" />}
          previewUrl={productPreview}
          onSelect={onSelectProduct}
        />
        <Dropzone
          label="02 — Model image"
          hint="The person holding or wearing it"
          icon={<User className="h-5 w-5" />}
          previewUrl={modelPreview}
          onSelect={onSelectModel}
        />
      </div>
    </div>
  );
}

function Dropzone({
  label,
  hint,
  icon,
  previewUrl,
  onSelect,
}: {
  label: string;
  hint: string;
  icon: ReactNode;
  previewUrl: string | null;
  onSelect: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const handleFiles = useCallback(
    (files?: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("That file isn't an image.");
        return;
      }
      onSelect(file);
    },
    [onSelect],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`relative flex min-h-[380px] flex-col bg-ink p-5 transition-colors ${
        over ? "bg-surface" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="label-mono">{label}</span>
        {previewUrl && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-muted-foreground transition-colors hover:text-destructive cursor-pointer"
            aria-label="Remove image"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`mt-4 flex flex-1 items-center justify-center overflow-hidden border border-dashed transition-colors cursor-pointer ${
          over ? "border-primary" : "border-hairline hover:border-primary/50"
        }`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Uploaded preview" className="h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <span className="grid h-11 w-11 place-items-center border border-hairline text-primary">
              {icon}
            </span>
            <span className="text-sm font-medium">Drop an image or browse</span>
            <span className="text-[13px] text-muted-foreground">{hint}</span>
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

export default ImageUploadSection;
