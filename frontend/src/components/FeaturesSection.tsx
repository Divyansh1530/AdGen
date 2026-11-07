import React from "react";
import { Film, Layers, Ratio, Type as TypeIcon, Wand2 } from "lucide-react";
import { Reveal } from "./Reveal";

export function FeaturesSection() {
  return (
    <section className="border-b border-hairline">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <p className="label-mono">What one run gives you</p>
          <h2 className="mt-3 max-w-2xl text-[clamp(1.9rem,4vw,3rem)] leading-[1.02] font-semibold">
            Not a filter. A whole shoot's worth of deliverables.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px border border-hairline bg-hairline md:grid-cols-6">
          <FeatureCard
            className="md:col-span-4"
            icon={<Layers className="h-5 w-5" />}
            kicker="Stills"
            title="Three distinct ad creatives per run"
            body="Every run returns three separate concepts — a hero close-up, a lifestyle frame and a bold product-forward layout — so you get variants to A/B on day one instead of one lucky image."
            tall
          />
          <FeatureCard
            className="md:col-span-2"
            icon={<Film className="h-5 w-5" />}
            kicker="Motion"
            title="Short ad video"
            body="A 6–15s cut with camera moves, product beats and a clean end card."
            tall
          />
          <FeatureCard
            className="md:col-span-2"
            icon={<Ratio className="h-5 w-5" />}
            kicker="Formats"
            title="Seven aspect ratios"
            body="9:16, 4:5, 1:1, 16:9, 2:3, 3:2 and 4:3 — reframed, not cropped blindly."
          />
          <FeatureCard
            className="md:col-span-2"
            icon={<Wand2 className="h-5 w-5" />}
            kicker="Control"
            title="Scene direction"
            body="Steer mood, lighting, backdrop and season with a single line of text."
          />
          <FeatureCard
            className="md:col-span-2"
            icon={<TypeIcon className="h-5 w-5" />}
            kicker="Copy"
            title="Headline overlays"
            body="Optional on-image headline and CTA, typeset to the frame instead of dumped on it."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  kicker,
  title,
  body,
  className = "",
  tall,
}: {
  icon: React.ReactNode;
  kicker: string;
  title: string;
  body: string;
  className?: string;
  tall?: boolean;
}) {
  return (
    <article
      className={`group relative bg-ink p-6 transition-colors duration-300 hover:bg-surface ${tall ? "sm:p-8" : ""} ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center border border-hairline text-primary transition-colors group-hover:border-primary/50">
          {icon}
        </span>
        <span className="label-mono">{kicker}</span>
      </div>
      <h3 className="mt-5 text-xl leading-snug font-semibold">{title}</h3>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">{body}</p>
      <span className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
    </article>
  );
}

export default FeaturesSection;
