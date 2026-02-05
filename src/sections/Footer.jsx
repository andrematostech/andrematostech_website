import logoWhite from "../assets/logo_white.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-[color:var(--ink)] text-[color:var(--pearl)] border-t border-[color:var(--pearl)]/10"
      style={{ paddingTop: "10px", paddingBottom: "10px" }}
    >
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1100px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-[25px] w-[25px]">
              <img
                src={logoWhite}
                alt="André Matos logo"
                className="block h-full w-full object-contain"
                decoding="async"
              />
            </div>
            <div>
              <p className="text-xs font-semibold">André Matos</p>
              <p className="text-xs text-[color:var(--pearl)]/60">Software Developer</p>
            </div>
          </div>

          <p className="text-xs text-[color:var(--pearl)]/50">
            © {year} André Matos. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
