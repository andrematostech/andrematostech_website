import Reveal from "../components/Reveal.jsx";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-neutral-950 text-white min-h-screen flex items-center border-t border-white/10"
    >
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1100px]">
          <Reveal as="p" className="text-xs tracking-[0.25em] text-white/50 uppercase">
            Contact
          </Reveal>

          <Reveal as="h2" className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Let’s build something
          </Reveal>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <p className="text-white/70 leading-relaxed">
                Use the form to send me a message. For now this opens your email client (mailto).
                Later, we can connect a real form backend.
              </p>
            </div>

            <div className="lg:col-span-7">
              <form
                className="border border-white/10 bg-white/5 p-6 sm:p-8"
                method="GET"
                action="mailto:your@email.com"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="text-sm text-white/80">
                    Name
                    <input
                      name="name"
                      className="mt-2 w-full bg-black/40 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="text-sm text-white/80">
                    Email
                    <input
                      name="email"
                      type="email"
                      className="mt-2 w-full bg-black/40 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="you@example.com"
                    />
                  </label>
                </div>

                <label className="mt-4 block text-sm text-white/80">
                  Message
                  <textarea
                    name="body"
                    rows={5}
                    className="mt-2 w-full bg-black/40 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Tell me about your project…"
                  />
                </label>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <p className="text-xs text-white/50">This will open your default email app.</p>

                  <button
                    type="submit"
                    className="bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90"
                  >
                    Send
                  </button>
                </div>
              </form>

              <p className="mt-3 text-xs text-white/50">
                Replace <span className="text-white/80">your@email.com</span> with your real email when ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
