import { SortDir, SortKey } from "../types";

export default function SortControls({
  sortKey, sortDir, onSortKey, onSortDir
}: { sortKey: SortKey; sortDir: SortDir; onSortKey: (k: SortKey) => void; onSortDir: (d: SortDir) => void }) {
  return (
    <div className="row">
      <label>
        Sort by:&nbsp;
        <select value={sortKey} onChange={(e) => onSortKey(e.target.value as SortKey)}>
          <option value="name">Name</option>
          <option value="base_experience">Base XP</option>
        </select>
      </label>
      <label>
        Direction:&nbsp;
        <select value={sortDir} onChange={(e) => onSortDir(e.target.value as SortDir)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>
  );
}
