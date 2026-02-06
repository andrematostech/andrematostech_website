import Navbar from "../components/Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Work from "../sections/Work";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[color:var(--pearl)] text-[color:var(--ink)]">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <About />
        <Work />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
