import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/cn";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MobileMenu from "./MobileMenu";
import LiquidText from "@/components/common/LiquidText";

const navLinks = [
  { label: "Projects", to: "/" },
  { label: "Team", to: "/profile" },
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(entry.intersectionRatio < 1),
      { threshold: [1], rootMargin: "-1px 0px 0px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const logoSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: logoSectionRef,
    offset: ["start start", "end start"],
  });
  const logoOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0], {
    clamp: true,
  });

  return (
    <>
      {/* Logo — fixed, content scrolls over it */}
      <div
        ref={logoSectionRef as React.RefObject<HTMLDivElement>}
        className="relative"
        style={{
          height: "calc(clamp(4rem, 16vw, 18rem) * 1.2 + 3rem)",
        }}
      >
        <div className="fixed top-0 left-0 z-0 w-full max-w-[var(--container-max)]">
          <div className="px-6 sm:px-8 md:px-12">
            <Link to="/" aria-label="Slug Macro — Home" className="block">
              <motion.div className="pt-8 md:pt-12" style={{ opacity: logoOpacity }}>
                <LiquidText
                  className="select-none text-text-primary leading-[0.8] font-bold cursor-pointer"
                  style={{
                    fontFamily: "'Bodoni Moda', serif",
                    fontSize: "clamp(4rem, 16vw, 18rem)",
                    letterSpacing: "-0.05em",
                  }}
                >
                  L4D Team
                </LiquidText>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      {/* Nav bar — sticky top */}
      <header
        ref={headerRef as React.RefObject<HTMLElement>}
        className={cn(
          "sticky top-0 z-50 w-full bg-bg border-t border-border transition-[border-color] duration-300",
          scrolled
            ? "border-b border-b-border"
            : "border-b border-b-transparent",
        )}
      >
        <nav className="grid grid-cols-2 sm:grid-cols-4 [&>div]:transition-[padding] [&>div]:duration-300">
          <div
            className={cn(
              "px-6 text-[0.875rem] leading-relaxed tracking-wide text-text-secondary whitespace-nowrap sm:px-8 md:px-12",
              scrolled ? "py-4 sm:py-5" : "py-4 sm:py-8 md:py-12",
            )}
          >
            Lean Design. Sharp Delivery.
          </div>

          <div
            className={cn(
              "hidden px-8 text-[0.875rem] leading-relaxed tracking-wide md:px-12 sm:block",
              scrolled ? "py-5" : "py-8 md:py-12",
            )}
          >
            <Link
              to="/"
              className={cn(
                "transition-opacity duration-300 hover:opacity-60",
                location.pathname === "/"
                  ? "text-text-primary font-medium"
                  : "text-text-secondary",
              )}
            >
              Projects
            </Link>
          </div>

          <div
            className={cn(
              "hidden px-8 text-[0.875rem] leading-relaxed tracking-wide md:px-12 sm:block",
              scrolled ? "py-5" : "py-8 md:py-12",
            )}
          >
            <Link
              to="/profile"
              className={cn(
                "transition-opacity duration-300 hover:opacity-60",
                location.pathname === "/profile"
                  ? "text-text-primary font-medium"
                  : "text-text-secondary",
              )}
            >
              Team
            </Link>
          </div>

          <div
            className={cn(
              "hidden px-12 text-right text-[0.875rem] leading-relaxed tracking-wide text-text-tertiary sm:block",
              scrolled ? "py-6" : "py-12",
            )}
          >
            <span className="hidden lg:inline">2026 Portfolio — V.1.0.0</span>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="ml-auto flex items-center justify-center pr-6 sm:hidden"
            aria-label="Open menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navLinks}
      />
    </>
  );
}
