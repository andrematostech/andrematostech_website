import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SectionScrollIndicator({
  targetId,
  label = "Scroll",
  initialVisible = false,
  className = ""
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const section = button?.closest("section");

    if (!button || !section) return;

    const ctx = gsap.context(() => {
      gsap.set(button, { opacity: initialVisible ? 0.72 : 0 });

      if (!initialVisible) {
        gsap.fromTo(
          button,
          { opacity: 0 },
          {
            opacity: 0.72,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              end: "top 62%",
              scrub: true
            }
          }
        );
      }

      gsap.to(button, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "top+=180 top",
          scrub: true
        }
      });
    }, section);

    return () => ctx.revert();
  }, [initialVisible]);

  const scrollToTarget = () => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const lenis = typeof window !== "undefined" ? window.lenis : null;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(target, {
        offset: -24,
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3)
      });
      return;
    }

    const top = window.scrollY + target.getBoundingClientRect().top - 24;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={`Scroll to ${targetId} section`}
      onClick={scrollToTarget}
      className={`absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-white mix-blend-difference transition-colors sm:bottom-10 ${className}`}
    >
      <span className="text-[10px] uppercase tracking-[0.3em]">{label}</span>
      <span className="app_hero_scroll_arrow">
        <span />
      </span>
    </button>
  );
}
