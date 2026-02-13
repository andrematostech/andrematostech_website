import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import coderImage from "../assets/man.png";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const lineTopRef = useRef(null);
  const textRef = useRef(null);
  const lineBottomRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;
    const lineTop = lineTopRef.current;
    const lineBottom = lineBottomRef.current;

    if (!section || !image || !text || !lineTop || !lineBottom) return;
    const leftGroup = [image, lineTop];
    const rightGroup = [text, lineBottom];

    const ctx = gsap.context(() => {
      // Ensure content is visible even if animations fail
      gsap.set([...leftGroup, ...rightGroup], { opacity: 1, x: 0, y: 0 });

      // Slide in from left as About enters (inverse of Hero feel)
      gsap.fromTo(
        leftGroup,
        { x: -140, opacity: 0, y: 12 },
        {
          x: 0,
          opacity: 1,
          y: 0,
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

      // Slide in text from right as About enters
      gsap.fromTo(
        rightGroup,
        { x: 140, opacity: 0, y: 12 },
        {
          x: 0,
          opacity: 1,
          y: 0,
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

      // Scroll out About (like Hero) when passing the section
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      }).
      to(leftGroup, { x: -140, opacity: 0, ease: "none" }, 0).
      to(rightGroup, { x: 140, opacity: 0, ease: "none" }, 0);

      // Subtle parallax on about image while scrolling inside About (inverse)
      gsap.to(image, {
        y: -28,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Lines move slower than content
      gsap.to([lineTop, lineBottom], {
        y: -6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
          invalidateOnRefresh: true
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-[color:var(--ink)] text-[color:var(--pearl)] min-h-screen flex items-start sm:items-center app_about app_about_section">

      <div className="absolute inset-0 pointer-events-none app_about_bg" aria-hidden="true" style={{ zIndex: 0 }} />
      
      <div className="w-full flex justify-center app_about_container pt-16 sm:pt-0" style={{ paddingBottom: "40px", position: "relative", zIndex: 1 }}>
        <div className="w-full max-w-[1100px] px-6 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center relative app_about_grid">
          <div
            ref={lineTopRef}
            className="absolute h-px w-screen app_about_line app_about_line_top"
            style={{ top: "calc(18% - 150px)", left: "calc(-1 * (100vw - 100%)/2)" }}
          />
          <div
            ref={lineBottomRef}
            className="absolute h-px w-screen app_about_line app_about_line_bottom"
            style={{ top: "calc(72% + 170px)", left: "calc(-1 * (100vw - 100%)/2)" }}
          />
          <div className="lg:col-span-5 app_about_media relative overflow-visible flex justify-center lg:justify-start pt-8 sm:pt-0">
            <div
              ref={imageRef}
              className="relative mx-auto aspect-[4/5] w-full max-w-[320px] sm:max-w-[360px] overflow-hidden app_about_image_wrap">
              <img
                src={coderImage}
                alt="Developer at work"
                className="h-full w-full object-contain app_about_image"
                loading="lazy"
                decoding="async" />
              
            </div>
          </div>

          <div ref={textRef} className="lg:col-span-7 app_about_content relative">
            <p className="text-xs tracking-[0.25em] text-[color:var(--pearl)]/50 uppercase app_about_kicker">About
            </p>

            <h2 className="mt-3 text-base sm:text-lg font-semibold tracking-tight app_about_title">Portugal-based software developer with a background in IT and multimedia.
            </h2>

            <p className="mt-3 text-sm sm:text-base text-[color:var(--pearl)]/70 leading-relaxed app_about_text">
              I work with JavaScript, Python, C#, and Java, using tools like React, Node,
              and .NET. I enjoy turning ideas into clean, functional digital experiences —
              focused on performance, usability, and real-world problem solving.
            </p>

            <p className="mt-3 text-sm sm:text-base text-[color:var(--pearl)]/70 leading-relaxed app_about_text">
              I’ve worked on web design and scalable app projects, always learning and using
              technology to create meaningful user experiences.
            </p>

            <div className="flex items-center gap-6 app_about_social">
              <a
                href="https://github.com/andrematostech"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="text-[color:var(--pearl)]/80 hover:text-[color:var(--pearl)] transition-colors app_about_social_link">
                <FaGithub size={22} />
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-[color:var(--pearl)]/80 hover:text-[color:var(--pearl)] transition-colors app_about_social_link">
                <FaLinkedinIn size={22} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>);

}


