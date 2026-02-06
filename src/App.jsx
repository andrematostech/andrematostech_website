import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WorkPage1 from "./pages/WorkPage1";
import WorkPage2 from "./pages/WorkPage2";
import WorkPage3 from "./pages/WorkPage3";
import WorkPage4 from "./pages/WorkPage4";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workpage_1" element={<WorkPage1 />} />
        <Route path="/workpage_2" element={<WorkPage2 />} />
        <Route path="/workpage_3" element={<WorkPage3 />} />
        <Route path="/workpage_4" element={<WorkPage4 />} />
      </Routes>
    </BrowserRouter>
  );
}
