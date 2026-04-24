import { Link } from "react-router-dom";
import logoWhite from "../assets/logo_white.png";

export default function ProjectNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#06174A]/72 backdrop-blur-100 app_work_nav app_work_nav_header">
      <div className="h-14 sm:h-16 flex justify-center app_work_nav_bar">
        <div className="w-full max-w-[1100px] px-6 sm:px-6 grid grid-cols-12 items-center app_work_nav_inner">
          <div className="col-span-4 app_work_nav_back">
            <Link
              to="/"
              state={{ scrollTo: "projects" }}
              aria-label="Back to projects"
              title="Back to projects"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white app_work_nav_back_link">
              Back
            </Link>
          </div>

          <div className="col-span-4 flex justify-center app_work_nav_logo">
            <Link
              to="/"
              state={{ scrollTo: "projects" }}
              className="inline-flex items-center gap-2 app_work_nav_logo_link"
              aria-label="Home">
              <div className="h-6 w-6 sm:h-8 sm:w-8 app_work_nav_logo_wrap">
                <img
                  src={logoWhite}
                  alt="andrematostech logo"
                  className="block h-full w-full object-contain app_work_nav_logo_img"
                  decoding="async" />
                
              </div>
            </Link>
          </div>

          <div className="col-span-4 app_work_nav_spacer" />
        </div>
      </div>
    </header>);

}
