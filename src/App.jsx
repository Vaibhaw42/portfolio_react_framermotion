import "./styles/globals.scss";
import Cursor from "./components/cursor/Cursor";
import ScrollProgress from "./components/scrollProgress/ScrollProgress";
import Navbar from "./components/navbar/Navbar";
import Hero from "./components/hero/Hero";
import About from "./components/about/About";
import Stack from "./components/stack/Stack";
import Experience from "./components/experience/Experience";
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
      <Work />
      <Github />
      <Contact />
    </main>
  </>
);

export default App;
