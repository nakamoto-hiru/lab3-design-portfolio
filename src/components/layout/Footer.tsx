import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedSection from "@/components/common/AnimatedSection";
import LiquidText from "@/components/common/LiquidText";

export default function Footer() {
  const location = useLocation();
  const isProfile = location.pathname === "/profile";
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <footer>
      {!isProfile && (
        <AnimatedSection>
          <div
            ref={sectionRef as React.RefObject<HTMLDivElement>}
            className="border-b border-border bg-bg px-6 py-24 sm:px-8 sm:py-36 md:px-12 md:py-48"
          >
            <motion.div style={{ y }}>
              <LiquidText
                radius={0.2}
                className="text-text-primary leading-[1] font-bold"
                style={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontSize: "clamp(1.8rem, 5.5vw, 7rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                Simplicity is the
                <br />
                ultimate sophistication.
              </LiquidText>
              <p className="mt-8 text-[0.875rem] tracking-wide text-text-tertiary">
                — Leonardo da Vinci
              </p>
            </motion.div>
          </div>
        </AnimatedSection>
      )}

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-6 py-6 sm:px-8 md:px-12">
        <p className="text-[0.7rem] tracking-wide text-text-tertiary">
          &copy; {new Date().getFullYear()}
        </p>
        <p className="text-[0.7rem] tracking-wide text-text-tertiary">
          Slug Macro
        </p>
      </div>
    </footer>
  );
}
