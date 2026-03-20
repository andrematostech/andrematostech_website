import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PARTICLES = [
  { left: "8%", top: "14%", size: 2, opacity: 0.26, drift: 15, delay: -2.2, duration: 18 },
  { left: "16%", top: "26%", size: 3, opacity: 0.2, drift: 20, delay: -7.6, duration: 20 },
  { left: "24%", top: "12%", size: 2, opacity: 0.22, drift: 16, delay: -4.4, duration: 17 },
  { left: "32%", top: "34%", size: 2, opacity: 0.18, drift: 18, delay: -10.1, duration: 21 },
  { left: "38%", top: "18%", size: 3, opacity: 0.24, drift: 19, delay: -1.8, duration: 19 },
  { left: "46%", top: "8%", size: 2, opacity: 0.18, drift: 13, delay: -8.7, duration: 22 },
  { left: "52%", top: "28%", size: 2, opacity: 0.22, drift: 18, delay: -6.5, duration: 18 },
  { left: "58%", top: "16%", size: 3, opacity: 0.2, drift: 15, delay: -9.2, duration: 20 },
  { left: "64%", top: "36%", size: 2, opacity: 0.16, drift: 21, delay: -12.8, duration: 23 },
  { left: "72%", top: "12%", size: 2, opacity: 0.21, drift: 14, delay: -5.4, duration: 18 },
  { left: "80%", top: "28%", size: 3, opacity: 0.24, drift: 17, delay: -11.6, duration: 21 },
  { left: "88%", top: "18%", size: 2, opacity: 0.18, drift: 16, delay: -3.1, duration: 19 },
  { left: "12%", top: "54%", size: 2, opacity: 0.17, drift: 16, delay: -7.1, duration: 20 },
  { left: "20%", top: "68%", size: 3, opacity: 0.22, drift: 19, delay: -4.9, duration: 18 },
  { left: "28%", top: "58%", size: 2, opacity: 0.18, drift: 15, delay: -13.3, duration: 22 },
  { left: "36%", top: "74%", size: 2, opacity: 0.2, drift: 21, delay: -2.9, duration: 21 },
  { left: "44%", top: "62%", size: 3, opacity: 0.2, drift: 17, delay: -9.8, duration: 19 },
  { left: "52%", top: "84%", size: 2, opacity: 0.16, drift: 18, delay: -1.4, duration: 23 },
  { left: "60%", top: "66%", size: 2, opacity: 0.18, drift: 14, delay: -10.8, duration: 20 },
  { left: "68%", top: "78%", size: 3, opacity: 0.21, drift: 18, delay: -6.1, duration: 18 },
  { left: "76%", top: "58%", size: 2, opacity: 0.17, drift: 16, delay: -12.2, duration: 22 },
  { left: "84%", top: "72%", size: 2, opacity: 0.2, drift: 19, delay: -8.3, duration: 21 },
  { left: "92%", top: "56%", size: 3, opacity: 0.22, drift: 18, delay: -3.7, duration: 20 }
];

export default function ProjectsAtmosphere({ sectionRef = null }) {
  const rootRef = useRef(null);
  const glowPrimaryRef = useRef(null);
  const glowSecondaryRef = useRef(null);
  const particleLayerRef = useRef(null);
  const arcLayerRef = useRef(null);

  useEffect(() => {
    const section = sectionRef?.current;
    const root = rootRef.current;
    const glowPrimary = glowPrimaryRef.current;
    const glowSecondary = glowSecondaryRef.current;
    const particleLayer = particleLayerRef.current;
    const arcLayer = arcLayerRef.current;

    if (!section || !root || !glowPrimary || !glowSecondary || !particleLayer || !arcLayer) return;

    const ctx = gsap.context(() => {
      gsap.set([root, glowPrimary, glowSecondary, particleLayer, arcLayer], { y: 0 });

      gsap.to(root, {
        y: -120,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(glowPrimary, {
        y: -90,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(glowSecondary, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(particleLayer, {
        y: -42,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(arcLayer, {
        y: -76,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }, section);

    return () => ctx.revert();
  }, [sectionRef]);

  return (
    <div ref={rootRef} className="absolute inset-x-0 -top-[14%] -bottom-[16%] overflow-hidden app_projects_bg">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#05070d_0%,#07101d_28%,#08111f_58%,#06090f_100%)]" />

      <div
        ref={glowPrimaryRef}
        className="absolute left-1/2 top-[34%] h-[58rem] w-[72rem] -translate-x-1/2 rounded-full opacity-100 blur-[130px] app_projects_bg_glow app_projects_bg_glow--primary"
        style={{
          background:
            "radial-gradient(circle at center, rgba(78,132,255,0.16) 0%, rgba(78,132,255,0.11) 26%, rgba(41,77,176,0.07) 46%, rgba(9,16,29,0) 74%)"
        }}
      />

      <div
        ref={glowSecondaryRef}
        className="absolute left-[58%] top-[62%] h-[30rem] w-[46rem] -translate-x-1/2 rounded-full opacity-100 blur-[110px] app_projects_bg_glow app_projects_bg_glow--secondary"
        style={{
          background:
            "radial-gradient(circle at center, rgba(98,126,255,0.1) 0%, rgba(98,126,255,0.07) 30%, rgba(11,20,38,0) 72%)"
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.05),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.03),transparent_28%)] opacity-70" />

      <div ref={particleLayerRef} className="absolute inset-0 app_projects_particles" aria-hidden="true">
        {PARTICLES.map((particle, index) => (
          <span
            key={`${particle.left}-${particle.top}-${index}`}
            className="app_projects_particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              "--particle-drift": `${particle.drift}px`,
              "--particle-delay": `${particle.delay}s`,
              "--particle-duration": `${particle.duration}s`
            }}
          />
        ))}
      </div>

      <div ref={arcLayerRef} className="absolute inset-0 opacity-100 app_projects_arcs" aria-hidden="true">
        <svg
          viewBox="0 0 1600 1100"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          fill="none">
          <path
            d="M-120 640C164 420 558 372 884 472C1144 552 1398 758 1740 716"
            stroke="url(#projectsArcA)"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="app_projects_arc app_projects_arc--one"
          />
          <path
            d="M84 948C320 760 592 676 868 704C1126 730 1340 852 1572 1010"
            stroke="url(#projectsArcB)"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="app_projects_arc app_projects_arc--two"
          />
          <path
            d="M188 210C390 160 600 174 784 252C970 330 1140 476 1366 636"
            stroke="url(#projectsArcC)"
            strokeWidth="1"
            strokeLinecap="round"
            className="app_projects_arc app_projects_arc--three"
          />
          <defs>
            <linearGradient id="projectsArcA" x1="-120" y1="640" x2="1740" y2="716" gradientUnits="userSpaceOnUse">
              <stop stopColor="rgba(255,255,255,0)" />
              <stop offset="0.34" stopColor="#8cb6ff" stopOpacity="0.08" />
              <stop offset="0.72" stopColor="#759dff" stopOpacity="0.13" />
              <stop offset="1" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="projectsArcB" x1="84" y1="948" x2="1572" y2="1010" gradientUnits="userSpaceOnUse">
              <stop stopColor="rgba(255,255,255,0)" />
              <stop offset="0.4" stopColor="#7ea9ff" stopOpacity="0.08" />
              <stop offset="0.7" stopColor="#b6cbff" stopOpacity="0.11" />
              <stop offset="1" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="projectsArcC" x1="188" y1="210" x2="1366" y2="636" gradientUnits="userSpaceOnUse">
              <stop stopColor="rgba(255,255,255,0)" />
              <stop offset="0.42" stopColor="#84b6ff" stopOpacity="0.06" />
              <stop offset="0.78" stopColor="#97a8ff" stopOpacity="0.09" />
              <stop offset="1" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
