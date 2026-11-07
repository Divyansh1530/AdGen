import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import rawProduct from "../../assets/images/raw-product.jpg";
import rawModel from "../../assets/images/raw-model.jpg";
import generatedAd from "../../assets/images/generated-ad.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-hairline">
      <div className="rule-grid pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1240px] gap-14 px-5 pt-20 pb-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:pt-28 lg:pb-24">
        <div>
          <div className="animate-drift inline-flex items-center gap-2 border border-hairline bg-surface/60 px-3 py-1.5">
            <span className="animate-pulse-dot h-1.5 w-1.5 bg-primary" />
            <span className="label-mono !text-foreground/70">v3 render engine · 41s average</span>
          </div>

          <h1
            className="animate-drift mt-7 text-[clamp(2.6rem,7vw,5.1rem)] leading-[0.92] font-semibold"
            style={{ animationDelay: "60ms" }}
          >
            Your product.
            <br />
            Your model.
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">One campaign.</span>
              <span className="absolute inset-x-0 bottom-2 z-0 h-3 bg-primary/25" />
            </span>
          </h1>

          <p
            className="animate-drift mt-7 max-w-[46ch] text-[17px] leading-relaxed text-muted-foreground"
            style={{ animationDelay: "140ms" }}
          >
            Drop in two ordinary photos — the thing you sell and the person selling it. AdGen
            composes them into three finished ad creatives and a short ad film, lit and graded like
            a studio shoot you didn't have to book.
          </p>

          <div
            className="animate-drift mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "220ms" }}
          >
            <Link
              to="/create"
              className="group inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Start a render
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 border border-hairline px-5 py-3 text-sm text-foreground transition-colors hover:bg-surface cursor-pointer"
            >
              See pricing
            </Link>
          </div>

          <dl
            className="animate-drift mt-12 grid max-w-lg grid-cols-3 gap-px border border-hairline bg-hairline"
            style={{ animationDelay: "300ms" }}
          >
            {[
              ["3", "creatives / run"],
              ["7", "aspect ratios"],
              ["41s", "median render"],
            ].map(([v, k]) => (
              <div key={k} className="bg-ink px-4 py-5">
                <dt className="font-display text-2xl font-semibold">{v}</dt>
                <dd className="label-mono mt-1 !tracking-[0.12em]">{k}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroStack />
      </div>

      <Ticker />
    </section>
  );
}

function HeroStack() {
  return (
    <div className="relative mx-auto w-full max-w-[420px] self-center lg:max-w-none">
      <div className="animate-drift relative" style={{ animationDelay: "180ms" }}>
        <div className="glow-lime relative overflow-hidden bg-surface">
          <img
            src={generatedAd}
            alt="AI generated skincare advertisement featuring a model holding a serum bottle"
            width={912}
            height={1104}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
            <span className="label-mono bg-ink/80 px-2 py-1 !text-foreground backdrop-blur">
              output · 4:5
            </span>
            <span className="bg-primary px-2 py-1 font-mono text-[11px] tracking-wider text-primary-foreground">
              READY
            </span>
          </div>
        </div>

        <div className="absolute -bottom-8 -left-6 w-28 rotate-[-6deg] border border-hairline bg-ink p-1.5 shadow-2xl sm:w-32">
          <img
            src={rawProduct}
            alt="Plain product reference photo of a serum bottle"
            width={912}
            height={1104}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <p className="label-mono px-1 py-1.5 !text-[10px]">product.jpg</p>
        </div>

        <div className="absolute -top-6 -right-5 w-24 rotate-[7deg] border border-hairline bg-ink p-1.5 shadow-2xl sm:w-28">
          <img
            src={rawModel}
            alt="Plain model reference photo"
            width={912}
            height={1104}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <p className="label-mono px-1 py-1.5 !text-[10px]">model.jpg</p>
        </div>
      </div>
    </div>
  );
}

function Ticker() {
  const items = [
    "SKINCARE",
    "SNEAKERS",
    "COLD BREW",
    "EYEWEAR",
    "SUPPLEMENTS",
    "DENIM",
    "FRAGRANCE",
    "HEADPHONES",
  ];
  return (
    <div className="relative overflow-hidden border-t border-hairline bg-ink py-3">
      <div className="animate-ticker flex w-max gap-10 whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((t, i) => (
          <span key={i} className="label-mono flex items-center gap-10">
            {t}
            <span className="text-primary">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default Hero;
