import { motion } from "framer-motion";
import { useMagnetic } from "../../hooks/useMagnetic";
import ParticleField from "./ParticleField";
import "./hero.scss";

const textVariants = {
  initial: { y: 24, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 },
  },
};

const Hero = () => {
  const workRef = useMagnetic();
  const contactRef = useMagnetic();

  return (
    <section id="home" className="hero">
      <ParticleField />
      <motion.div
        className="hero__inner"
        variants={textVariants}
        initial="initial"
        animate="animate"
      >
        <motion.span variants={textVariants} className="hero__eyebrow">
          Full-stack developer
        </motion.span>
        <motion.h1 variants={textVariants} className="hero__title">
          Building tools<br />that ship.
        </motion.h1>
        <motion.p variants={textVariants} className="hero__sub">
          I design, build, and ship modern web products end-to-end.
        </motion.p>
        <motion.div variants={textVariants} className="hero__ctas">
          <a ref={workRef} href="#work" className="btn btn--primary" data-cursor="hover">View work</a>
          <a ref={contactRef} href="#contact" className="btn btn--ghost" data-cursor="hover">Contact</a>
        </motion.div>
      </motion.div>
      <a className="hero__scroll" href="#about" aria-label="Scroll to about">
        <span />
      </a>
    </section>
  );
};

export default Hero;
