import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "./Reveal";

export const faqs = [
  {
    q: "What exactly do I need to upload?",
    a: "Two images: a clear photo of your product on any background, and a photo of the person you want holding or wearing it. Both can be phone shots — the engine relights and recomposes them.",
  },
  {
    q: "Will the product still look like my product?",
    a: "Yes. The product photo is treated as a locked reference: label, shape, colour and finish are preserved while the scene around it is rebuilt. If a detail drifts, re-run — you'll get three fresh concepts.",
  },
  {
    q: "Do I own the output? Can I run it as paid media?",
    a: "On Studio and Agency you get a full commercial licence for the stills and video, including paid social and display. The free tier is for testing and stays watermarked.",
  },
  {
    q: "How long does a run take?",
    a: "Stills land in roughly 40 seconds. The video takes about two to three minutes depending on length and queue.",
  },
  {
    q: "Can I use a model photo of a real person?",
    a: "Only with their consent. Upload photos you have the rights to use — that's on you, and we check for obvious misuse.",
  },
  {
    q: "What if I don't have a model photo at all?",
    a: "Upload a stand-in and describe the person you want in the scene direction field, or run product-only mode for still-life ads.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-b border-hairline">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
        <Reveal>
          <p className="label-mono">FAQ</p>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] font-semibold">
            Questions people actually ask.
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Still unsure? Write to hello@adgen.studio — a human replies.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="border-t border-hairline">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="border-b border-hairline">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-primary cursor-pointer"
                  >
                    <span className="text-[15px] font-medium sm:text-base">{f.q}</span>
                    {isOpen ? (
                      <Minus className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  <div
                    className="grid transition-all duration-400 ease-out"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default FaqSection;
