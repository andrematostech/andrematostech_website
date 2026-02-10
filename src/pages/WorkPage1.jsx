import { useEffect } from "react";
import WorkNavbar from "../components/WorkNavbar";
import Footer from "../sections/Footer";
import card1 from "../assets/card_1.png";

export default function WorkPage1() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen bg-[color:var(--pearl)] text-[color:var(--ink)] flex flex-col app_workpage app_workpage_root">
      <WorkNavbar className="" />
      <main className="pt-20 flex-1 app_workpage_main">
        <div className="w-full flex justify-center app_workpage_container">
          <div className="w-full max-w-[1100px] px-6 sm:px-6 py-12 sm:py-16 flex flex-col items-center text-center app_workpage_inner">
            <div className="app_workpage_header" style={{ marginTop: "100px" }}>
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-center app_workpage_title">
                Work Page 1
              </h1>
              <p
                className="mx-auto max-w-[720px] text-[color:var(--ink)]/70 text-base leading-relaxed text-center app_workpage_desc"
                style={{ textAlign: "center", marginTop: "32px" }}>
                
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                ea commodo consequat. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>

            <div className="flex flex-col items-center w-full app_workpage_body" style={{ marginTop: "30px" }}>
              <div className="w-full h-[260px] sm:h-[420px] border border-[color:var(--ink)]/10 bg-[color:var(--ink)]/5 overflow-hidden app_workpage_image app_workpage_image_primary">
                <img
                  src={card1}
                  alt="Work page 1 preview"
                  className="h-full w-full object-cover app_workpage_image_img"
                  loading="lazy"
                  decoding="async" />
                
              </div>
              <p className="text-sm text-[color:var(--ink)]/65 leading-relaxed text-center app_workpage_caption" style={{ marginTop: "30px" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                commodo ligula eget dolor. Aenean massa.
              </p>
              <div
                className="w-full h-[200px] sm:h-[320px] border border-[color:var(--ink)]/10 bg-[color:var(--ink)]/5 app_workpage_image app_workpage_image_secondary"
                style={{ marginTop: "30px" }} />
              
            </div>

            <p className="mt-10 text-center text-sm text-[color:var(--ink)]/60 app_workpage_footer_text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div className="app_workpage_spacer" style={{ height: "60px" }} />
          </div>
        </div>
      </main>
      <Footer className="" />
    </div>);

}
