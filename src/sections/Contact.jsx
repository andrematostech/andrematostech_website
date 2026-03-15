import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "emailjs-com";

gsap.registerPlugin(ScrollTrigger);

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TO_NAME = "Andre Matos";

export default function Contact() {
  const sectionRef = useRef(null);
  const copyRef = useRef(null);
  const formRef = useRef(null);
  const [form, setForm] = useState({
    from_name: "",
    reply_to: "",
    message: "",
    website: ""
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    const formWrap = formRef.current;
    if (!section || !copy || !formWrap) return;

    const ctx = gsap.context(() => {
      gsap.set([copy, formWrap], { opacity: 1, x: 0, y: 0 });

      gsap.fromTo(
        copy,
        { x: -140, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "top 92%",
            end: "top 45%",
            scrub: 0.7
          }
        }
      );

      gsap.fromTo(
        formWrap,
        { x: 140, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "top 92%",
            end: "top 45%",
            scrub: 0.7
          }
        }
      );

      const scrollOutTl = gsap.timeline({ paused: true })
        .to(copy, { x: -140, opacity: 0, ease: "none" }, 0)
        .to(formWrap, { x: 140, opacity: 0, ease: "none" }, 0);

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          if (self.direction === -1) {
            scrollOutTl.progress(self.progress);
          } else {
            scrollOutTl.progress(0);
          }
        },
        onLeave: () => scrollOutTl.progress(0),
        onEnter: () => scrollOutTl.progress(0),
        onEnterBack: () => scrollOutTl.progress(0),
        onLeaveBack: () => scrollOutTl.progress(0)
      });

      const parallaxTween = gsap.to([copy, formWrap], {
        y: 28,
        ease: "none",
        paused: true
      });
      let allowParallax = false;
      const resetY = () => gsap.set([copy, formWrap], { y: 0, overwrite: "auto" });

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          if (allowParallax && self.direction === -1) {
            parallaxTween.progress(self.progress);
          } else {
            parallaxTween.progress(0);
            resetY();
          }
        },
        onLeave: () => {
          allowParallax = false;
          parallaxTween.progress(0);
          resetY();
        },
        onEnter: () => {
          allowParallax = false;
          parallaxTween.progress(0);
          resetY();
        },
        onEnterBack: () => {
          allowParallax = true;
          parallaxTween.progress(0);
          resetY();
        },
        onLeaveBack: () => {
          allowParallax = false;
          parallaxTween.progress(0);
          resetY();
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (error) setError("");
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const name = form.from_name.trim();
    const email = form.reply_to.trim();
    const message = form.message.trim();

    if (form.website) return;
    if (!name || !email || !message) return;
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (message.length < 20) {
      setError("Message should be at least 20 characters.");
      return;
    }
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setError("Contact form is not configured yet.");
      return;
    }

    setLoading(true);
    setError("");

    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: name,
          reply_to: email,
          message,
          to_name: TO_NAME
        },
        PUBLIC_KEY
      )
      .then(() => {
        setLoading(false);
        setSent(true);
        setForm({ from_name: "", reply_to: "", message: "", website: "" });
        window.setTimeout(() => setSent(false), 5000);
      })
      .catch(() => {
        setLoading(false);
        setError("Something went wrong. Please try again.");
      });
  };

  const isValid = form.from_name.trim() && form.reply_to.trim() && form.message.trim();

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-[color:var(--ink)] text-[color:var(--pearl)] min-h-screen flex items-center border-t border-[color:var(--pearl)]/10 app_contact app_contact_section"
    >
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
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 app_contact_grid">
            <div ref={copyRef} className="lg:col-span-5 app_contact_copy">
              <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-[color:var(--pearl)]/50 sm:text-[14px] sm:leading-[1.7] app_contact_kicker">
                Contact
              </p>

              <h2 className="mt-5 text-lg sm:text-xl font-bold tracking-tight app_contact_title">
                Open to new opportunities and collaborations.
              </h2>

              <p className="mt-6 text-[color:var(--pearl)]/70 leading-relaxed app_contact_text">
                Feel free to reach out and I&apos;ll get back to you as soon as possible.
              </p>
            </div>

            <div ref={formRef} className="lg:col-span-7 app_contact_form_wrap">
              <form onSubmit={onSubmit} className="space-y-10 app_contact_form">
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={onChange}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />

                <label className="block text-sm sm:text-base text-[color:var(--pearl)]/80 app_contact_label">
                  Name
                  <input
                    name="from_name"
                    value={form.from_name}
                    onChange={onChange}
                    required
                    className="mt-3 w-full bg-transparent border-b border-[color:var(--pearl)]/25 pb-3 text-[color:var(--pearl)] placeholder:text-[color:var(--pearl)]/30 focus:outline-none focus:border-[color:var(--pearl)]/60 app_contact_input"
                  />
                </label>

                <label className="block text-sm sm:text-base text-[color:var(--pearl)]/80 app_contact_label">
                  Email
                  <input
                    name="reply_to"
                    type="email"
                    value={form.reply_to}
                    onChange={onChange}
                    required
                    className="mt-3 w-full bg-transparent border-b border-[color:var(--pearl)]/25 pb-3 text-[color:var(--pearl)] placeholder:text-[color:var(--pearl)]/30 focus:outline-none focus:border-[color:var(--pearl)]/60 app_contact_input"
                  />
                </label>

                <label className="block text-sm sm:text-base text-[color:var(--pearl)]/80 app_contact_label">
                  Message
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={onChange}
                    required
                    className="mt-3 w-full bg-transparent border-b border-[color:var(--pearl)]/25 pb-3 text-[color:var(--pearl)] placeholder:text-[color:var(--pearl)]/30 focus:outline-none focus:border-[color:var(--pearl)]/60 app_contact_input"
                  />
                </label>

                {error ? <p className="text-sm text-red-300">{error}</p> : null}

                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className="w-full border border-[color:var(--pearl)]/40 text-sm sm:text-base font-medium text-[color:var(--pearl)] transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:border-[color:var(--pearl)] hover:text-[color:var(--pearl)] app_contact_button"
                  style={{ paddingTop: "14px", paddingBottom: "14px" }}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {sent ? (
        <div className="fixed bottom-6 right-6 z-50 rounded-md border border-[color:var(--pearl)]/30 bg-[color:var(--ink)]/90 px-4 py-3 text-sm text-[color:var(--pearl)] app_contact_toast">
          Email has been sent
        </div>
      ) : null}
    </section>
  );
}
