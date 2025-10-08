export default function SearchBar({
  value, onChange, placeholder
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      className="input"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Search Pokémon..."}
    />
  );
}
