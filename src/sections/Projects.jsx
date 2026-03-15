import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import workBg from "../assets/work_background.png";
import kivoWorkcard from "../assets/KIVO_workcard_2.png";
import kivoWorkcardTablet from "../assets/KIVO_workcard_tablet.png";
import kivoWorkcardPhone from "../assets/KIVO_workcard_phone.png";
import card2 from "../assets/card_2.png";
import card3 from "../assets/card_3.png";
import card4 from "../assets/card_4.png";

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    title: "KIVO",
    subtitle: "Enterprise retrieval platform with ingestion, grounded answers, and observability.",
    collapsedSubtitle: "Enterprise RAG",
    meta: "AI platform",
    image: kivoWorkcard,
    tabletImage: kivoWorkcardTablet,
    phoneImage: kivoWorkcardPhone,
    href: "/projectpage"
  },
  {
    title: "Creative Branding",
    subtitle: "Identity system, motion direction, and visual language for a personal creative brand.",
    collapsedSubtitle: "Brand identity",
    meta: "Brand system",
    image: card2,
    href: "/projectpage_2"
  },
  {
    title: "Medical App",
    subtitle: "Mobile-first healthcare flow focused on discoverability and patient clarity.",
    collapsedSubtitle: "Health product",
    meta: "Product design",
    image: card3,
    href: "/projectpage_3"
  },
  {
    title: "Portfolio 2026",
    subtitle: "Experimental portfolio experience blending editorial rhythm with motion.",
    collapsedSubtitle: "Portfolio build",
    meta: "Frontend build",
    image: card4,
    href: "/projectpage_4"
  }
];

export default function Projects({ sectionId = "projects" }) {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const headerRef = useRef(null);
  const railViewportRef = useRef(null);
  const railRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const railViewport = railViewportRef.current;
    const rail = railRef.current;
    const header = headerRef.current;
    const cards = cardRefs.current.filter(Boolean);

    if (!section || !bg || !railViewport || !rail || !header || !cards.length) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const setActiveCard = (activeIndex) => {
        cards.forEach((card, index) => {
          card.dataset.active = index === activeIndex ? "true" : "false";
        });
      };

      gsap.set(header, { opacity: 1, x: 0, y: 0 });
      gsap.set(cards, { opacity: 1, x: 0, y: 0 });
      setActiveCard(0);

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 92%",
          toggleActions: "play none none reset"
        }
      })
        .fromTo(
          header,
          { opacity: 0, y: -48, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out"
          }
        )
        .fromTo(
          cards,
          { opacity: 0, y: -64, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: "power4.out"
          },
          0.08
        );

      gsap.to(bg, {
        y: -260,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      mm.add("(min-width: 1024px)", () => {
        const getEnd = () => {
          return window.innerHeight * 1.15;
        };

        gsap.set(rail, { x: 0 });
        gsap.set(header, { opacity: 1, y: 0 });

        gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getEnd()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              const sequenceProgress = progress;
              const activeIndex = Math.min(cards.length - 1, Math.floor(sequenceProgress * cards.length));
              setActiveCard(activeIndex);
            },
            onRefresh: () => setActiveCard(0),
            onLeaveBack: () => setActiveCard(0)
          }
        });
      });

      mm.add("(max-width: 1023px)", () => {
        cards.forEach((card) => {
          card.dataset.active = "true";
        });
        gsap.set(header, { opacity: 1, y: 0 });

        gsap.fromTo(
          cards,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              end: "top 38%",
              scrub: 0.7
            }
          }
        );
      });

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id={sectionId || undefined}
      ref={sectionRef}
      className="relative z-[2] bg-[color:var(--ink)] text-[color:var(--pearl)] min-h-screen border-t border-[color:var(--pearl)]/10 overflow-hidden app_work app_work_section"
      style={{ "--project-expand": 0 }}>
      <div
        ref={bgRef}
        className="absolute inset-x-0 -top-[30%] -bottom-[30%] app_work_bg"
        style={{
          backgroundImage: `url(${workBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "translateY(0px) scale(1.25)",
          willChange: "transform"
        }}
      />

      <div className="absolute inset-0 bg-[color:var(--ink)]/72 app_work_overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_38%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.08),transparent_42%)] opacity-80" />

      <div className="relative w-full flex justify-center app_work_container">
        <div
          className="w-full max-w-[1400px] px-6 sm:px-6 flex flex-col app_work_inner"
          style={{ paddingTop: "92px", paddingBottom: "92px" }}>
          <div ref={headerRef} className="max-w-[760px] app_work_header">
            <p className="mt-6 text-[13px] font-bold uppercase tracking-[0.22em] text-[color:var(--pearl)]/55 sm:text-[14px] sm:leading-[1.7] app_work_kicker">
              Projects
            </p>
            <h2 className="mt-5 text-lg sm:text-xl font-bold tracking-tight text-[color:var(--pearl)]/80 app_work_title">
              Selected projects
            </h2>
          </div>

          <div className="overflow-hidden app_work_stage" ref={railViewportRef}>
            <div ref={railRef} className="flex items-stretch justify-center gap-0 w-full app_work_rail">
              {items.map((item, index) => (
                <Link
                  key={item.title}
                  to={item.href}
                  data-active={index === 0 ? "true" : "false"}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className="group relative flex h-[520px] sm:h-[600px] lg:h-[70vh] lg:max-h-[820px] min-h-[500px] overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.05] shadow-[0_32px_100px_-58px_rgba(0,0,0,0.85)] backdrop-blur-[10px] transition-[flex-basis,border-color,transform,background-color,border-radius] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:border-white/40 focus-visible:bg-white/[0.08] hover:border-white/22 hover:bg-white/[0.08] app_work_card_slider"
                >
                  <picture className="absolute inset-0">
                    {item.phoneImage ? <source media="(max-width: 639px)" srcSet={item.phoneImage} /> : null}
                    {item.tabletImage ? <source media="(max-width: 1023px)" srcSet={item.tabletImage} /> : null}
                    <img
                      src={item.image}
                      alt={`${item.title} preview`}
                      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-[opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 app_work_card_media"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.1)_0%,rgba(8,8,10,0.68)_56%,rgba(8,8,10,0.94)_100%)] opacity-95 app_work_card_tint" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.16),transparent_34%)] opacity-80 mix-blend-screen app_work_card_glow" />

                  <div className="relative z-10 flex h-full w-full flex-col justify-between px-6 pt-6 pb-10 sm:px-8 sm:pt-8 sm:pb-14">
                    <div className="flex items-start justify-between gap-4">
                      <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/62 app_work_card_tag">
                        {item.meta}
                      </span>
                      <span className="text-xs text-white/40 app_work_card_index">{`0${index + 1}`}</span>
                    </div>

                    <div className="app_work_card_compact">
                      <h3 className="app_work_card_compact_title">{item.title}</h3>
                      <p className="app_work_card_compact_desc">{item.collapsedSubtitle}</p>
                    </div>

                    <div className="flex h-full items-end pb-10 sm:pb-14">
                      <div className="flex h-full items-center justify-center app_work_card_spine">
                        <div className="app_work_card_collapsed">
                          <div className="app_work_card_collapsed_col app_work_card_collapsed_col_title">
                            <span
                              className="text-[2.3rem] sm:text-[2.75rem] font-extrabold uppercase tracking-[0.1em] text-white/90 app_work_card_vertical"
                              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                              {item.title}
                            </span>
                          </div>
                          <div className="app_work_card_collapsed_col app_work_card_collapsed_col_desc">
                            <p
                              className="text-[1rem] sm:text-[1.15rem] leading-relaxed text-white/66 app_work_card_collapsed_desc"
                              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                              {item.collapsedSubtitle}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 self-end pl-4 sm:pl-6 max-w-[26rem] flex flex-col gap-8 sm:gap-10 app_work_card_body">
                        <h3 className="text-[3.25rem] sm:text-[4.2rem] lg:text-[5.45rem] font-extrabold leading-[0.88] tracking-[-0.03em] text-white">
                          {item.title}
                        </h3>
                        <p className="max-w-[23rem] text-[1rem] sm:text-[1.08rem] leading-relaxed text-white/76">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
