import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import pokeapi from "../api/pokeapi";
import { Pokemon } from "../types";
import { useResults } from "../context/ResultsContext";

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
    <div className="container">
      <div className="detail__header">
        <Link to="/list" className="btn">← Back</Link>
        <div className="spacer" />
        <button className="btn" onClick={goPrev} disabled={!hasPrev}>⟵ Prev</button>
        <button className="btn" onClick={goNext} disabled={!hasNext}>Next ⟶</button>
      </div>

      <div className="detail">
        <div className="detail__imgwrap">
          <img src={art(p.sprites)} alt={p.name} />
        </div>
        <div className="detail__body">
          <h2>#{p.id} {p.name}</h2>
          <div className="card__types">
            {p.types.map((t) => (
              <span className={`type type--${t.type.name}`} key={t.type.name}>{t.type.name}</span>
            ))}
          </div>
          <ul className="specs">
            <li><strong>Base XP:</strong> {p.base_experience ?? "—"}</li>
            <li><strong>Height:</strong> {p.height}</li>
            <li><strong>Weight:</strong> {p.weight}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
