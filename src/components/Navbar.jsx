import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useActiveSection } from "../hooks/useActiveSection";
import logoWhite from "../assets/logo_white.png";

const NAV_SECTION_IDS = ["top", "about", "projects", "contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_SECTION_IDS, {
    offsetPx: 32
  });

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const offset = id === "projects" ? 40 : id === "about" ? 0 : -48;

    const lenis = typeof window !== "undefined" ? window.lenis : null;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(target, {
        offset,
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 3)
      });
      return;
    }

    const top = window.scrollY + target.getBoundingClientRect().top + offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const linkClass = (id) =>
    `transition-colors ${
      active === id
        ? "text-[color:var(--pearl)] font-semibold"
        : "text-[color:var(--pearl)]/60 hover:text-[color:var(--pearl)]"
    }`;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-[color:var(--ink)]/76 backdrop-blur-100 app_nav app_nav_header"
      style={{ paddingLeft: "max(12px, env(safe-area-inset-left))", paddingRight: "max(12px, env(safe-area-inset-right))" }}
    >
      <div className="h-10 sm:h-[3.4rem] flex items-center justify-center app_nav_bar">
        <div className="w-full max-w-[1100px] px-6 sm:px-6 grid grid-cols-12 items-center app_nav_inner">
          <div className="col-span-8 sm:col-span-4 app_nav_brand flex items-center">
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 p-0 leading-none app_nav_brand_link"
              aria-label="Home"
              onClick={(e) => handleNavClick(e, "top")}
            >
              <div className="h-6 w-6 sm:h-8 sm:w-8 app_nav_logo">
                <img
                  src={logoWhite}
                  alt="andrematostech logo"
                  className="block h-full w-full object-contain app_nav_logo_img"
                  decoding="async"
                />
              </div>
              <span className="mt-[1px] leading-none text-[color:var(--pearl)]/48 app_nav_brand_text">
                <span className="block text-[11px] sm:text-[13px] font-semibold app_nav_brand_title">
                  andrematos
                </span>
                <span className="block text-[11px] sm:text-[13px] font-semibold app_nav_brand_subtitle">
                  tech
                </span>
              </span>
            </a>
          </div>

          <nav className="col-span-8 justify-end gap-8 text-sm app_nav_links">
            <a
              href="#about"
              className={`${linkClass("about")} app_nav_link`}
              onClick={(e) => handleNavClick(e, "about")}
            >
              About
            </a>
            <a
              href="#projects"
              className={`${linkClass("projects")} app_nav_link`}
              onClick={(e) => handleNavClick(e, "projects")}
            >
              Projects
            </a>
            <a
              href="#contact"
              className={`${linkClass("contact")} app_nav_link`}
              onClick={(e) => handleNavClick(e, "contact")}
            >
              Contact
            </a>
          </nav>

          <div className="col-span-4 flex justify-end app_nav_menu">
            <button
              type="button"
              aria-label="Toggle menu"
              className="h-9 w-9 text-[color:var(--pearl)] app_nav_menu_button"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`sm:hidden border-t border-[color:var(--pearl)]/10 bg-transparent app_nav_mobile transition-all duration-300 ease-out overflow-hidden ${
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className={`px-4 pt-14 pb-14 flex flex-col gap-4 text-sm app_nav_mobile_inner transition-transform duration-300 ease-out ${open ? "translate-y-0" : "-translate-y-2"}`}>
          <div className="h-3" />
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
            href="#projects"
            className={`${linkClass("projects")} app_nav_link`}
            onClick={(e) => {
              handleNavClick(e, "projects");
              setOpen(false);
            }}
          >
            Projects
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
          <div className="h-3" />
        </div>
      </div>
    </header>
  );
}
