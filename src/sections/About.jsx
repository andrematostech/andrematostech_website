import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "../components/Reveal.jsx";
import coderImage from "../assets/coder.png";

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

    const ctx = gsap.context(() => {
      // Slide in from left as About enters (inverse of Hero feel)
      gsap.fromTo(
        image,
        { x: -140, opacity: 0, y: 12 },
        {
          x: 0,
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 92%",
            end: "top 45%",
            scrub: 0.7,
          },
        }
      );

      // Slide in text from right as About enters
      gsap.fromTo(
        text,
        { x: 140, opacity: 0, y: 12 },
        {
          x: 0,
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 92%",
            end: "top 45%",
            scrub: 0.7,
          },
        }
      );

      // Scroll out About (like Hero) when passing the section
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
        .to(image, { x: -140, opacity: 0, ease: "none" }, 0)
        .to(text, { x: 140, opacity: 0, ease: "none" }, 0);

      // Subtle parallax on about image while scrolling inside About (inverse)
      gsap.to(image, {
        y: -28,
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

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-neutral-950 text-white min-h-screen flex items-center"
    >
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div
              ref={imageRef}
              className="aspect-[4/5] w-full overflow-hidden"
            >
              <img
                src={coderImage}
                alt="Developer at work"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div ref={textRef} className="lg:col-span-7">
            <Reveal as="p" className="text-xs tracking-[0.25em] text-white/50 uppercase">
              About
            </Reveal>

            <Reveal as="h2" className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
              Portugal-based software developer with a background in IT and multimedia.
            </Reveal>

            <p className="mt-4 text-white/70 leading-relaxed">
              I work with JavaScript, Python, C#, and Java, using tools like React, Node,
              and .NET. I enjoy turning ideas into clean, functional digital experiences —
              focused on performance, usability, and real-world problem solving.
            </p>

            <p className="mt-4 text-white/70 leading-relaxed">
              I’ve worked on web design and scalable app projects, always learning and using
              technology to create meaningful user experiences.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
