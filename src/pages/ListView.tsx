import React, { useEffect, useMemo, useState } from "react";
import pokeapi from "../api/pokeapi";
import { Pokemon, SortDir, SortKey } from "../types";
import SearchBar from "../components/SearchBar";
import SortControls from "../components/SortControls";
import PokemonCard from "../components/PokemonCard";
import { useResults } from "../context/ResultsContext";

type Basic = { name: string; url: string };

async function fetchBatch(limit = 200, offset = 0): Promise<Basic[]> {
  const { data } = await pokeapi.get(`/pokemon?limit=${limit}&offset=${offset}`);
  return data.results as Basic[];
}

async function fetchPokemon(name: string): Promise<Pokemon> {
  const { data } = await pokeapi.get(`/pokemon/${name}`);
  return data as Pokemon;
}

export default function ListView() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Pokemon[]>([]);
  const { setNames } = useResults();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        // grab first 200 basics, then hydrate in parallel (keeps code simple)
        const basics = await fetchBatch(200, 0);
        const hydrated = await Promise.all(basics.map((b) => fetchPokemon(b.name)));
        if (!alive) return;
        setItems(hydrated);
      } catch {
        // small offline/mock fallback
        if (!alive) return;
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = q ? items.filter((p) => p.name.toLowerCase().includes(q)) : items.slice();

    out.sort((a, b) => {
      if (sortKey === "name") {
        const cmp = a.name.localeCompare(b.name);
        return sortDir === "asc" ? cmp : -cmp;
      } else {
        const ax = typeof a.base_experience === "number" ? a.base_experience : 0;
        const bx = typeof b.base_experience === "number" ? b.base_experience : 0;
        const cmp = ax - bx;
        return sortDir === "asc" ? cmp : -cmp;
      }
    });

    return out;
  }, [items, query, sortKey, sortDir]);

  // keep order for detail page prev/next
  useEffect(() => {
    setNames(filtered.map((p) => p.name));
  }, [filtered, setNames]);

  return (
    <div className="container">
      <h2>Search</h2>
      <div className="row">
        <SearchBar value={query} onChange={setQuery} />
      </div>
      <SortControls sortKey={sortKey} sortDir={sortDir} onSortKey={setSortKey} onSortDir={setSortDir} />

      {loading ? (
        <p>Loading Pokémon…</p>
      ) : filtered.length === 0 ? (
        <p>No results.</p>
      ) : (
        <div className="grid">
          {filtered.map((p) => <PokemonCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
