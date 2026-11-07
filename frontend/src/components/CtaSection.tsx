import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-b border-hairline">
      <div className="rule-grid pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute bottom-[-220px] left-1/2 h-[440px] w-[900px] -translate-x-1/2 rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--ember) 20%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1240px] px-5 py-24 text-center sm:px-8 lg:py-32">
        <Reveal>
          <p className="label-mono">Two files. That's the whole brief.</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-[clamp(2.2rem,6vw,4.2rem)] leading-[0.95] font-semibold">
            Stop booking studios.
            <br />
            <span className="text-primary">Start shipping ads.</span>
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/create"
              className="group inline-flex items-center gap-2 bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Upload your two photos
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <p className="label-mono mt-6">No card required for the first run</p>
        </Reveal>
      </div>
    </section>
  );
}

export default CtaSection;
