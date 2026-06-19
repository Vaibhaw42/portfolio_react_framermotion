import { useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { projects } from "../../data/projects";
import "./work.scss";

const Card = ({ p }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      ref={ref}
      className={`work__card${p.featured ? " is-featured" : ""}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="work__image">
        <img src={p.image} alt={`${p.title} preview`} loading="lazy" />
      </div>
      <div className="work__body">
        <div className="work__title-row">
          <h3>{p.title}</h3>
          <span className="work__year">{p.year}</span>
        </div>
        <p>{p.summary}</p>
        <div className="work__tags">
          {p.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
        <div className="work__links">
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer noopener" className="btn btn--ghost" data-cursor="hover">Live ↗</a>
          )}
          {p.repo && (
            <a href={p.repo} target="_blank" rel="noreferrer noopener" className="btn btn--ghost" data-cursor="hover">Code ↗</a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const Work = () => {
  const [filter, setFilter] = useState("All");

  const tags = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set)];
  }, []);

  const visible = useMemo(() => {
    const filtered = filter === "All"
      ? projects
      : projects.filter((p) => p.tags.includes(filter));
    return [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [filter]);

  return (
    <section id="work" className="work" aria-labelledby="work-title">
      <div className="work__inner">
        <header className="work__header">
          <span className="work__label">Work</span>
          <h2 id="work-title">Selected projects.</h2>
        </header>

        <div className="work__filters" aria-label="Filter by tag">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={filter === tag}
              className={`work__filter${filter === tag ? " is-active" : ""}`}
              onClick={() => setFilter(tag)}
              data-cursor="hover"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="work__grid">
          {visible.map((p) => <Card key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
};

export default Work;
