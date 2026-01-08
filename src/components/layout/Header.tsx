import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Gamepad2, Menu, X } from "lucide-react";
import { useState } from "react";
import { NeonButton } from "../ui/NeonButton";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/games", label: "GAMES" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Gamepad2 className="w-8 h-8 text-primary glow-pulse" />
                <div className="absolute inset-0 blur-xl bg-primary/30 group-hover:bg-primary/50 transition-colors" />
              </div>
              <span className="font-gaming text-lg md:text-xl tracking-wider">
                <span className="text-primary animate-neon-flicker">NEON</span>
                <span className="text-foreground"> PLAYGROUND</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 mr-32">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "font-gaming text-sm tracking-wider transition-all duration-300",
                    "hover:text-primary",
                    "relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5",
                    "after:bg-primary after:scale-x-0 after:origin-right",
                    "after:transition-transform after:duration-300",
                    "hover:after:scale-x-100 hover:after:origin-left",
                    location.pathname === link.href
                      ? "text-primary after:scale-x-100"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link to="/games">
                <NeonButton variant="primary" size="sm">
                  START PLAYING
                </NeonButton>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-border/50 animate-slide-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "font-gaming text-sm tracking-wider py-2",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/games" onClick={() => setMobileMenuOpen(false)}>
              <NeonButton variant="primary" size="sm" className="w-full">
                START PLAYING
              </NeonButton>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export { Header };
