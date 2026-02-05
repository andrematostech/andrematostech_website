import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import womanImage from "../assets/woman.png";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const wrapRef = useRef(null);

  const heroCopyRef = useRef(null);
  const heroImageWrapRef = useRef(null);

  // wedge icons alignment container
  const wedgeInnerRef = useRef(null);

  useEffect(() => {
    const section = wrapRef.current;
    const copy = heroCopyRef.current;
    const imageWrap = heroImageWrapRef.current;

    if (!section || !copy || !imageWrap) return;

    const ctx = gsap.context(() => {
      // Initial on-load (small)
      gsap.fromTo(
        [copy, imageWrap],
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }
      );

      // Scroll out hero (towards About)
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
        .to(copy, { x: -140, opacity: 0, ease: "none" }, 0)
        .to(imageWrap, { x: 140, opacity: 0, ease: "none" }, 0);

      // Subtle parallax on hero image while scrolling inside hero
      gsap.to(imageWrap, {
        y: 28,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={wrapRef}
      className="relative bg-[color:var(--pearl)] text-[color:var(--ink)] min-h-[calc(100vh-64px)]"
    >
      {/* Screen-centered hero */}
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left */}
          <div ref={heroCopyRef} className="lg:col-span-6 flex flex-col gap-4">
            <p className="text-s font-bold tracking-[0.40em] text-[color:var(--ink)]/50 uppercase">
              Software Developer
            </p>

            <h1 className=" text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[color:var(--ink)]">
              André Matos
            </h1>

            {/*
              I turn ideas into clean, functional digital experiences — focused on
              performance, usability, and real-world problem solving.
            </p>*/}
          </div>

          {/* Right */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div
              ref={heroImageWrapRef}
              className="relative aspect-[4/5] w-full overflow-hidden"
            >
              <img
                src={womanImage}
                alt="Woman at work"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Black wedge (touch bottom) */}
      <div className="absolute inset-x-0 bottom-0 h-28">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 112"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,36 L320,36 L580,112 L1440,112 L0,112 Z" fill="#0a0a0a" />
        </svg>

        {/* Keep icons aligned with the same max width as hero (NOT screen edge) */}
        <div className="relative h-full flex justify-center">
          <div
            ref={wedgeInnerRef}
            className="w-full max-w-[1100px] h-full relative"
          >
            <div className="absolute left-0 bottom-6 flex items-center gap-6">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="text-[color:var(--pearl)]/90 hover:bg-[color:var(--pearl)]/10 hover:text-[color:var(--pearl)] transition-colors"
              >
                <FaGithub size={25} />
              </a>

              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-[color:var(--pearl)]/90 hover:bg-[color:var(--pearl)]/10 hover:text-[color:var(--pearl)] transition-colors"
              >
                <FaLinkedinIn size={25} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
