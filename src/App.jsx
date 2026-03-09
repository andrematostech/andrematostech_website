import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import WorkPage from "./pages/WorkPage";
import WorkPage2 from "./pages/WorkPage2";
import WorkPage3 from "./pages/WorkPage3";
import WorkPage4 from "./pages/WorkPage4";

function AnimatedRoutes() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("fadeOut");
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (transitionStage !== "fadeOut") return;

    const timeout = window.setTimeout(() => {
      setDisplayLocation(location);
      setTransitionStage("fadeIn");
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [location, transitionStage]);

  return (
    <div
      className={`app_route_shell ${
        transitionStage === "fadeOut" ? "app_route_shell--fadeOut" : "app_route_shell--fadeIn"
      }`}>
      <Routes location={displayLocation} className="">
        <Route path="/" element={<Home className="" />} className="" />
        <Route path="/workpage" element={<WorkPage className="" />} className="" />
        <Route path="/workpage_2" element={<WorkPage2 className="" />} className="" />
        <Route path="/workpage_3" element={<WorkPage3 className="" />} className="" />
        <Route path="/workpage_4" element={<WorkPage4 className="" />} className="" />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter className="">
      <AnimatedRoutes />
    </BrowserRouter>);

}
