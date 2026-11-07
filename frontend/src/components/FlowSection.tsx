import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import rawProduct from "../../assets/images/raw-product.jpg";
import generatedAd from "../../assets/images/generated-ad.jpg";

export function FlowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const steps = [
    { n: "01", t: "Upload", d: "A product shot and a model shot. Phone photos are fine." },
    { n: "02", t: "Compose", d: "Subject, product and scene get relit into one frame." },
    { n: "03", t: "Grade", d: "Colour, grain and depth pushed to campaign standard." },
    { n: "04", t: "Deliver", d: "Three stills and a cut video, every ratio you asked for." },
  ];

  const active = Math.min(3, Math.floor(progress * 4));

  return (
    <section ref={ref} className="relative h-[260vh] border-b border-hairline">
      <div className="sticky top-16 overflow-hidden">
        <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label-mono">The pipeline</p>
              <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] leading-[1.02] font-semibold">
                Flat photo in. <span className="text-primary">Finished ad</span> out.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Scroll to watch a plain catalogue frame get taken apart and rebuilt as a paid-media
              asset.
            </p>
          </div>

          <div className="mt-10 grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
            <FlowFrame
              label="input · product.jpg"
              src={rawProduct}
              alt="Plain product photo before generation"
              grayscale={1 - progress}
            />

            <div className="relative hidden h-40 w-px overflow-hidden bg-hairline lg:block">
              <span
                className="absolute inset-x-[-2px] h-10 bg-primary blur-[2px]"
                style={{ animation: "sweep 2.6s cubic-bezier(0.65,0,0.35,1) infinite" }}
              />
            </div>
            <div className="relative flex items-center justify-center lg:hidden">
              <span className="label-mono">↓ rendering ↓</span>
            </div>

            <div className="relative">
              <FlowFrame
                label="output · ad_01.jpg"
                src={generatedAd}
                alt="Generated advertisement creative"
                grayscale={0}
                reveal={progress}
                accent
              />
              <div
                className="pointer-events-none absolute inset-x-0 h-[2px] bg-primary"
                style={{
                  top: `${Math.min(100, progress * 100)}%`,
                  opacity: progress > 0.02 && progress < 0.98 ? 1 : 0,
                  boxShadow: "0 0 24px 4px color-mix(in oklab, var(--primary) 60%, transparent)",
                }}
              />
            </div>
          </div>

          <ol className="mt-10 grid gap-px border border-hairline bg-hairline sm:grid-cols-4">
            {steps.map((s, i) => (
              <li
                key={s.n}
                className="bg-ink px-4 py-5 transition-colors duration-500"
                style={{
                  backgroundColor: i <= active ? "var(--surface)" : "var(--ink)",
                }}
              >
                <span
                  className="font-mono text-[11px] tracking-widest"
                  style={{ color: i <= active ? "var(--primary)" : "var(--muted-foreground)" }}
                >
                  {s.n}
                </span>
                <p className="mt-2 font-display text-base font-semibold">{s.t}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function FlowFrame({
  label,
  src,
  alt,
  grayscale,
  reveal,
  accent,
}: {
  label: string;
  src: string;
  alt: string;
  grayscale: number;
  reveal?: number;
  accent?: boolean;
}) {
  return (
    <figure
      className={`relative overflow-hidden border ${accent ? "border-primary/40" : "border-hairline"} bg-surface`}
    >
      <div className="aspect-[4/5] w-full overflow-hidden">
        <img
          src={src}
          alt={alt}
          width={912}
          height={1104}
          loading="lazy"
          className="h-full w-full object-cover transition-[filter] duration-300"
          style={{
            filter: `grayscale(${grayscale}) contrast(${1 + (1 - grayscale) * 0.06})`,
            clipPath: reveal !== undefined ? `inset(0 0 ${(1 - reveal) * 100}% 0)` : undefined,
          }}
        />
      </div>
      <figcaption className="flex items-center justify-between border-t border-hairline px-3 py-2">
        <span className="label-mono">{label}</span>
        {accent && <Sparkles className="h-3.5 w-3.5 text-primary" />}
      </figcaption>
    </figure>
  );
}

export default FlowSection;
