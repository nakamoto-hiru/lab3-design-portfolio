import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "Work", desktopLabel: "Case studies", to: "/" },
  { label: "About", desktopLabel: "About", to: "/about" },
  { label: "Contact", desktopLabel: "Let's collaborate", to: "/contact" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 z-50 w-full max-w-[1800px] border-r border-b border-border">
      <div className="grid h-16 grid-cols-4 md:h-[130px]">
        {/* Logo — transparent bg, text at bottom-left */}
        <Link
          to="/"
          className="flex flex-col justify-end px-4 pb-4 text-[15px] tracking-[-0.02em] text-text-primary transition-colors duration-300 hover:text-accent md:px-6 md:text-[26px]"
        >
          SM
        </Link>

        {/* Nav Items — dark bg, text at bottom-left */}
        {navItems.map((item) => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/" || location.pathname.startsWith("/case-studies")
              : location.pathname.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col justify-between border-l border-border px-4 pb-4 pt-4 text-[13px] transition-colors duration-300 md:px-6 md:text-[14px]",
                "bg-bg-nav",
                isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
              )}
              style={{
                transitionTimingFunction: "cubic-bezier(1, 0, 0, 1)",
              }}
            >
              <span className="self-end text-[14px] text-text-secondary">
                {isActive ? "↓" : ""}
              </span>
              <motion.span
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <span className="md:hidden">{item.label}</span>
                <span className="hidden md:inline">{item.desktopLabel}</span>
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
