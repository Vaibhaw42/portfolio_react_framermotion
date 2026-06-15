import data from "../../data/github.json";
import "./github.scss";

const Github = () => {
  const { user, pinned, contributions } = data;
  const hasData = user.login !== "placeholder";

  return (
    <section id="github" className="github" aria-labelledby="github-title">
      <div className="github__inner">
        <span className="github__label">Open source</span>
        <h2 id="github-title">{hasData ? `@${user.login} on GitHub` : "GitHub"}</h2>
        {!hasData && <p className="github__empty">Stats refresh at deploy time. Set <code>GITHUB_TOKEN</code> + <code>GITHUB_USER</code> and run <code>npm run fetch:gh</code>.</p>}

        {hasData && (
          <>
            <div className="github__stats">
              <div><strong>{contributions.total}</strong><span>contributions / year</span></div>
              <div><strong>{user.totalStars}</strong><span>total stars</span></div>
              <div><strong>{user.followers}</strong><span>followers</span></div>
            </div>

            {contributions.weeks.length > 0 && (
              <div className="github__heatmap" aria-label="Contribution heatmap">
                <svg viewBox={`0 0 ${contributions.weeks.length * 14} 98`}>
                  {contributions.weeks.map((w, i) =>
                    w.days.map((d, j) => (
                      <rect
                        key={`${i}-${j}`}
                        x={i * 14}
                        y={j * 14}
                        width="12"
                        height="12"
                        rx="2"
                        fill={d.count === 0 ? "var(--bg-elev-2)" : d.color}
                      />
                    )),
                  )}
                </svg>
              </div>
            )}

            <div className="github__pinned">
              {pinned.map((r) => (
                <a key={r.name} className="github__repo" href={r.url} target="_blank" rel="noreferrer noopener" data-cursor="hover">
                  <h3>{r.name}</h3>
                  <p>{r.description}</p>
                  <div className="github__repo-meta">
                    {r.language && <span><i style={{ background: r.languageColor }} />{r.language}</span>}
                    <span>★ {r.stars}</span>
                    <span>⑂ {r.forks}</span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Github;
