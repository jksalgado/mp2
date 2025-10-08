export type NamedAPIResource = { name: string; url: string };

export type PokemonType = {
  slot: number;
  type: { name: string; url: string };
};

export type PokemonSprites = {
  front_default: string | null;
  other?: {
    ["official-artwork"]?: { front_default: string | null };
  };
};

export type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonType[];
  sprites: PokemonSprites;
};

export type SortKey = "name" | "base_experience";
export type SortDir = "asc" | "desc";
