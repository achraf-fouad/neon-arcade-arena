import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Gamepad2, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NeonButton } from "../ui/NeonButton";

const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/games", label: "GAMES" },
];

const Header = () => {
    const location = useLocation();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);

    const lastScrollY = useRef(0);

    /* Hide navbar on scroll down, show on scroll up */
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
                setHidden(true);
            } else {
                setHidden(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* Close mobile menu on route change */
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    /* Lock body scroll when mobile menu is open */
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileMenuOpen]);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
                hidden ? "-translate-y-full" : "translate-y-0"
            )}
        >
            <div className="glass-card border-b border-border/50">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 md:h-20 items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <Gamepad2 className="w-8 h-8 text-primary glow-pulse" />
                                <div className="absolute inset-0 blur-xl bg-primary/30 group-hover:bg-primary/50 transition-colors" />
                            </div>
                            <span className="font-gaming text-lg md:text-xl tracking-wider">
                                <span className="text-primary animate-neon-flicker">NEON</span>
                                <span className="text-foreground"> Games</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8 mr-32">
                            {navLinks.map((link) => {
                                const active = location.pathname === link.href;

                                return (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        className={cn(
                                            "font-gaming text-sm tracking-wider relative transition-colors",
                                            "after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary",
                                            "after:scale-x-0 after:origin-right after:transition-transform",
                                            "hover:text-primary hover:after:scale-x-100 hover:after:origin-left",
                                            active
                                                ? "text-primary after:scale-x-100"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Desktop CTA */}
                        <div className="hidden md:block">
                            <Link to="/games">
                                <NeonButton size="sm">START PLAYING</NeonButton>
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            type="button"
                            aria-label="Toggle navigation menu"
                            aria-expanded="false"
                            onClick={(e) => {
                                const expanded =
                                    e.currentTarget.getAttribute("aria-expanded") === "true";

                                e.currentTarget.setAttribute(
                                    "aria-expanded",
                                    expanded ? "false" : "true"
                                );

                                setMobileMenuOpen((prev) => !prev);
                            }}
                            className="md:hidden p-2 text-foreground"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" aria-hidden="true" />
                            ) : (
                                <Menu className="w-6 h-6" aria-hidden="true" />
                            )}
                        </button>

                    </div>
                </div>
            </div>

            {/* Mobile Navigation (always mounted – axe-safe) */}
            <nav
                id="mobile-navigation"
                hidden={!mobileMenuOpen}
                aria-hidden={!mobileMenuOpen}
                className="md:hidden glass-card border-b border-border/50"
            >
                <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
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

                    <Link to="/games">
                        <NeonButton className="w-full">START PLAYING</NeonButton>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export { Header };
