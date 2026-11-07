import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent, type ReactNode } from "react";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "./Navbar";
import generatedAd from "@/assets/images/generated-ad.jpg";

export interface AuthFormValues {
  name: string;
  email: string;
  password: string;
}

export function AuthShell({
  kicker,
  title,
  blurb,
  submitLabel,
  showName,
  footer,
  onSubmit,
  isLoading = false,
  error = null,
}: {
  kicker: string;
  title: string;
  blurb: string;
  submitLabel: string;
  showName?: boolean;
  footer: ReactNode;
  onSubmit?: (values: AuthFormValues) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
}) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setClientError(null);

    if (showName && !name.trim()) {
      setClientError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setClientError("Please enter your email.");
      return;
    }

    if (password.length < 8) {
      setClientError("Password must be at least 8 characters long.");
      return;
    }

    if (onSubmit) {
      try {
        await onSubmit({ name: name.trim(), email: email.trim(), password });
      } catch {
        // Handled by caller
      }
    } else {
      toast.success(`${submitLabel} successful! Welcome to AdGen.`);
      setTimeout(() => {
        navigate("/create");
      }, 600);
    }
  };

  const displayedError = error || clientError;

  return (
    <div className="grain min-h-screen bg-ink">
      <Navbar />
      <main className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
        <div className="max-w-md">
          <p className="label-mono">{kicker}</p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] leading-[1] font-semibold">{title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{blurb}</p>

          {displayedError && (
            <div className="mt-6 flex items-start gap-2.5 border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-xs text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{displayedError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {showName && (
              <Field
                id="name"
                label="Name"
                type="text"
                placeholder="Rhea Kapoor"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (clientError) setClientError(null);
                }}
                autoComplete="name"
                required
                disabled={isLoading}
              />
            )}

            <Field
              id="email"
              label="Email"
              type="email"
              placeholder="you@brand.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (clientError) setClientError(null);
              }}
              autoComplete="email"
              required
              disabled={isLoading}
            />

            <div className="block">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="label-mono">
                  Password
                </label>
                <span className="text-[11px] text-muted-foreground/70">min. 8 characters</span>
              </div>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (clientError) setClientError(null);
                  }}
                  autoComplete={showName ? "new-password" : "current-password"}
                  disabled={isLoading}
                  className="w-full border border-hairline bg-surface/40 px-3.5 py-3 pr-10 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/60 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Please wait..." : submitLabel}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">{footer}</p>
        </div>

        <div className="relative hidden overflow-hidden border border-hairline lg:block">
          <img
            src={generatedAd}
            alt="Example advertisement generated with AdGen"
            width={912}
            height={1104}
            loading="lazy"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-7 pt-20">
            <p className="font-display text-xl font-semibold">
              “Two uploads replaced a two-day shoot.”
            </p>
            <p className="label-mono mt-2">Rhea K. · founder, Halcyon Skin</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  required,
  disabled,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="label-mono">{label}</span>
      <input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        className="mt-2 w-full border border-hairline bg-surface/40 px-3.5 py-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/60 disabled:opacity-50"
      />
    </label>
  );
}

export function AuthLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-primary underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}

export default AuthShell;
