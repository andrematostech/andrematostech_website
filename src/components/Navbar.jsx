import { useActiveSection } from "../hooks/useActiveSection";

export default function Navbar() {
  const active = useActiveSection(["top", "about", "work", "contact"], {
    offsetPx: 32,
  });

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const lenis = typeof window !== "undefined" ? window.lenis : null;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(target, {
        offset: -64,
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const linkClass = (id) =>
    `transition-colors ${
      active === id ? "text-black font-semibold" : "text-black/500 hover:text-black"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f4f4f4]/80 backdrop-blur-100">
      <div className="h-13 flex justify-center">
        <div className="w-full max-w-[1100px] grid grid-cols-12 items-center">
          <a href="#top" className="col-span-4 flex items-center gap-2" onClick={(e) => handleNavClick(e, "top")}>
            <div className="h-9 w-9 bg-black text-white grid place-items-center text-sm font-semibold">
              AM
            </div>
            <span className="text-sm font-semibold">André Matos</span>
          </a>

          <nav className="col-span-8 flex justify-end gap-10 text-sm">
            <a href="#about" className={linkClass("about")} onClick={(e) => handleNavClick(e, "about")}>About</a>
            <a href="#work" className={linkClass("work")} onClick={(e) => handleNavClick(e, "work")}>Work</a>
            <a href="#contact" className={linkClass("contact")} onClick={(e) => handleNavClick(e, "contact")}>Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
