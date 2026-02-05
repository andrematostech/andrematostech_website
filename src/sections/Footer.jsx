export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-white border-t border-white/10">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1100px] py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-white text-black grid place-items-center text-sm font-semibold">
              AM
            </div>
            <div>
              <p className="text-sm font-semibold">André Matos</p>
              <p className="text-xs text-white/60">Software Developer</p>
            </div>
          </div>

          <p className="text-xs text-white/50">
            © {year} André Matos. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
