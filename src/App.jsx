import "./styles/globals.scss";
import { Analytics } from "@vercel/analytics/react";
import Cursor from "./components/cursor/Cursor";
import ScrollProgress from "./components/scrollProgress/ScrollProgress";
import Navbar from "./components/navbar/Navbar";
import Hero from "./components/hero/Hero";
import About from "./components/about/About";
import Stack from "./components/stack/Stack";
import Experience from "./components/experience/Experience";
import Certifications from "./components/certifications/Certifications";
import Work from "./components/work/Work";
import Github from "./components/github/Github";
import Contact from "./components/contact/Contact";

const App = () => (
  <>
    <a href="#main" className="skip-link">Skip to content</a>
    <ScrollProgress />
    <Cursor />
    <Navbar />
    <main id="main">
      <Hero />
      <About />
      <Stack />
      <Experience />
      <Certifications />
      <Work />
      <Github />
      <Contact />
    </main>
    <Analytics />
  </>
);

export default App;
