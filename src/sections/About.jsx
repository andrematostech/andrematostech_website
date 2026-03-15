import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import coderImage from "../assets/man.png";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;

    if (!section || !image || !text) return;
    const leftGroup = [image];
    const rightGroup = [text];

    const ctx = gsap.context(() => {
      gsap.set([...leftGroup, ...rightGroup], { opacity: 1, x: 0, y: 0 });
      gsap.set(section, { backgroundColor: "rgba(248, 246, 242, 0)" });

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

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      })
        .to(leftGroup, { x: -140, opacity: 0, ease: "none" }, 0)
        .to(rightGroup, { x: 140, opacity: 0, ease: "none" }, 0);

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

      gsap.to(section, {
        backgroundColor: "rgba(248, 246, 242, 1)",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 62%",
          end: "top -8%",
          scrub: true
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden text-[color:var(--ink)] min-h-screen flex items-start sm:items-center app_about app_about_section"
    >
      <div
        className="w-full flex justify-center app_about_container"
        style={{ paddingTop: "30px", paddingBottom: "40px", position: "relative", zIndex: 10 }}
      >
        <div className="w-full max-w-[1100px] px-6 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center relative app_about_grid">
          <div className="lg:col-span-5 app_about_media relative overflow-visible flex justify-center lg:justify-start pt-12 sm:pt-0">
            <div
              ref={imageRef}
              className="relative mx-auto aspect-[4/5] w-full max-w-[320px] sm:max-w-[360px] overflow-hidden mt-2 sm:mt-0 app_about_image_wrap"
            >
              <img
                src={coderImage}
                alt="Developer building projects"
                className="h-full w-full object-contain app_about_image"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div ref={textRef} className="lg:col-span-7 app_about_content relative">
            <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-[color:var(--ink)]/46 sm:text-[14px] sm:leading-[1.7] app_about_kicker">
              About
            </p>

            <h2 className="mt-5 text-lg sm:text-xl font-bold tracking-tight app_about_title">
              Portugal-based software developer working across backend and modern web technologies.
            </h2>

            <p className="mt-1 text-sm sm:text-base text-[color:var(--ink)]/70 leading-relaxed app_about_text">
              &nbsp;
            </p>

            <p className="mt-5 text-sm sm:text-base text-[color:var(--ink)]/68 leading-relaxed app_about_text">
              I build applications using Java, Python, and JavaScript, developing APIs and full-stack solutions.
            </p>

            <p className="mt-4 text-sm sm:text-base text-[color:var(--ink)]/68 leading-relaxed app_about_text">
              I&apos;m particularly interested in system design and AI-driven applications, and I focus on writing
              clear, maintainable code while continuously improving my technical skills.
            </p>

            <div className="flex items-center gap-6 app_about_social" style={{ marginBottom: "32px" }}>
              <a
                href="https://github.com/andrematostech"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="text-[color:var(--ink)]/72 hover:text-[color:var(--ink)] transition-colors app_about_social_link"
              >
                <FaGithub size={22} />
              </a>
              <a
                href="https://www.linkedin.com/in/andrematostech/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-[color:var(--ink)]/72 hover:text-[color:var(--ink)] transition-colors app_about_social_link"
              >
                <FaLinkedinIn size={22} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
