export type NamedAPIResource = { name: string; url: string };


export type PokemonListItem = NamedAPIResource & { id: number };


export type PokemonType = {
    slot: number;
    type: NamedAPIResource;
};


export type PokemonSprites = {
    front_default: string | null;
    other?: {
        [k: string]: { front_default?: string | null } | undefined;
    };
};


export type Pokemon = {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    types: PokemonType[];
    abilities: { ability: NamedAPIResource }[];
    stats: { base_stat: number; stat: NamedAPIResource }[];
    sprites: PokemonSprites;
};