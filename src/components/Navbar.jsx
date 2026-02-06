import { useState } from "react";
import { useActiveSection } from "../hooks/useActiveSection";
import logoBlack from "../assets/logo_black.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(["top", "about", "work", "contact"], {
    offsetPx: 32
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
        easing: (t) => 1 - Math.pow(1 - t, 3)
      });
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const linkClass = (id) =>
    `transition-colors ${
      active === id
        ? "text-[color:var(--ink)] font-semibold"
        : "text-[color:var(--ink)]/60 hover:text-[color:var(--ink)]"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[color:var(--pearl)]/90 backdrop-blur-100 app_nav app_nav_header">
      <div className="h-14 sm:h-16 flex justify-center app_nav_bar">
        <div className="w-full max-w-[1100px] px-4 sm:px-6 grid grid-cols-12 items-center app_nav_inner">
          <div className="col-span-8 sm:col-span-4 app_nav_brand">
            <a
              href="#top"
              className="inline-flex items-center gap-2 p-0 leading-none app_nav_brand_link"
              aria-label="Home"
              onClick={(e) => handleNavClick(e, "top")}
            >
              <div className="h-8 w-8 sm:h-10 sm:w-10 app_nav_logo">
                <img
                  src={logoBlack}
                  alt="andrematostech logo"
                  className="block h-full w-full object-contain app_nav_logo_img"
                  decoding="async"
                />
              </div>
              <span className="leading-none app_nav_brand_text">
                <span className="block text-[13px] sm:text-[15px] font-semibold app_nav_brand_title">
                  andrematos
                </span>
                <span className="block text-[13px] sm:text-[15px] font-semibold app_nav_brand_subtitle">
                  tech
                </span>
              </span>
            </a>
          </div>

          <nav className="hidden sm:flex col-span-8 justify-end gap-8 text-sm app_nav_links">
            <a
              href="#about"
              className={`${linkClass("about")} app_nav_link`}
              onClick={(e) => handleNavClick(e, "about")}
            >
              About
            </a>
            <a
              href="#work"
              className={`${linkClass("work")} app_nav_link`}
              onClick={(e) => handleNavClick(e, "work")}
            >
              Work
            </a>
            <a
              href="#contact"
              className={`${linkClass("contact")} app_nav_link`}
              onClick={(e) => handleNavClick(e, "contact")}
            >
              Contact
            </a>
          </nav>

          <div className="col-span-4 sm:hidden flex justify-end">
            <button
              type="button"
              aria-label="Toggle menu"
              className="h-9 w-9 border border-[color:var(--ink)]/20 text-[color:var(--ink)] app_nav_menu_button"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="block text-xs app_nav_menu_text">{open ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="sm:hidden border-t border-[color:var(--ink)]/10 bg-[color:var(--pearl)]/95 app_nav_mobile">
          <div className="px-4 py-4 flex flex-col gap-4 text-sm app_nav_mobile_inner">
            <a
              href="#about"
              className={`${linkClass("about")} app_nav_link`}
              onClick={(e) => {
                handleNavClick(e, "about");
                setOpen(false);
              }}
            >
              About
            </a>
            <a
              href="#work"
              className={`${linkClass("work")} app_nav_link`}
              onClick={(e) => {
                handleNavClick(e, "work");
                setOpen(false);
              }}
            >
              Work
            </a>
            <a
              href="#contact"
              className={`${linkClass("contact")} app_nav_link`}
              onClick={(e) => {
                handleNavClick(e, "contact");
                setOpen(false);
              }}
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
