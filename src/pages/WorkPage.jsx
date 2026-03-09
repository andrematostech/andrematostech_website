import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorkNavbar from "../components/WorkNavbar";
import Footer from "../sections/Footer";
import kivoLogo from "../assets/KIVO_logo.png";
import kivoDashboard from "../assets/KIVO_dashboard.png";
import kivoPhone from "../assets/Kivo_phone1.png";

function MockupFrame({ title, caption, tall = false, imageSrc, portrait = false }) {
  return (
    <figure className="w-full">
      <div className="w-full rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--ink)]/[0.04] shadow-[0_30px_80px_-50px_rgba(10,10,10,0.45)] overflow-hidden">
        <div
          className={`w-full overflow-hidden ${
            imageSrc
              ? portrait
                ? "h-[340px] sm:h-[480px] flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8"
                : tall
                  ? "h-[340px] sm:h-[480px]"
                  : "h-[260px] sm:h-[380px]"
              : tall
                ? "h-[340px] sm:h-[480px]"
                : "h-[260px] sm:h-[380px]"
          }`}>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={title}
              className={
                portrait
                  ? "max-h-full w-auto max-w-full object-contain"
                  : "h-full w-full object-contain"
              }
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[color:var(--ink)]/5 via-transparent to-[color:var(--ink)]/10" />
          )}
        </div>
      </div>
      <figcaption className="mt-6 text-base text-[color:var(--ink)]/65 leading-relaxed text-center">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function WorkPage({ title }) {
  const pageRef = useRef(null);
  const resolvedTitle = title || "KIVO";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-animate='heading']").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });

      gsap.utils.toArray("[data-animate='mockup']").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 20, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 80%" },
          }
        );
      });

      gsap.utils.toArray("[data-animate='parallax']").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 20 },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "bottom 10%",
              scrub: true,
            },
          }
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[color:var(--pearl)] text-[color:var(--ink)] flex flex-col app_workpage app_workpage_root">
      <WorkNavbar className="" />
      <main className="pt-56 flex-1 flex flex-col items-center text-center" style={{ paddingTop: "220px" }}>
        <section className="w-full flex justify-center text-center text-center">
          <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-10 pt-28 sm:pt-36 pb-24">
            <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-14 items-center">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-5 items-center text-center">
                  <div className="flex items-center justify-center gap-6">
                    <img src={kivoLogo} alt="KIVO logo" className="h-16 w-16 sm:h-20 sm:w-20 object-contain" loading="lazy" decoding="async" />
                  </div>
                  <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight" data-animate="heading">
                    {resolvedTitle}
                  </h1>
                  <p className="text-2xl sm:text-3xl text-[color:var(--ink)]/80 max-w-[720px] mx-auto">
                    Enterprise Retrieval-Augmented Generation (RAG) Platform
                  </p>
                  <p className="text-lg sm:text-xl text-[color:var(--ink)]/65 max-w-[760px] mx-auto">
                    Full-stack AI knowledge retrieval system with ingestion, vector search, grounded answers with citations, and observability.
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-[color:var(--ink)]/70">
                    {["RAG", "Vector Search", "Citations", "Analytics", "Observability"].map((badge) => (
                      <span
                        key={badge}
                        className="px-3 py-1.5 rounded-full border border-[color:var(--ink)]/15 bg-[color:var(--ink)]/5">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div data-animate="mockup" data-animate-parallax className="w-full">
                <div data-animate="parallax">
                  <MockupFrame
                    title="KIVO Platform"
                    caption="System overview dashboard showing ingestion activity, usage, and platform health."
                    imageSrc={kivoDashboard}
                    tall
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center text-center text-center py-24 sm:py-32">
          <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-10">
            <div className="flex flex-col gap-14 items-center">
              <div className="flex flex-col gap-6 items-center" data-animate="heading">
                <h2 className="text-4xl sm:text-5xl font-semibold">Overview</h2>
                <p className="text-lg sm:text-xl text-[color:var(--ink)]/70 max-w-[760px] mx-auto">
                  KIVO is a full-stack knowledge retrieval platform designed to turn organizational documents into a queryable, auditable knowledge system. It combines document ingestion, embedding generation, vector search, and LLM-based answer synthesis to deliver grounded responses with citations.
                </p>
              </div>

              <div className="grid grid-cols-1 justify-items-center text-center lg:grid-cols-[1.1fr_0.9fr] gap-16">
                <div className="flex flex-col gap-8">
                  <div className="rounded-2xl border border-[color:var(--ink)]/10 p-6 bg-[color:var(--ink)]/5">
                    <h3 className="text-xl font-semibold">My Role</h3>
                    <p className="mt-5 text-[color:var(--ink)]/70">
                      Designed and developed end-to-end (product, UX, frontend, backend, RAG pipeline).
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-6 items-center">
                  <h3 className="text-xl font-semibold">Core Capabilities</h3>
                  <ul className="space-y-2 text-[color:var(--ink)]/70">
                    <li>Document ingestion pipeline</li>
                    <li>Embeddings via OpenAI</li>
                    <li>Chroma vector search</li>
                    <li>Grounded answers + citations</li>
                    <li>Multi-knowledge-base structure</li>
                    <li>Ingestion status + document management</li>
                    <li>Query analytics + system metrics dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center text-center text-center py-24 sm:py-32 bg-[color:var(--ink)]/[0.03]">
          <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-10">
            <div className="flex flex-col gap-14 items-center">
              <div className="flex flex-col gap-6 items-center" data-animate="heading">
                <h2 className="text-4xl sm:text-5xl font-semibold">Project Goals</h2>
                <ul className="space-y-2 text-[color:var(--ink)]/70 max-w-[760px] mx-auto">
                  <li>Reduce time-to-answer from internal knowledge</li>
                  <li>Enforce grounding + citations to mitigate hallucinations</li>
                  <li>Support multiple knowledge bases and controlled ingestion</li>
                  <li>Provide enterprise-grade observability (usage, latency, failures)</li>
                  <li>Create a SaaS-style dashboard for day-to-day operations</li>
                </ul>
              </div>

              <div data-animate="mockup" className="w-full">
                <MockupFrame
                  title="Product Goals"
                  caption="System overview dashboard showing ingestion activity, usage, and platform health."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center text-center text-center py-24 sm:py-32">
          <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-10">
            <div className="flex flex-col gap-14 items-center">
              <div className="flex flex-col gap-6 items-center" data-animate="heading">
                <h2 className="text-4xl sm:text-5xl font-semibold">System Architecture</h2>
                <p className="text-lg sm:text-xl text-[color:var(--ink)]/70 max-w-[820px] mx-auto">
                  KIVO is designed as a modular RAG platform: ingestion and chunking feed embedding generation, indexed in a vector database for retrieval, then assembled into a grounded prompt to produce cited answers. Analytics and monitoring close the loop.
                </p>
              </div>

              <div data-animate="mockup">
                <MockupFrame
                  title="Architecture Diagram"
                  caption="Architecture of the RAG pipeline: ingestion ? embeddings ? vector search ? grounded answer + citations."
                  tall
                />
              </div>

              <div className="max-w-[760px] mx-auto">
                <h3 className="text-xl font-semibold">Architecture Highlights</h3>
                <ul className="mt-6 space-y-2 text-[color:var(--ink)]/70 text-center list-none">
                  <li>Ingestion ? chunking ? embedding ? indexing</li>
                  <li>Retrieval (top-k + metadata filters)</li>
                  <li>Citation mapping from retrieved chunks to UI references</li>
                  <li>Metrics and query logs for observability</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center text-center text-center py-24 sm:py-32 bg-[color:var(--ink)]/[0.03]">
          <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-10">
            <div className="grid grid-cols-1 justify-items-center text-center lg:grid-cols-[0.95fr_1.05fr] gap-16 items-center">
              <div className="flex flex-col gap-6 items-center" data-animate="heading">
                <h2 className="text-4xl sm:text-5xl font-semibold">Ingestion Management</h2>
                <p className="text-lg sm:text-xl text-[color:var(--ink)]/70">
                  Documents are ingested per knowledge base, tracked by processing status, and prepared for retrieval through chunking and embedding.
                </p>
              </div>
              <div data-animate="mockup">
                <MockupFrame
                  title="Ingestion"
                  caption="Ingestion management with per-document processing status and knowledge base organization."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center text-center text-center py-24 sm:py-32">
          <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-10">
            <div className="grid grid-cols-1 justify-items-center text-center lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
              <div data-animate="mockup">
                <MockupFrame
                  title="Ask AI"
                  caption="Ask AI interface producing grounded responses with source citations."
                  tall
                  imageSrc={kivoPhone}
                  portrait
                />
              </div>
              <div className="flex flex-col gap-6 items-center" data-animate="heading">
                <h2 className="text-4xl sm:text-5xl font-semibold">Ask AI (Grounded Answers with Citations)</h2>
                <p className="text-lg sm:text-xl text-[color:var(--ink)]/70">
                  The Ask AI interface retrieves relevant document chunks via vector search and generates answers grounded in retrieved sources. Citations link each claim back to its origin, supporting auditability and trust.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center text-center text-center py-24 sm:py-32 bg-[color:var(--ink)]/[0.03]">
          <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-10">
            <div className="grid grid-cols-1 justify-items-center text-center lg:grid-cols-[0.95fr_1.05fr] gap-16 items-center">
              <div className="flex flex-col gap-6 items-center" data-animate="heading">
                <h2 className="text-4xl sm:text-5xl font-semibold">Usage Analytics</h2>
                <p className="text-lg sm:text-xl text-[color:var(--ink)]/70">
                  Analytics reveal what users ask, which knowledge bases are most active, and how the system performs over time.
                </p>
              </div>
              <div data-animate="mockup">
                <MockupFrame
                  title="Analytics"
                  caption="Analytics charts tracking usage patterns and knowledge base activity."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center text-center text-center py-24 sm:py-32">
          <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-10">
            <div className="grid grid-cols-1 justify-items-center text-center lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
              <div data-animate="mockup">
                <MockupFrame
                  title="Monitoring"
                  caption="Latency and system metrics monitoring for reliability."
                />
              </div>
              <div className="flex flex-col gap-6 items-center" data-animate="heading">
                <h2 className="text-4xl sm:text-5xl font-semibold">Observability &amp; System Metrics</h2>
                <p className="text-lg sm:text-xl text-[color:var(--ink)]/70">
                  Latency, throughput, and failure modes are monitored to keep the platform reliable under real usage.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center text-center text-center py-24 sm:py-32 bg-[color:var(--ink)]/[0.03]">
          <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-10">
            <div className="grid grid-cols-1 justify-items-center text-center lg:grid-cols-[0.95fr_1.05fr] gap-16 items-center">
              <div className="flex flex-col gap-6 items-center" data-animate="heading">
                <h2 className="text-4xl sm:text-5xl font-semibold">Workspace</h2>
                <p className="text-lg sm:text-xl text-[color:var(--ink)]/70">
                  Built-in tools like announcements/messaging and calendar utilities support collaboration around organizational knowledge workflows.
                </p>
              </div>
              <div data-animate="mockup">
                <MockupFrame
                  title="Workspace"
                  caption="Workspace tools supporting announcements and coordination."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center text-center text-center py-24 sm:py-32">
          <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-10">
            <div className="flex flex-col gap-14 items-center">
              <div className="flex flex-col gap-6 items-center" data-animate="heading">
                <h2 className="text-4xl sm:text-5xl font-semibold">Engineering Highlights</h2>
              </div>
              <div className="grid grid-cols-1 justify-items-center text-center md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  "Retrieval strategy (top-k, filtering, ranking)",
                  "Chunking approach and citation mapping",
                  "Embedding batching / background jobs",
                  "Monitoring metrics and logging",
                  "Multi-knowledge-base architecture and separation",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--ink)]/5 p-6 text-[color:var(--ink)]/70">
                    <p className="text-base leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center text-center text-center py-24 sm:py-32 bg-[color:var(--ink)]/[0.03]">
          <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-10">
            <div className="flex flex-col gap-14 items-center">
              <div className="flex flex-col gap-6 items-center" data-animate="heading">
                <h2 className="text-4xl sm:text-5xl font-semibold">Tech Stack</h2>
              </div>
              <div className="grid grid-cols-1 justify-items-center text-center sm:grid-cols-2 gap-8 text-[color:var(--ink)]/70">
                <div>
                  <h3 className="text-xl font-semibold text-[color:var(--ink)]">Frontend</h3>
                  <ul className="mt-5 space-y-2 text-center list-none">
                    <li>React, Vite, GSAP, UI dashboard patterns</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[color:var(--ink)]">Backend</h3>
                  <ul className="mt-5 space-y-2 text-center list-none">
                    <li>FastAPI/Node, OpenAI embeddings, ChromaDB</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[color:var(--ink)]">System</h3>
                  <ul className="mt-5 space-y-2 text-center list-none">
                    <li>Ingestion pipeline, vector index, analytics/metrics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center text-center text-center py-24 sm:py-32">
          <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-10">
            <div className="rounded-3xl border border-[color:var(--ink)]/10 bg-[color:var(--ink)]/5 p-10 sm:p-14 text-center">
              <h2 className="text-4xl sm:text-5xl font-semibold">Want to see a demo?</h2>
              <p className="mt-6 text-[color:var(--ink)]/70 max-w-[640px] mx-auto">
                Lets walk through the KIVO platform experience, from ingestion to grounded answers and observability.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
                <Link
                  to="/work"
                  className="inline-flex items-center justify-center rounded-full border border-[color:var(--ink)]/20 px-6 py-3 text-sm font-medium text-[color:var(--ink)] hover:bg-[color:var(--ink)]/5 transition">
                  Back to Work
                </Link>
                <button className="inline-flex items-center justify-center rounded-full bg-[color:var(--ink)] text-[color:var(--pearl)] px-6 py-3 text-sm font-medium">
                  Request demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer className="" />
    </div>
  );
}













