import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { about } from "../../data/about";
import { useMagnetic } from "../../hooks/useMagnetic";
import "./about.scss";

const parseValue = (v) => {
  const match = String(v).match(/(\d+)(.*)/);
  if (!match) return { target: 0, suffix: String(v) };
  return { target: parseInt(match[1], 10), suffix: match[2] };
};

const Counter = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);
  const { target, suffix } = parseValue(value);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
};

const About = () => {
  const resumeRef = useMagnetic();

  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <motion.div
        className="about__inner"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="about__media">
          <img src={about.image} alt="" loading="lazy" />
        </div>
        <div className="about__body">
          <span className="about__label">About</span>
          <h2 id="about-title">A short intro.</h2>
          {about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          <p className="about__current">{about.current}</p>
          <div className="about__stats">
            {about.stats.map((s) => (
              <div key={s.label} className="about__stat">
                <div className="about__stat-value"><Counter value={s.value} /></div>
                <div className="about__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <a
            ref={resumeRef}
            href="/resume.pdf"
            download
            className="btn btn--primary"
            data-cursor="hover"
          >
            Download résumé
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
