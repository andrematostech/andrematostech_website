import Reveal from "../components/Reveal.jsx";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-[color:var(--ink)] text-[color:var(--pearl)] min-h-screen flex items-center border-t border-[color:var(--pearl)]/10"
    >
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1100px]">
          <Reveal as="p" className="text-xs tracking-[0.25em] text-[color:var(--pearl)]/50 uppercase">
            Contact
          </Reveal>

          <Reveal as="h2" className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Let’s build something
          </Reveal>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <p className="text-[color:var(--pearl)]/70 leading-relaxed">
                Use the form to send me a message. For now this opens your email client (mailto).
                Later, we can connect a real form backend.
              </p>
            </div>

            <div className="lg:col-span-7">
              <form
                className="border border-[color:var(--pearl)]/10 bg-[color:var(--pearl)]/5 p-6 sm:p-8"
                method="GET"
                action="mailto:your@email.com"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="text-sm text-[color:var(--pearl)]/80">
                    Name
                    <input
                      name="name"
                      className="mt-2 w-full bg-black/30 border border-[color:var(--pearl)]/10 px-4 py-3 text-[color:var(--pearl)] placeholder:text-[color:var(--pearl)]/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--pearl)]/20"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="text-sm text-[color:var(--pearl)]/80">
                    Email
                    <input
                      name="email"
                      type="email"
                      className="mt-2 w-full bg-black/30 border border-[color:var(--pearl)]/10 px-4 py-3 text-[color:var(--pearl)] placeholder:text-[color:var(--pearl)]/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--pearl)]/20"
                      placeholder="you@example.com"
                    />
                  </label>
                </div>

                <label className="mt-4 block text-sm text-[color:var(--pearl)]/80">
                  Message
                  <textarea
                    name="body"
                    rows={5}
                    className="mt-2 w-full bg-black/30 border border-[color:var(--pearl)]/10 px-4 py-3 text-[color:var(--pearl)] placeholder:text-[color:var(--pearl)]/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--pearl)]/20"
                    placeholder="Tell me about your project…"
                  />
                </label>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <p className="text-xs text-[color:var(--pearl)]/50">This will open your default email app.</p>

                  <button
                    type="submit"
                    className="bg-[color:var(--pearl)] text-[color:var(--ink)] px-6 py-3 text-sm font-medium hover:bg-[color:var(--pearl)]/90"
                  >
                    Send
                  </button>
                </div>
              </form>

              <p className="mt-3 text-xs text-[color:var(--pearl)]/50">
                Replace <span className="text-[color:var(--pearl)]/80">your@email.com</span> with your real email when ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
