import { motion } from "framer-motion";
import { certifications } from "../../data/certifications";
import "./certifications.scss";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Certifications = () => (
  <section id="certifications" className="certs" aria-labelledby="certs-title">
    <div className="certs__inner">
      <span className="certs__label">Certifications</span>
      <h2 id="certs-title">Learning trail.</h2>
      <div className="certs__grid">
        {certifications.map((c, i) => {
          const inner = (
            <>
              <div className="certs__icon" aria-hidden="true">✱</div>
              <div className="certs__body">
                <h3>{c.name}</h3>
                <p>{c.issuer}{c.year ? ` · ${c.year}` : ""}</p>
                {c.url && <span className="certs__cta">Verify ↗</span>}
              </div>
            </>
          );
          return c.url ? (
            <motion.a
              key={i}
              href={c.url}
              target="_blank"
              rel="noreferrer noopener"
              className="certs__card"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={cardVariants}
              data-cursor="hover"
            >
              {inner}
            </motion.a>
          ) : (
            <motion.div
              key={i}
              className="certs__card certs__card--nolink"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={cardVariants}
            >
              {inner}
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Certifications;
