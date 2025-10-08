import React from "react";

const ALL_TYPES = [
  "normal","fire","water","electric","grass","ice","fighting","poison","ground","flying",
  "psychic","bug","rock","ghost","dragon","dark","steel","fairy"
];

type Props = {
  selected: string[];               // type names
  onToggle: (type: string) => void;
};

export default function TypeFilters({ selected, onToggle }: Props) {
  return (
    <div className="chipwrap">
      {ALL_TYPES.map((t) => {
        const active = selected.includes(t);
        return (
          <button
            key={t}
            className={`chip ${active ? "chip--active" : ""}`}
            onClick={() => onToggle(t)}
            type="button"
            aria-pressed={active}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
