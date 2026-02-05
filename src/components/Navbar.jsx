import { useActiveSection } from "../hooks/useActiveSection";
import logoBlack from "../assets/logo_black.png";

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
      active === id ? "text-[color:var(--ink)] font-semibold" : "text-[color:var(--ink)]/60 hover:text-[color:var(--ink)]"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[color:var(--pearl)]/80 backdrop-blur-100">
      <div className="h-16 flex justify-center">
        <div className="w-full max-w-[1100px] grid grid-cols-12 items-center">
          <div className="col-span-4">
            <a
              href="#top"
              className="inline-flex items-center gap-2 p-0 leading-none"
              aria-label="Home"
              onClick={(e) => handleNavClick(e, "top")}
            >
              <div className="h-10 w-10">
                <img
                  src={logoBlack}
                  alt="andrematostech logo"
                  className="block h-full w-full object-contain"
                  decoding="async"
                />
              </div>
              <span className="leading-none">
                <span className="block text-[15px] font-semibold">andrematos</span>
                <span className="block text-[15px] font-semibold">tech</span>
              </span>
            </a>
          </div>

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
