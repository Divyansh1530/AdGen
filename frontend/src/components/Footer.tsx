import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-ink">
      <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative grid h-7 w-7 place-items-center bg-primary">
                <span className="font-display text-[13px] font-extrabold text-primary-foreground">
                  A
                </span>
              </span>
              <span className="font-display text-[17px] font-semibold">AdGen</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Two photos in. A campaign out. Built for the people who ship ads weekly, not
              quarterly.
            </p>
          </div>

          <FooterCol
            title="Product"
            items={[
              { label: "Create", to: "/create" },
              { label: "Pricing", to: "/pricing" },
            ]}
          />
          <FooterCol
            title="Account"
            items={[
              { label: "Log in", to: "/login" },
              { label: "Sign up", to: "/signup" },
            ]}
          />
          <div>
            <p className="label-mono">Contact</p>
            <p className="mt-4 text-sm text-muted-foreground">hello@adgen.studio</p>
            <p className="mt-1 text-sm text-muted-foreground">Lisbon · Bengaluru</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] tracking-wider text-muted-foreground">
            © {new Date().getFullYear()} ADGEN STUDIO
          </p>
          <p className="font-mono text-[11px] tracking-wider text-muted-foreground">
            RENDER FARM STATUS —{" "}
            <span className="text-primary">
              <span className="animate-pulse-dot inline-block">●</span> OPERATIONAL
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div>
      <p className="label-mono">{title}</p>
      <ul className="mt-4 space-y-2">
        {items.map((i) => (
          <li key={i.to + i.label}>
            <Link
              to={i.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;
