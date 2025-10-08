import React from "react";
import { Link } from "react-router-dom";
import { Pokemon } from "../types";

function artwork(sprites: Pokemon["sprites"]) {
  return sprites.other?.["official-artwork"]?.front_default || sprites.front_default || "";
}

export default function PokemonCard({ p }: { p: Pokemon }) {
  const img = artwork(p.sprites);
  const label = `#${p.id} ${p.name}`;
  return (
    <Link className="card" to={`/pokemon/${p.name}`} state={{ id: p.id }}>
      {img ? <img src={img} alt={p.name} loading="lazy" /> : <div className="ph" />}
      <div className="card__body">
        <div className="card__title">{label}</div>
        <div className="card__types">
          {p.types.map((t) => (
            <span className={`type type--${t.type.name}`} key={t.type.name}>{t.type.name}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
