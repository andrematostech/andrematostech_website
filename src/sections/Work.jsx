import Reveal from "../components/Reveal.jsx";

export default function Work() {
  return (
    <section
      id="work"
      className="bg-neutral-950 text-white min-h-screen flex items-center border-t border-white/10"
    >
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1100px]">
          <Reveal as="p" className="text-xs tracking-[0.25em] text-white/50 uppercase">
            Work
          </Reveal>

          <Reveal as="h2" className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Selected projects
          </Reveal>

          <div className="mt-10 border border-white/10 bg-white/5 p-8 text-white/70">
            Work section placeholder — we’ll define your projects and layout next.
          </div>
        </div>
      </div>
    </section>
  );
}
