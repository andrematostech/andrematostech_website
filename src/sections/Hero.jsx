import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import womanImage from "../assets/woman_2.png";
import { heroCodeLines } from "../data/heroCode.js";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const wrapRef = useRef(null);

  const heroCopyRef = useRef(null);
  const heroImageWrapRef = useRef(null);

  useEffect(() => {
    const section = wrapRef.current;
    const copy = heroCopyRef.current;
    const imageWrap = heroImageWrapRef.current;

    if (!section || !copy || !imageWrap) return;

    const ctx = gsap.context(() => {
      // Ensure content is visible even if animations fail
      gsap.set([copy, imageWrap], { opacity: 1, x: 0, y: 0 });

      // Initial on-load (small)
      gsap.fromTo(
        [copy, imageWrap],
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, immediateRender: false }
      );

      // Scroll out hero (towards About)
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      }).
      to(copy, { x: -140, opacity: 0, ease: "none" }, 0).
      to(imageWrap, { x: 140, opacity: 0, ease: "none" }, 0);

      // Subtle parallax on hero image while scrolling inside hero
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
      className="relative bg-[color:var(--pearl)] text-[color:var(--ink)] min-h-[calc(100vh-64px)] app_hero app_hero_section">

      {/* Code typing background */}
      <div className="absolute inset-0 pointer-events-none app_hero_bg" aria-hidden="true">
        <div className="app_hero_bg_dots">
          <svg
            className="app_hero_bg_dots_svg"
            viewBox="0 0 1200 700"
            aria-hidden="true"
          >
            <circle cx="40" cy="80" r="2.2" />
            <circle cx="180" cy="220" r="1.2" />
            <circle cx="320" cy="120" r="1.4" />
            <circle cx="520" cy="240" r="2" />
            <circle cx="640" cy="90" r="1.1" />
            <circle cx="820" cy="180" r="1.6" />
            <circle cx="1020" cy="140" r="2.4" />
            <circle cx="1160" cy="60" r="1.4" />
            <circle cx="120" cy="420" r="1.4" />
            <circle cx="260" cy="520" r="2" />
            <circle cx="520" cy="460" r="1.6" />
            <circle cx="700" cy="560" r="2.2" />
            <circle cx="940" cy="460" r="1.4" />
            <circle cx="1100" cy="620" r="2" />
            <circle cx="980" cy="320" r="1.1" />
            <circle cx="760" cy="360" r="1.3" />
            <circle cx="420" cy="340" r="1.2" />
            <circle cx="200" cy="320" r="1.1" />
          </svg>
          <svg
            className="app_hero_bg_dots_svg app_hero_bg_dots_svg--alt"
            viewBox="0 0 1200 700"
            aria-hidden="true"
          >
            <circle cx="90" cy="140" r="1.3" />
            <circle cx="260" cy="80" r="2.1" />
            <circle cx="440" cy="200" r="1.2" />
            <circle cx="620" cy="140" r="1.5" />
            <circle cx="780" cy="60" r="1.1" />
            <circle cx="980" cy="220" r="2.3" />
            <circle cx="1120" cy="120" r="1.4" />
            <circle cx="160" cy="520" r="1.6" />
            <circle cx="360" cy="580" r="2.1" />
            <circle cx="580" cy="500" r="1.2" />
            <circle cx="760" cy="600" r="1.8" />
            <circle cx="1040" cy="520" r="1.3" />
            <circle cx="880" cy="360" r="1.2" />
            <circle cx="640" cy="360" r="1.1" />
            <circle cx="420" cy="420" r="1.4" />
            <circle cx="220" cy="360" r="1.2" />
          </svg>
        </div>
        <div className="app_hero_code">
          <div className="app_hero_code_lines">
            {heroCodeLines.map((line, index) => (
              <span key={`${line}-${index}`} style={{ "--i": index }}>
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Screen-centered hero */}
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 sm:px-0 app_hero_frame">
        <div className="w-full max-w-[1100px] sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-1 sm:gap-4 items-center app_hero_grid">
          {/* Left */}
          <div ref={heroCopyRef} className="lg:col-span-5 flex flex-col gap-1 sm:gap-4 app_hero_copy relative z-10 max-w-[500px]">
            <p className="text-[15px] sm:text-s font-bold tracking-[0.26em] sm:tracking-[0.40em] text-[color:var(--ink)]/50 uppercase app_hero_subtitle">
              Software Developer
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[color:var(--ink)] app_hero_title uppercase">
              ANDRÉ MATOS
            </h1>

            {/*
                I turn ideas into clean, functional digital experiences — focused on
                performance, usability, and real-world problem solving.
               </p>*/}
          </div>

          {/* Right */}
          <div className="lg:col-span-7 flex flex-col gap-4 items-center app_hero_media relative z-0">
            <div
              ref={heroImageWrapRef}
              className="relative w-full max-w-[360px] overflow-visible app_hero_image_wrap">

              <img
                src={womanImage}
                alt="Woman at work"
                className="w-full h-auto object-contain app_hero_image"
                loading="lazy"
                decoding="async" />

            </div>
          </div>
        </div>
      </div>

      {/* Wedge removed */}
    </section>);

}
