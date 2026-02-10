// /src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// Smooth scrolling (inertia)
let lenis;
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  try {
    lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      smoothTouch: true
    });
  } catch {
    lenis = null;
  }
}

// expose for anchor navigation
if (typeof window !== "undefined" && lenis) {
  window.lenis = lenis;
}

if (lenis) {
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    // gsap time is seconds; Lenis expects ms
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(1000, 16);

  // keep ScrollTrigger in sync after layout shifts
  ScrollTrigger.addEventListener("refresh", () => lenis.resize());
  window.addEventListener("load", () => ScrollTrigger.refresh());
  ScrollTrigger.refresh();
} else {
  ScrollTrigger.refresh();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <App className="" />
);
