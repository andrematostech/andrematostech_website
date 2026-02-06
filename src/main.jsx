// /src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Smooth scrolling (inertia)
const lenis = new Lenis({
  lerp: 0.08, // lower = more glide
  smoothWheel: true,
  smoothTouch: false
});

// expose for anchor navigation
if (typeof window !== "undefined") {
  window.lenis = lenis;
}

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  // gsap time is seconds; Lenis expects ms
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode className="">
    <App className="" />
  </React.StrictMode>
);