import { motion } from "framer-motion";
import { experience } from "../../data/experience";
import "./experience.scss";

const Experience = () => (
  <section id="experience" className="experience" aria-labelledby="experience-title">
    <div className="experience__inner">
      <span className="experience__label">Experience</span>
      <h2 id="experience-title">Selected timeline.</h2>
      <ol className="experience__list">
        {experience.map((e, i) => (
          <motion.li
            key={i}
            className="experience__item"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <header>
              <h3>{e.role} · <span>{e.company}</span></h3>
              <span className="experience__meta">{e.start} — {e.end} · {e.location}</span>
            </header>
            <ul>
              {e.highlights.map((h, j) => <li key={j}>{h}</li>)}
            </ul>
            <div className="experience__tags">
              {e.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  </section>
);

export default Experience;
