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
  const formRef = useRef(null);
  const [form, setForm] = useState({ from_name: "", reply_to: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    const form = formRef.current;
    if (!section || !copy || !form) return;

    const ctx = gsap.context(() => {
      // Slide in from sides as Contact enters (like About)
      gsap.fromTo(
        copy,
        { x: -140, opacity: 0, y: 12 },
        {
          x: 0,
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 92%",
            end: "top 45%",
            scrub: 0.7
          }
        }
      );

      gsap.fromTo(
        form,
        { x: 140, opacity: 0, y: 12 },
        {
          x: 0,
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 92%",
            end: "top 45%",
            scrub: 0.7
          }
        }
      );

      // Scroll out Contact (like Hero)
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      }).to(copy, { x: -140, opacity: 0, ease: "none" }, 0).
      to(form, { x: 140, opacity: 0, ease: "none" }, 0);

      // Subtle parallax while scrolling inside Contact
      gsap.to([copy, form], {
        y: 28,
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
      className="relative overflow-hidden bg-[color:var(--ink)] text-[color:var(--pearl)] min-h-screen flex items-center border-t border-[color:var(--pearl)]/10 app_contact app_contact_section">

      <div className="absolute inset-0 pointer-events-none overflow-hidden app_contact_bg" style={{ zIndex: 0 }}>
        <div className="app_contact_bg_canvas">
          <svg
            className="app_contact_bg_svg"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
          <g className="app_contact_bg_lines">
            <path d="M110 160 L300 120 L520 200 L720 140 L950 210" />
            <path d="M140 260 L360 240 L560 300 L780 250 L1010 300" />
            <path d="M180 420 L420 500 L680 520 L960 460" />
            <path d="M110 160 L140 260 L180 420" />
            <path d="M300 120 L360 240 L420 500" />
            <path d="M520 200 L560 300 L680 520" />
            <path d="M720 140 L780 250 L960 460" />
            <path d="M950 210 L1010 300 L960 460" />
            <path d="M300 120 L520 200" />
            <path d="M520 200 L720 140" />
            <path d="M360 240 L560 300" />
            <path d="M560 300 L780 250" />
            <path d="M420 500 L680 520" />
            <path d="M680 520 L960 460" />
          </g>
          <g className="app_contact_bg_dots">
            <circle cx="110" cy="160" r="1.8" />
            <circle cx="300" cy="120" r="1.3" />
            <circle cx="520" cy="200" r="1.6" />
            <circle cx="720" cy="140" r="1.6" />
            <circle cx="950" cy="210" r="1.4" />
            <circle cx="140" cy="260" r="1.4" />
            <circle cx="360" cy="240" r="1.2" />
            <circle cx="560" cy="300" r="1.7" />
            <circle cx="780" cy="250" r="1.3" />
            <circle cx="1010" cy="300" r="1.5" />
            <circle cx="180" cy="420" r="1.5" />
            <circle cx="420" cy="500" r="1.7" />
            <circle cx="680" cy="520" r="1.6" />
            <circle cx="960" cy="460" r="1.4" />
          </g>
          <defs>
            <path id="netPath1" d="M110 160 L300 120 L520 200 L720 140 L950 210" />
            <path id="netPath2" d="M140 260 L360 240 L560 300 L780 250 L1010 300" />
            <path id="netPath3" d="M180 420 L420 500 L680 520 L960 460" />
            <path id="netPath4" d="M110 160 L140 260 L180 420" />
            <path id="netPath5" d="M300 120 L360 240 L420 500" />
            <path id="netPath6" d="M520 200 L560 300 L680 520" />
            <path id="netPath7" d="M720 140 L780 250 L960 460" />
            <path id="netPath8" d="M950 210 L1010 300 L960 460" />
          </defs>
          <g className="app_contact_bg_comets">
            <circle r="1.6">
              <animateMotion dur="9s" repeatCount="indefinite" keyTimes="0;1" keySplines="0.4 0 0.2 1" calcMode="spline">
                <mpath href="#netPath1" />
              </animateMotion>
              <animate attributeName="opacity" values="0;1;0" dur="9s" repeatCount="indefinite" />
            </circle>
            <circle r="1.4">
              <animateMotion dur="10.5s" repeatCount="indefinite" keyTimes="0;1" keySplines="0.4 0 0.2 1" calcMode="spline">
                <mpath href="#netPath2" />
              </animateMotion>
              <animate attributeName="opacity" values="0;1;0" dur="10.5s" repeatCount="indefinite" />
            </circle>
            <circle r="1.5">
              <animateMotion dur="11s" repeatCount="indefinite" keyTimes="0;1" keySplines="0.4 0 0.2 1" calcMode="spline">
                <mpath href="#netPath3" />
              </animateMotion>
              <animate attributeName="opacity" values="0;1;0" dur="11s" repeatCount="indefinite" />
            </circle>
            <circle r="1.3">
              <animateMotion dur="8.5s" repeatCount="indefinite" keyTimes="0;1" keySplines="0.4 0 0.2 1" calcMode="spline">
                <mpath href="#netPath4" />
              </animateMotion>
              <animate attributeName="opacity" values="0;1;0" dur="8.5s" repeatCount="indefinite" />
            </circle>
          </g>
          </svg>
        </div>
      </div>

      <div className="relative z-10 w-full flex justify-center app_contact_container">
        <div className="w-full max-w-[1100px] px-6 sm:px-6 app_contact_inner">
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

            <div ref={formRef} className="lg:col-span-7 app_contact_form_wrap">
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
