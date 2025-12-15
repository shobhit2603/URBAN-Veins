import { Check } from "lucide-react";

export default function FilterSection({ label, options, value, onChange }) {
    return (
        <div className="space-y-3">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{label}</p>
            <div className="flex flex-col">
                {options.map((opt) => {
                    const isActive = value === opt;
                    return (
                        <button
                            key={opt}
                            onClick={() => onChange(opt)}
                            className={`group flex items-center justify-between w-full text-left py-1.5 px-2 rounded-lg text-sm transition-all ${isActive ? "bg-zinc-100 text-zinc-900 font-medium" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900  "
                                }`}
                        >
                            <span className="capitalize">{opt.replace("-", " ")}</span>
                            {isActive && <Check size={14} className="text-violet-600" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}