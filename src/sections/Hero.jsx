import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroOrbCanvas from "../components/HeroOrbCanvas";

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

    if (!section || !copy || !imageWrap) return;

    const ctx = gsap.context(() => {
      gsap.set([copy, imageWrap], { opacity: 1, x: 0, y: 0 });

      gsap.fromTo(
        [copy, imageWrap],
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, immediateRender: false }
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
        .to(copy, { x: -140, opacity: 0, ease: "none" }, 0)
        .to(imageWrap, { x: 140, opacity: 0, ease: "none" }, 0);

      gsap.to(imageWrap, {
        y: 28,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={wrapRef}
      className="relative min-h-[calc(100vh-64px)] bg-[color:var(--pearl)] text-[color:var(--ink)] app_hero app_hero_section"
    >
      {/* Previous hero background kept for reference.
      <div className="absolute inset-0 pointer-events-none app_hero_bg" aria-hidden="true">
        <div className="app_hero_bg_dots">...</div>
        <div className="app_hero_code">
          <div className="app_hero_code_lines">...</div>
        </div>
      </div>
      */}

      <div
        className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 sm:px-0 app_hero_frame"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;

          heroPointerRef.current.x = x;
          heroPointerRef.current.y = -y;
        }}
        onPointerLeave={() => {
          heroPointerRef.current.x = 0;
          heroPointerRef.current.y = 0;
        }}
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
        <div className="relative grid w-full max-w-[1100px] grid-cols-1 items-center gap-10 sm:px-6 app_hero_grid">
          <div
            ref={heroCopyRef}
            className="relative z-10 flex max-w-[500px] flex-col app_hero_copy lg:col-span-5"
            style={{ rowGap: "2px" }}
          >
            <p
              className="app_hero_subtitle text-[12px] font-bold uppercase tracking-[0.24em] text-[color:var(--ink)]/50 sm:text-[18px] sm:tracking-[0.4em]"
              style={{ marginBottom: "-4px" }}
            >
              Software Developer
            </p>

            <h1 className="app_hero_title text-[32px] font-bold uppercase tracking-tight text-[color:var(--ink)] sm:text-[46px] lg:text-[54px]">
              André Matos
            </h1>
          </div>

          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-visible app_hero_media">
            {/* Previous hero image kept for reference.
            <div
              ref={heroImageWrapRef}
              className="relative w-full max-w-[360px] overflow-visible app_hero_image_wrap"
            >
              <img
                src={womanImage}
                alt="Woman at work"
                className="w-full h-auto object-contain app_hero_image"
                loading="lazy"
                decoding="async"
              />
            </div>
            */}
            <div
              ref={heroImageWrapRef}
              className="pointer-events-auto relative flex w-full items-center justify-center overflow-visible lg:translate-x-16 lg:justify-end"
            >
              <HeroOrbCanvas
                externalPointerRef={heroPointerRef}
                interactionRef={heroInteractionRef}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
