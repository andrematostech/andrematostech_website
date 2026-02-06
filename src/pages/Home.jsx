import Navbar from "../components/Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Work from "../sections/Work";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[color:var(--pearl)] text-[color:var(--ink)] app_home app_home_root">
      <Navbar />
      <main className="pt-14 sm:pt-16 app_home_main">
        <Hero className="" />
        <About className="" />
        <Work className="" />
        <Contact className="" />
      </main>
      <Footer />
    </div>);

}
