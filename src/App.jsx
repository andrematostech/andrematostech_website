import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WorkPage1 from "./pages/WorkPage1";
import WorkPage2 from "./pages/WorkPage2";
import WorkPage3 from "./pages/WorkPage3";
import WorkPage4 from "./pages/WorkPage4";

export default function App() {
  return (
    <BrowserRouter className="">
      <Routes className="">
        <Route path="/" element={<Home className="" />} className="" />
        <Route path="/workpage_1" element={<WorkPage1 className="" />} className="" />
        <Route path="/workpage_2" element={<WorkPage2 className="" />} className="" />
        <Route path="/workpage_3" element={<WorkPage3 className="" />} className="" />
        <Route path="/workpage_4" element={<WorkPage4 className="" />} className="" />
      </Routes>
    </BrowserRouter>);

}