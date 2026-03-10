// src/hooks/useActiveSection.js
import { useEffect, useState } from "react";

export function useActiveSection(sectionIds, { offsetPx = 0 } = {}) {
  const [active, setActive] = useState(sectionIds[0]);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return;

    const computeActive = () => {
      const centerY = window.innerHeight / 2 + offsetPx;

      let bestId = sectionIds[0];
      let bestDist = Number.POSITIVE_INFINITY;

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - centerY);

        if (dist < bestDist) {
          bestDist = dist;
          bestId = el.id;
        }
      }

      setActive(bestId);
    };

    let rafId = 0;
    const requestCompute = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        computeActive();
      });
    };

    const observer = new IntersectionObserver(() => computeActive(), {
      root: null,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    elements.forEach((el) => observer.observe(el));

    window.addEventListener("scroll", requestCompute, { passive: true });
    window.addEventListener("resize", requestCompute);
    computeActive();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestCompute);
      window.removeEventListener("resize", requestCompute);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [sectionIds, offsetPx]);

  return active;
}
