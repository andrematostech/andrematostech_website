import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Projects from "../sections/Projects";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const targetId = location.state?.scrollTo;
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    const offset = targetId === "projects" ? 40 : targetId === "about" ? 0 : -48;
    const lenis = typeof window !== "undefined" ? window.lenis : null;

    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(target, {
        offset,
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3)
      });
      return;
    }

    const top = window.scrollY + target.getBoundingClientRect().top + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }, [location.state]);

  return (
    <div className="min-h-screen bg-[color:var(--pearl)] text-[color:var(--ink)] app_home app_home_root">
      <Navbar />
      <main className="pt-14 sm:pt-16 app_home_main">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>);

}
