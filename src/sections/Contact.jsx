import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "emailjs-com";
import Reveal from "../components/Reveal.jsx";

gsap.registerPlugin(ScrollTrigger);

const SERVICE_ID = "service_5z690ec";
const TEMPLATE_ID = "template_ryyregq";
const PUBLIC_KEY = "9-OQDjG5XPZ5hXrRT";

export default function Contact() {
  const sectionRef = useRef(null);
  const copyRef = useRef(null);
  const [form, setForm] = useState({ from_name: "", reply_to: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    if (!section || !copy) return;

    const ctx = gsap.context(() => {
      gsap.to(copy, {
        y: -28,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const name = form.from_name.trim();
    const email = form.reply_to.trim();
    const message = form.message.trim();
    if (!name || !email || !message) return;

    setLoading(true);

    const toNameInput = e.target.querySelector('input[name="to_name"]');
    if (toNameInput) {
      toNameInput.value = "André Matos";
    }

    emailjs.
    sendForm(SERVICE_ID, TEMPLATE_ID, e.target, PUBLIC_KEY).
    then(() => {
      setLoading(false);
      setSent(true);
      setForm({ from_name: "", reply_to: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    }).
    catch(() => {
      setLoading(false);
    });
  };

  const isValid =
  form.from_name.trim() && form.reply_to.trim() && form.message.trim();

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-[color:var(--ink)] text-[color:var(--pearl)] min-h-screen flex items-center border-t border-[color:var(--pearl)]/10 app_contact app_contact_section">

      <div className="w-full flex justify-center app_contact_container">
        <div className="w-full max-w-[1100px] px-[52px] sm:px-6 app_contact_inner">
          <Reveal as="p" className="text-xs tracking-[0.25em] text-[color:var(--pearl)]/50 uppercase app_contact_kicker">
            Contact
          </Reveal>

          <Reveal as="h2" className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight app_contact_title">
            Let’s build something
          </Reveal>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 app_contact_grid">
            <div ref={copyRef} className="lg:col-span-5 app_contact_copy">
              <p className="text-[color:var(--pearl)]/70 leading-relaxed app_contact_text">
                Let’s talk about your project. Fill the form and I’ll get back to you.
              </p>
            </div>

            <div className="lg:col-span-7 app_contact_form_wrap">
              <form onSubmit={onSubmit} className="space-y-10 app_contact_form">
                <input type="hidden" name="to_name" value="André Matos" className="" />
                <label className="block text-sm sm:text-base text-[color:var(--pearl)]/80 app_contact_label">
                  Name
                  <input
                    name="from_name"
                    value={form.from_name}
                    onChange={onChange}
                    required
                    className="mt-3 w-full bg-transparent border-b border-[color:var(--pearl)]/25 pb-3 text-[color:var(--pearl)] placeholder:text-[color:var(--pearl)]/30 focus:outline-none focus:border-[color:var(--pearl)]/60 app_contact_input" />
                  
                </label>

                <label className="block text-sm sm:text-base text-[color:var(--pearl)]/80 app_contact_label">
                  Email
                  <input
                    name="reply_to"
                    type="email"
                    value={form.reply_to}
                    onChange={onChange}
                    required
                    className="mt-3 w-full bg-transparent border-b border-[color:var(--pearl)]/25 pb-3 text-[color:var(--pearl)] placeholder:text-[color:var(--pearl)]/30 focus:outline-none focus:border-[color:var(--pearl)]/60 app_contact_input" />
                  
                </label>

                <label className="block text-sm sm:text-base text-[color:var(--pearl)]/80 app_contact_label">
                  Message
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={onChange}
                    required
                    className="mt-3 w-full bg-transparent border-b border-[color:var(--pearl)]/25 pb-3 text-[color:var(--pearl)] placeholder:text-[color:var(--pearl)]/30 focus:outline-none focus:border-[color:var(--pearl)]/60 app_contact_input" />
                  
                </label>

                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className="w-full border border-[color:var(--pearl)]/40 py-8 text-base sm:text-lg font-medium text-[color:var(--pearl)] transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:border-[color:var(--pearl)] hover:text-[color:var(--pearl)] app_contact_button">
                  
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {sent &&
      <div className="fixed bottom-6 right-6 z-50 rounded-md border border-[color:var(--pearl)]/30 bg-[color:var(--ink)]/90 px-4 py-3 text-sm text-[color:var(--pearl)] app_contact_toast">
          Email has been sent
        </div>
      }
    </section>);

}
