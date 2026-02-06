import { useEffect } from "react";
import WorkNavbar from "../components/WorkNavbar";
import Footer from "../sections/Footer";
import card2 from "../assets/card_2.png";

export default function WorkPage2() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen bg-[color:var(--pearl)] text-[color:var(--ink)] flex flex-col">
      <WorkNavbar />
      <main className="pt-20 flex-1">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[1100px] py-16 flex flex-col items-center text-center">
            <div style={{ marginTop: "100px" }}>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-center">
                Work Page 2
              </h1>
              <p
                className="mx-auto max-w-[720px] text-[color:var(--ink)]/70 text-base leading-relaxed text-center"
                style={{ textAlign: "center", marginTop: "32px" }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                ea commodo consequat. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>

            <div className="flex flex-col items-center w-full" style={{ marginTop: "30px" }}>
              <div className="w-full h-[420px] border border-[color:var(--ink)]/10 bg-[color:var(--ink)]/5 overflow-hidden">
                <img
                  src={card2}
                  alt="Work page 2 preview"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="text-sm text-[color:var(--ink)]/65 leading-relaxed text-center" style={{ marginTop: "30px" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                commodo ligula eget dolor. Aenean massa.
              </p>
              <div
                className="w-full h-[320px] border border-[color:var(--ink)]/10 bg-[color:var(--ink)]/5"
                style={{ marginTop: "30px" }}
              />
            </div>

            <p className="mt-10 text-center text-sm text-[color:var(--ink)]/60">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div style={{ height: "60px" }} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
