import FilterSection from "./FilterSection";

const CATEGORY_OPTIONS = ["All", "Sweatshirt", "Hoodie", "Jacket"];
const IDEAL_FOR_OPTIONS = ["All", "men", "women", "unisex"];
const TYPE_OPTIONS = ["All", "top-wear", "bottom-wear"];

export default function FilterPanel({ category, setCategory, idealFor, setIdealFor, type, setType, clearAll, activeCount }) {
    return (
        <div className="space-y-8">
            <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Filters</h3>
                {activeCount > 0 && (
                    <button onClick={clearAll} className="text-[10px] font-semibold text-violet-600 hover:text-violet-700 uppercase tracking-wider cursor-pointer">
                        Reset All
                    </button>
                )}
            </div>

            <FilterSection label="Category" options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
            <div className="h-px bg-zinc-200" />
            <FilterSection label="Gender" options={IDEAL_FOR_OPTIONS} value={idealFor} onChange={setIdealFor} />
            <div className="h-px bg-zinc-200" />
            <FilterSection label="Type" options={TYPE_OPTIONS} value={type} onChange={setType} />
        </div>
    );
}
