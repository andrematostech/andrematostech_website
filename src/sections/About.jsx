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

      gsap.fromTo(
        leftGroup,
        { x: -160, opacity: 0, y: 0 },
        {
          x: 0,
          opacity: 1,
          y: 0,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "top 28%",
            end: "top 12%",
            scrub: 0.4
          }
        }
      );

      gsap.fromTo(
        rightGroup,
        { x: 0, opacity: 0, y: 156 },
        {
          x: 0,
          opacity: 1,
          y: 0,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "top 28%",
            end: "top 12%",
            scrub: 0.4
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden min-h-screen flex items-start sm:items-center bg-[color:var(--ink)] text-[color:var(--pearl)] app_about app_about_section"
      style={{ backgroundColor: "#0a0a0a" }}
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
            <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-[color:var(--pearl)]/46 sm:text-[14px] sm:leading-[1.7] app_about_kicker">
              About
            </p>

            <h2 className="mt-5 text-lg sm:text-xl font-bold tracking-tight text-[color:var(--pearl)] app_about_title">
              Portugal-based AI software developer focused on building intelligent applications and scalable systems.
            </h2>

            <p className="mt-5 text-[17px] leading-[28px] text-[color:var(--pearl)]/68 app_about_text">
              I work across backend and modern web technologies using Python, JavaScript, and Java, developing APIs,
              data pipelines, and AI-driven tools.
            </p>

            <p className="mt-4 text-[17px] leading-[28px] text-[color:var(--pearl)]/68 app_about_text">
              I&apos;m particularly interested in system design, AI applications, and building products that combine
              strong engineering with thoughtful user experience.
            </p>

            <div className="flex items-center gap-6 app_about_social" style={{ marginBottom: "32px" }}>
              <a
                href="https://github.com/andrematostech"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="text-[color:var(--pearl)]/72 transition-[color,filter,transform] duration-300 hover:text-[color:var(--pearl)] hover:[filter:drop-shadow(0_0_10px_rgba(132,188,255,0.34))] hover:scale-[1.03] app_about_social_link"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/andrematostech/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-[color:var(--pearl)]/72 transition-[color,filter,transform] duration-300 hover:text-[color:var(--pearl)] hover:[filter:drop-shadow(0_0_10px_rgba(132,188,255,0.34))] hover:scale-[1.03] app_about_social_link"
              >
                <FaLinkedinIn size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
