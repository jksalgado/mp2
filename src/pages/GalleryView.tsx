import React, { useEffect, useMemo, useState } from "react";
import pokeapi from "../api/pokeapi";
import { Pokemon } from "../types";
import TypeFilters from "../components/TypeFilters";
import PokemonCard from "../components/PokemonCard";
import { useResults } from "../context/ResultsContext";

type Basic = { name: string; url: string };

async function fetchBatch(limit = 120, offset = 0): Promise<Basic[]> {
  const { data } = await pokeapi.get(`/pokemon?limit=${limit}&offset=${offset}`);
  return data.results as Basic[];
}

async function fetchPokemon(name: string): Promise<Pokemon> {
  const { data } = await pokeapi.get(`/pokemon/${name}`);
  return data as Pokemon;
}

export default function GalleryView() {
  const [items, setItems] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState<string[]>([]);
  const { setNames } = useResults();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const basics = await fetchBatch(120, 0);
        const hydrated = await Promise.all(basics.map((b) => fetchPokemon(b.name)));
        if (!alive) return;
        setItems(hydrated);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    if (types.length === 0) return items;
    return items.filter((p) => {
      const pt = p.types.map((t) => t.type.name);
      return types.every((t) => pt.includes(t));
    });
  }, [items, types]);

  useEffect(() => {
    setNames(filtered.map((p) => p.name));
  }, [filtered, setNames]);

  const toggle = (t: string) =>
    setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  return (
    <div className="container">
      <h2>gallery</h2>
      <TypeFilters selected={types} onToggle={toggle} />

      {loading ? (
        <p>Loading gallery…</p>
      ) : filtered.length === 0 ? (
        <p>No Pokémon match those types.</p>
      ) : (
        <div className="grid">
          {filtered.map((p) => <PokemonCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
