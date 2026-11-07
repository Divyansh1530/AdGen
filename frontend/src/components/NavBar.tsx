import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Failed to log out");
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/create", label: "Create" },
    ...(isAuthenticated ? [{ to: "/dashboard", label: "Campaigns" }] : []),
    { to: "/pricing", label: "Pricing" },
  ] as const;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-hairline bg-ink/85 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative grid h-7 w-7 place-items-center bg-primary">
            <span className="font-display text-[13px] font-extrabold text-primary-foreground">
              A
            </span>
            <span className="absolute -right-0.5 -bottom-0.5 h-1.5 w-1.5 bg-ember" />
          </span>
          <span className="font-display text-[17px] font-semibold tracking-tight">AdGen</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => {
            const isActive = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative px-3.5 py-2 text-sm transition-colors ${
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Controls */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-1.5 border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                <span>{user.credits} credits</span>
              </div>

              <div className="flex items-center gap-2 pl-2">
                <span
                  className="font-mono text-xs text-muted-foreground max-w-[130px] truncate"
                  title={user.name || user.email}
                >
                  {user.name || user.email.split("@")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 border border-hairline px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="group relative overflow-hidden bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center border border-hairline md:hidden cursor-pointer"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-hairline bg-ink px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`py-2.5 text-sm ${
                  location.pathname === l.to ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}

            {isAuthenticated && user ? (
              <div className="mt-3 border-t border-hairline pt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-muted-foreground">{user.name || user.email}</span>
                  <span className="font-mono text-primary">{user.credits} credits</span>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 py-2 text-xs text-destructive text-left cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" /> Log out
                </button>
              </div>
            ) : (
              <div className="mt-3 border-t border-hairline pt-3 flex flex-col gap-1">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm text-muted-foreground"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm text-primary font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
