import logoWhite from "../assets/logo_white.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-[color:var(--ink)] text-[color:var(--pearl)] border-t border-[color:var(--pearl)]/10 app_footer app_footer_section"
      style={{ paddingTop: "10px", paddingBottom: "10px" }}>
      
      <div className="w-full flex justify-center app_footer_container">
        <div className="w-full max-w-[1100px] px-[52px] sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 app_footer_inner">
          <div className="flex items-center gap-2 app_footer_brand">
            <div className="h-[25px] w-[25px] app_footer_logo">
              <img
                src={logoWhite}
                alt="André Matos logo"
                className="block h-full w-full object-contain app_footer_logo_img"
                decoding="async" />
              
            </div>
            <div className="app_footer_brand_text">
              <p className="text-xs font-semibold app_footer_brand_name">André Matos</p>
              <p className="text-xs text-[color:var(--pearl)]/60 app_footer_brand_role">Software Developer</p>
            </div>
          </div>

          <p className="text-xs text-[color:var(--pearl)]/50 app_footer_copy">
            © {year} André Matos. All rights reserved.
          </p>
        </div>
      </div>
    </footer>);

}
