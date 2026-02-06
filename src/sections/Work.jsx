import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
        y: -280,
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
      href: "/workpage_1",
    },
    {
      title: "Creative Branding",
      subtitle: "Andre Matos creative branding",
      image: card2,
      href: "/workpage_2",
    },
    {
      title: "Medical App",
      subtitle: "Find my Medical Spot App",
      image: card3,
      href: "/workpage_3",
    },
    {
      title: "Portfolio 2026",
      subtitle: "Personal portfolio experience",
      image: card4,
      href: "/workpage_4",
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
        className="absolute inset-x-0 -top-[30%] -bottom-[30%]"
        style={{
          backgroundImage: `url(${workBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "translateY(0px) scale(1.25)",
          willChange: "transform",
        }}
      />
      <div className="absolute inset-0 bg-[color:var(--ink)]/70" />

      <div className="relative w-full flex justify-center">
        <div
          className="w-full max-w-[1100px]"
          style={{ paddingTop: "40px", paddingBottom: "80px" }}
        >
          <Reveal as="p" className="text-xs tracking-[0.25em] text-[color:var(--pearl)]/60 uppercase mt-6">
            Work
          </Reveal>

          <Reveal as="h2" className="mt-3 text-lg sm:text-xl font-semibold tracking-tight text-[color:var(--pearl)]/80">
            Selected projects
          </Reveal>

          <div className="space-y-10">
            <div style={{ height: "50px" }} />
            {items.map((item, index) => (
              <Link
                key={item.title}
                to={item.href}
                className={`work-card group relative block border-t border-[color:var(--pearl)]/15 pt-10 pb-12 ${
                  index === items.length - 1 ? "border-b border-[color:var(--pearl)]/15" : ""
                }`}
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 scale-y-0 origin-center transition-[opacity,transform] duration-1200 ease-out group-hover:opacity-100 group-hover:scale-y-100 z-0">
                  <img
                    src={item.image}
                    alt={`${item.title} background`}
                    className="h-full w-full object-cover transition-transform duration-200 ease-out scale-100 group-hover:scale-[1.06]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-[color:var(--ink)]/35" />
                </div>

                <div
                  className="mt-1 max-w-[720px] tracking-[0.05em] uppercase relative z-10"
                  style={{ paddingTop: "32px", paddingBottom: "32px", paddingLeft: "30px" }}
                >
                  <h3 className="text-5xl sm:text-6xl font-bold leading-[1.35]">
                    {item.title}
                  </h3>
                  <p className="mt-0 text-sm text-[color:var(--pearl)]/75 normal-case" style={{ marginTop: "15px" }}>
                    {item.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
