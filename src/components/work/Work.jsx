import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { projects } from "../../data/projects";
import "./work.scss";

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

        <div className="work__filters" role="tablist" aria-label="Filter by tag">
          {tags.map((tag) => (
            <button
              key={tag}
              role="tab"
              aria-selected={filter === tag}
              className={`work__filter${filter === tag ? " is-active" : ""}`}
              onClick={() => setFilter(tag)}
              data-cursor="hover"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="work__grid">
          {visible.map((p) => (
            <motion.article
              key={p.id}
              className={`work__card${p.featured ? " is-featured" : ""}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6 }}
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
