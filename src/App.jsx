import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";

const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const ProjectPage2 = lazy(() => import("./pages/ProjectPage2"));
const ProjectPage3 = lazy(() => import("./pages/ProjectPage3"));
const ProjectPage4 = lazy(() => import("./pages/ProjectPage4"));

function AnimatedRoutes() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) return;

    const frame = window.requestAnimationFrame(() => {
      setTransitionStage("fadeOut");
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, displayLocation.pathname]);

  useEffect(() => {
    if (transitionStage !== "fadeOut") return;

    const timeout = window.setTimeout(() => {
      setDisplayLocation(location);
      setTransitionStage("fadeIn");
      if (!location.state?.scrollTo) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [location, transitionStage]);

  return (
    <div
      className={`app_route_shell ${
        transitionStage === "fadeOut" ? "app_route_shell--fadeOut" : "app_route_shell--fadeIn"
      }`}
    >
      <Suspense fallback={<div className="min-h-screen bg-[color:var(--ink)]" />}>
        <Routes location={displayLocation}>
          <Route path="/" element={<Home />} />
          <Route path="/projectpage" element={<ProjectPage />} />
          <Route path="/projectpage_2" element={<ProjectPage2 />} />
          <Route path="/projectpage_3" element={<ProjectPage3 />} />
          <Route path="/projectpage_4" element={<ProjectPage4 />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
