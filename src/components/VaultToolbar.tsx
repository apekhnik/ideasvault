import { Filter, SortAsc } from "lucide-react";

export default function VaultToolbar() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <h1 className="text-3xl font-light tracking-tight text-on-surface">My Vault</h1>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant/30 rounded-lg bg-surface text-on-surface hover:bg-surface-container-high transition-colors text-sm">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant/30 rounded-lg bg-surface text-on-surface hover:bg-surface-container-high transition-colors text-sm">
          <SortAsc className="w-4 h-4" />
          Sort
        </button>
      </div>
    </div>
  );
}
