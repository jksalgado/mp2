import React, { useEffect, useMemo, useState } from "react";
import pokeapi from "../api/pokeapi";
import { Pokemon, SortDir, SortKey } from "../types";
import SearchBar from "../components/SearchBar";
import SortControls from "../components/SortControls";
import PokemonCard from "../components/PokemonCard";
import { useResults } from "../context/ResultsContext";
import "./ListView.css";

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
        const cmp = a.id - b.id;
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
      <h2 className="page-title">search</h2>

      {/* Centered Search Bar */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Search Pokémon..."
        />
      </div>

      {/* Sort Controls (centered below search) */}
      <div className="sort-section">
        <label>
          Sort by:&nbsp;
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="sort-select"
          >
            <option value="name">Name</option>
            <option value="id">ID</option>
          </select>
        </label>
        <label>
          &nbsp;Order:&nbsp;
          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as SortDir)}
            className="sort-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p>Loading Pokémon…</p>
      ) : filtered.length === 0 ? (
        <p>No results.</p>
      ) : (
        <div className="grid">
          {filtered.map((p) => (
            <PokemonCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
