export const getIdFromUrl = (url: string): number => {
// PokeAPI URLs end with /pokemon/{id}/
const m = url.match(/\/(\d+)\/?$/);
return m ? Number(m[1]) : 0;
};


export const artworkFor = (id: number) =>
`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;


export const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);