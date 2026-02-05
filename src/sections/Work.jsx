import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "../components/Reveal.jsx";
import workBg from "../assets/work_background.png";
import card1 from "../assets/card_1.png";
import card2 from "../assets/card_2.png";
import card3 from "../assets/card_3.png";
import card4 from "../assets/card_4.png";

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    const ctx = gsap.context(() => {
      gsap.to(bg, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const items = [
    {
      title: "Plate Perfection",
      subtitle: "Restaurant website",
      image: card1,
    },
    {
      title: "Creative Branding",
      subtitle: "Andre Matos creative branding",
      image: card2,
    },
    {
      title: "Medical App",
      subtitle: "Find my Medical Spot App",
      image: card3,
    },
    {
      title: "Portfolio 2026",
      subtitle: "Personal portfolio experience",
      image: card4,
    },
  ];

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-[color:var(--ink)] text-[color:var(--pearl)] min-h-screen border-t border-[color:var(--pearl)]/10 overflow-hidden"
    >
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${workBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "translateY(0px)",
        }}
      />
      <div className="absolute inset-0 bg-[color:var(--ink)]/70" />

      <div className="relative w-full flex justify-center">
        <div className="w-full max-w-[1100px] py-20">
          <Reveal as="p" className="text-xs tracking-[0.25em] text-[color:var(--pearl)]/60 uppercase">
            Work
          </Reveal>

          <Reveal as="h2" className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Selected projects
          </Reveal>

          <div className="mt-12 space-y-10">
            {items.map((item, index) => (
              <div
                key={item.title}
                className="group relative border-t border-[color:var(--pearl)]/15 pt-8 pb-10"
              >
                <div className="max-w-[720px]">
                  <p className="text-sm uppercase tracking-[0.22em] text-[color:var(--pearl)]/55">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[color:var(--pearl)]/70">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pointer-events-none absolute right-0 top-1/2 hidden w-[320px] -translate-y-1/2 sm:block">
                  <div className="relative opacity-0 translate-y-6 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                    <div className="absolute inset-0 translate-y-3 scale-[1.02] blur-2xl bg-[color:var(--pearl)]/10 opacity-60" />
                    <div className="relative overflow-hidden rounded-xl border border-[color:var(--pearl)]/20 bg-[color:var(--ink)]/80 shadow-2xl">
                      <img
                        src={item.image}
                        alt={`${item.title} preview`}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:-translate-y-2"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
