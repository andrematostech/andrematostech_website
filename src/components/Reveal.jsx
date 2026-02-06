// /src/components/Reveal.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Reveal({
  as = "div",
  className = "",
  children,
  delay = 0,
  y = 24,
  x = 0,
  duration = 0.9,
  start = "top 85%",
  once = true
}) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { autoAlpha: 0, y, x },
        {
          autoAlpha: 1,
          y: 0,
          x: 0,
          duration,
          ease: "power3.out",
          delay,
          scrollTrigger: {
            trigger: wrap,
            start,
            toggleActions: once ? "play none none none" : "play reverse play reverse"
          }
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, [delay, duration, once, start, x, y]);

  const Tag = as;

  return (
    <Tag ref={wrapRef} className={`${`${className} app_reveal`} app_reveal_tag_001`} style={{ overflow: "hidden" }}>
      <span
        ref={innerRef}
        className="app_reveal_inner"
        style={{ display: "inline-block", willChange: "transform,opacity" }}>
        
        {children}
      </span>
    </Tag>);

}