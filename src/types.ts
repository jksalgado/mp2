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

export type PokemonAbility = {
  ability: { name: string; url: string };
  is_hidden: boolean;
  slot: number;
};

export type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
};

export type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonType[];
  sprites: PokemonSprites;

  // add these ↓
  abilities: PokemonAbility[];
  stats: PokemonStat[];
};

export type SortKey = "name" | "id";
export type SortDir = "asc" | "desc";
