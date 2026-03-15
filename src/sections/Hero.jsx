import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroOrbCanvas from "../components/HeroOrbCanvas";
import SectionScrollIndicator from "../components/SectionScrollIndicator";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const wrapRef = useRef(null);
  const heroCopyRef = useRef(null);
  const heroImageWrapRef = useRef(null);
  const heroPointerRef = useRef({ x: 0, y: 0 });
  const heroInteractionRef = useRef({ strength: 0, x: 0, y: 0, z: 0 });

  useEffect(() => {
    const section = wrapRef.current;
    const copy = heroCopyRef.current;
    const imageWrap = heroImageWrapRef.current;
    const about = document.getElementById("about");

    if (!section || !copy || !imageWrap || !about) return;

    const ctx = gsap.context(() => {
      gsap.set([copy, imageWrap], { opacity: 1, x: 0, y: 0, scale: 1 });

      gsap.fromTo(
        [copy, imageWrap],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, immediateRender: false }
      );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        })
        .to(copy, { y: -48, opacity: 0, ease: "none" }, 0);

      gsap.to(imageWrap, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: about,
          start: "bottom 86%",
          end: "bottom 52%",
          scrub: true
        }
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      heroPointerRef.current.x = (event.clientX / width) * 2 - 1;
      heroPointerRef.current.y = -((event.clientY / height) * 2 - 1);
    };

    const handlePointerLeave = () => {
      heroPointerRef.current.x = 0;
      heroPointerRef.current.y = 0;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <section
      id="top"
      ref={wrapRef}
      className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[color:var(--ink)] text-[color:var(--pearl)] app_hero app_hero_section"
    >
      <div
        className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 sm:px-0 app_hero_frame"
        onClick={() => {
          const angle = Math.random() * Math.PI * 2;
          const z = Math.random() * 2 - 1;
          const radial = Math.sqrt(1 - z * z);

          heroInteractionRef.current.strength = 1;
          heroInteractionRef.current.x = radial * Math.cos(angle);
          heroInteractionRef.current.y = radial * Math.sin(angle);
          heroInteractionRef.current.z = z;
        }}
      >
        <div className="relative grid h-full w-full max-w-[1100px] grid-cols-1 items-center gap-8 px-0 sm:px-6 lg:grid-cols-[0.44fr_0.56fr] lg:items-end app_hero_grid">
          <div
            ref={heroImageWrapRef}
            className="pointer-events-none fixed inset-0 z-[1] flex h-screen w-screen items-center justify-center overflow-visible lg:justify-end"
          >
            <HeroOrbCanvas
              externalPointerRef={heroPointerRef}
              interactionRef={heroInteractionRef}
            />
          </div>

          <div
            ref={heroCopyRef}
            className="relative z-10 flex max-w-[560px] flex-col gap-2 self-center pt-40 lg:self-end lg:pb-10 lg:translate-y-[22vh] lg:pt-0 app_hero_copy"
          >
            <p className="max-w-[22rem] text-[12px] font-medium uppercase tracking-[0.22em] text-[color:var(--pearl)]/44 sm:text-[13px] sm:leading-[1.7]">
              AI Software Developer
            </p>

            <h1 className="app_hero_title text-[31px] font-black uppercase leading-[0.92] tracking-[0.04em] text-[color:var(--pearl)] whitespace-nowrap sm:text-[43px] lg:text-[54px]">
              Andr&eacute; Matos
            </h1>

            <p className="max-w-[28rem] pt-1 text-[11px] leading-[1.75] tracking-[0.14em] text-[color:var(--pearl)]/68 sm:text-[12px]">
              Building AI systems and intelligent applications
            </p>
          </div>
        </div>
      </div>

      <SectionScrollIndicator
        targetId="about"
        initialVisible
        className="text-[color:var(--pearl)]/38 hover:text-[color:var(--pearl)]/72 app_section_scroll_indicator"
      />
    </section>
  );
}
