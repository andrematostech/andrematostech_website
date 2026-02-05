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

    // Observe changes that affect layout/visibility
    const observer = new IntersectionObserver(() => computeActive(), {
      root: null,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    elements.forEach((el) => observer.observe(el));

    // Also update on resize (center changes)
    window.addEventListener("resize", computeActive);
    // Initial
    computeActive();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", computeActive);
    };
  }, [sectionIds, offsetPx]);

  return active;
}
