import { motion } from "framer-motion";
import { stack } from "../../data/stack";
import "./stack.scss";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const chipVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Stack = () => (
  <section id="stack" className="stack" aria-labelledby="stack-title">
    <div className="stack__inner">
      <span className="stack__label">Stack</span>
      <h2 id="stack-title">Tools I reach for.</h2>
      {stack.map((group) => (
        <motion.div
          key={group.group}
          className="stack__group"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
        >
          <h3>{group.group}</h3>
          <div className="stack__chips">
            {group.items.map((item) => (
              <motion.span key={item.slug} className="stack__chip" variants={chipVariants}>
                <img
                  src={`https://cdn.simpleicons.org/${item.slug}/8b8b96`}
                  alt=""
                  width="20"
                  height="20"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                {item.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Stack;
