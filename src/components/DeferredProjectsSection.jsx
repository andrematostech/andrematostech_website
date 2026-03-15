import { useEffect, useRef, useState } from "react";

export default function DeferredProjectsSection({ eager = false }) {
  const hostRef = useRef(null);
  const [ProjectsSection, setProjectsSection] = useState(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let observer = null;
    let idleId = null;
    let timeoutId = null;

    const load = async () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;

      const module = await import("../sections/Projects");
      if (!cancelled) {
        setProjectsSection(() => module.default);
      }
    };

    const node = hostRef.current;
    if (eager) {
      load();
      return () => {
        cancelled = true;
      };
    }

    if (node && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            load();
            observer?.disconnect();
          }
        },
        { rootMargin: "900px 0px" }
      );
      observer.observe(node);
    } else {
      timeoutId = window.setTimeout(load, 1200);
    }

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(load, { timeout: 1800 });
    } else {
      timeoutId = window.setTimeout(load, 1800);
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [eager]);

  if (ProjectsSection) {
    return <ProjectsSection sectionId="projects" />;
  }

  return (
    <section
      id="projects"
      ref={hostRef}
      aria-hidden="true"
      className="relative z-[2] min-h-screen border-t border-[color:var(--pearl)]/10 bg-[color:var(--ink)]"
    />
  );
}
