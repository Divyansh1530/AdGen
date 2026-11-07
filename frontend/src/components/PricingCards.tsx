import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Reveal } from "./Reveal";

export const plans = [
  {
    name: "Test Roll",
    price: "$0",
    cadence: "forever",
    line: "Kick the tyres on a real product.",
    features: ["1 run per month", "3 ad stills", "Watermarked video", "1:1 and 4:5 only"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Studio",
    price: "$29",
    cadence: "per month",
    line: "For a brand shipping ads every week.",
    features: [
      "40 runs per month",
      "120 ad stills",
      "40 videos, no watermark",
      "All 7 aspect ratios",
      "Headline overlays",
      "Commercial licence",
    ],
    cta: "Choose Studio",
    featured: true,
  },
  {
    name: "Agency",
    price: "$99",
    cadence: "per month",
    line: "Many brands, many deadlines.",
    features: [
      "200 runs per month",
      "Unlimited stills",
      "4K video exports",
      "Brand kits & presets",
      "5 seats included",
      "Priority render queue",
    ],
    cta: "Choose Agency",
    featured: false,
  },
];

export const compareFeatures = [
  ["Runs per month", "1", "40", "200"],
  ["Ad stills per run", "3", "3", "3"],
  ["Video generation", "Watermarked", "Included", "4K included"],
  ["Aspect ratios", "2", "All 7", "All 7"],
  ["Headline overlays", "—", "Yes", "Yes"],
  ["Brand kits", "—", "—", "Yes"],
  ["Seats", "1", "1", "5"],
  ["Queue", "Standard", "Fast", "Priority"],
];

export function PricingSection() {
  return (
    <section id="pricing" className="border-b border-hairline">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label-mono">Pricing</p>
              <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] leading-[1.02] font-semibold">
                Cheaper than the parking at a photoshoot.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              One run = 3 stills + 1 video. No credit maths, no per-seat surprises.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-px border border-hairline bg-hairline lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <PlanCard plan={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PlanCard({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <div
      className={`relative flex h-full flex-col p-7 sm:p-8 ${
        plan.featured ? "bg-surface" : "bg-ink"
      }`}
    >
      {plan.featured && (
        <span className="absolute top-0 right-0 bg-primary px-2.5 py-1 font-mono text-[10px] tracking-widest text-primary-foreground">
          MOST USED
        </span>
      )}
      <p className="font-display text-lg font-semibold">{plan.name}</p>
      <p className="mt-1 text-sm text-muted-foreground">{plan.line}</p>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-[2.6rem] leading-none font-semibold">{plan.price}</span>
        <span className="label-mono">{plan.cadence}</span>
      </div>
      <ul className="mt-7 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        to="/signup"
        className={`mt-8 inline-flex items-center justify-center px-4 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5 cursor-pointer ${
          plan.featured
            ? "bg-primary text-primary-foreground"
            : "border border-hairline text-foreground hover:bg-surface"
        }`}
      >
        {plan.cta}
      </Link>
    </div>
  );
}

export default PricingSection;
