import { Link } from "react-router-dom";
import logoBlack from "../assets/logo_black.png";

export default function WorkNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[color:var(--pearl)]/80 backdrop-blur-100">
      <div className="h-16 flex justify-center">
        <div className="w-full max-w-[1100px] grid grid-cols-12 items-center">
          <div className="col-span-4">
            <Link
              to="/#work"
              className="inline-flex items-center gap-2 text-sm text-[color:var(--ink)]/70 hover:text-[color:var(--ink)]"
            >
              Back
            </Link>
          </div>

          <div className="col-span-4 flex justify-center">
            <Link to="/" className="inline-flex items-center gap-2" aria-label="Home">
              <div className="h-10 w-10">
                <img
                  src={logoBlack}
                  alt="andrematostech logo"
                  className="block h-full w-full object-contain"
                  decoding="async"
                />
              </div>
            </Link>
          </div>

          <div className="col-span-4" />
        </div>
      </div>
    </header>
  );
}
