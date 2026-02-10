import { Link } from "react-router-dom";
import logoBlack from "../assets/logo_black.png";

export default function WorkNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[color:var(--pearl)]/80 backdrop-blur-100 app_work_nav app_work_nav_header">
      <div className="h-14 sm:h-16 flex justify-center app_work_nav_bar">
        <div className="w-full max-w-[1100px] px-6 sm:px-6 grid grid-cols-12 items-center app_work_nav_inner">
          <div className="col-span-4 app_work_nav_back">
            <Link
              to="/#work"
              className="inline-flex items-center gap-2 text-sm text-[color:var(--ink)]/70 hover:text-[color:var(--ink)] app_work_nav_back_link">
              
              Back
            </Link>
          </div>

          <div className="col-span-4 flex justify-center app_work_nav_logo">
            <Link to="/" className="inline-flex items-center gap-2 app_work_nav_logo_link" aria-label="Home">
              <div className="h-8 w-8 sm:h-10 sm:w-10 app_work_nav_logo_wrap">
                <img
                  src={logoBlack}
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
