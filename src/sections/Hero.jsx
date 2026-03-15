import { useEffect, useRef, useState } from "react";
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
  const [orbActive, setOrbActive] = useState(true);

  useEffect(() => {
    const section = wrapRef.current;
    const copy = heroCopyRef.current;
    const imageWrap = heroImageWrapRef.current;
    const about = document.getElementById("about");

    if (!section || !copy || !imageWrap || !about) return;
    const copyItems = Array.from(copy.children);

    const ctx = gsap.context(() => {
      gsap.set([copy, imageWrap], { opacity: 1, x: 0, y: 0, scale: 1 });
      gsap.set(copyItems, { opacity: 1, x: 0, y: 0 });

      gsap.fromTo(
        copyItems,
        { x: -180, opacity: 0, y: 28 },
        {
          x: 0,
          opacity: 1,
          y: 0,
          stagger: 0.08,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "top 92%",
            end: "top 45%",
            scrub: 0.7
          }
        }
      );

      gsap.fromTo(
        imageWrap,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", immediateRender: false }
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
        .to(copyItems[0], { x: -120, y: -60, opacity: 0, ease: "none" }, 0)
        .to(copyItems[1], { x: -180, y: -120, opacity: 0, ease: "none" }, 0);

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

  useEffect(() => {
    let frame = 0;

    const syncActive = () => {
      frame = 0;
      const about = document.getElementById("about");
      if (document.visibilityState === "hidden") {
        setOrbActive(false);
        return;
      }
      if (!about) {
        setOrbActive(true);
        return;
      }

      const stopAt = about.offsetTop + about.offsetHeight * 0.82;
      setOrbActive(window.scrollY < stopAt);
    };

    const requestSync = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(syncActive);
    };

    syncActive();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    document.addEventListener("visibilitychange", requestSync);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      document.removeEventListener("visibilitychange", requestSync);
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

          heroInteractionRef.current.strength = 1.1;
          heroInteractionRef.current.x = radial * Math.cos(angle);
          heroInteractionRef.current.y = radial * Math.sin(angle);
          heroInteractionRef.current.z = z;
        }}
      >
        <div className="relative grid min-h-[calc(100vh-64px)] w-full max-w-[1100px] grid-cols-1 items-center gap-8 px-0 sm:px-6 lg:grid-cols-[0.44fr_0.56fr] app_hero_grid">
          <div
            ref={heroImageWrapRef}
            className="pointer-events-none fixed inset-0 z-[1] flex h-screen w-screen items-center justify-center overflow-visible lg:justify-end"
          >
            <HeroOrbCanvas
              active={orbActive}
              externalPointerRef={heroPointerRef}
              interactionRef={heroInteractionRef}
            />
          </div>

          <div
            ref={heroCopyRef}
            className="relative z-10 flex max-w-[560px] flex-col gap-[0.85rem] self-center pt-28 lg:mt-[34vh] lg:pt-0 app_hero_copy"
          >
            <p className="max-w-[22rem] text-[13px] font-bold uppercase tracking-[0.22em] text-[color:var(--pearl)]/44 sm:text-[14px] sm:leading-[1.7]">
              AI Software Developer
            </p>

            <h1 className="app_hero_title text-[31px] font-black uppercase leading-[0.92] tracking-[0.04em] text-[color:var(--pearl)] whitespace-nowrap sm:text-[43px] lg:text-[54px]">
              Andr&eacute; Matos
            </h1>
          </div>
        </div>
      </div>

      <SectionScrollIndicator
        targetId="about"
        initialVisible
        className="opacity-70 hover:opacity-100 app_section_scroll_indicator"
      />
    </section>
  );
}
