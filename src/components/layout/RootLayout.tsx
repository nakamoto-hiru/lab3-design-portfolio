import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { pageVariants } from "@/lib/animations";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function RootLayout() {
  const location = useLocation();

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen max-w-[1800px] border-r border-border bg-bg">
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
            <Footer />
          </motion.main>
        </AnimatePresence>
        <ScrollRestoration />
      </div>
    </MotionConfig>
  );
}
