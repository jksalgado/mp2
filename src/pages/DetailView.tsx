import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import pokeapi from "../api/pokeapi";
import { Pokemon } from "../types";
import { useResults } from "../context/ResultsContext";
import "./DetailView.css";

const art = (s: Pokemon["sprites"]) =>
  s.other?.["official-artwork"]?.front_default || s.front_default || "";

export default function DetailView() {
  const { name = "" } = useParams();
  const [p, setP] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const { names } = useResults();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await pokeapi.get(`/pokemon/${name}`);
        if (alive) setP(data as Pokemon);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [name]);

  const idx = useMemo(() => names.indexOf(name), [names, name]);
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < names.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) nav(`/pokemon/${names[idx - 1]}`);
  }, [hasPrev, idx, names, nav]);

  const goNext = useCallback(() => {
    if (hasNext) nav(`/pokemon/${names[idx + 1]}`);
  }, [hasNext, idx, names, nav]);

  if (loading) return <div className="container"><p>Loading details…</p></div>;
  if (!p) return <div className="container"><p>Not found.</p></div>;

  return (
    <div className="detail-container">
      <div className="detail-header">
        <Link to="/list" className="btn">← back</Link>
        <div className="nav-arrows">
          <button className="btn" onClick={goPrev} disabled={!hasPrev}>⟵ prev</button>
          <button className="btn" onClick={goNext} disabled={!hasNext}>next ⟶</button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-image">
          <img src={art(p.sprites)} alt={p.name} />
        </div>
        <div className="detail-info">
          <h2>#{p.id} {p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h2>

          <div className="detail-types">
            {p.types.map(t => (
              <span key={t.type.name} className={`type type--${t.type.name}`}>
                {t.type.name}
              </span>
            ))}
          </div>

          <ul className="detail-stats meta">
            <li><strong>Base Experience:</strong> {p.base_experience}</li>
            <li><strong>Height:</strong> {p.height}</li>
            <li><strong>Weight:</strong> {p.weight}</li>
            <li className="ability-line">
              <strong>Abilities:</strong>
              <span className="ability-list">
                {p.abilities.map((a) => a.ability.name).join(", ")}
              </span>
            </li>
          </ul>

          <h3 className="stats-heading">Base Stats</h3>
          <ul className="detail-stats-list">
            {p.stats.map((s) => (
              <li key={s.stat.name}>
                <span className="stat-name">{s.stat.name}</span>
                <div className="stat-bar-wrap">
                  <div className="stat-bar" style={{ width: `${s.base_stat / 2}%` }} />
                </div>
                <span className="stat-value">{s.base_stat}</span>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </div>
  );
}
