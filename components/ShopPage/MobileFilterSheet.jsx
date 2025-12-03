import FilterSection from "./FilterSection";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

const CATEGORY_OPTIONS = ["All", "Sweatshirt", "Hoodie", "Jacket"];
const IDEAL_FOR_OPTIONS = ["All", "men", "women", "unisex"];
const TYPE_OPTIONS = ["All", "top-wear", "bottom-wear"];

export default function MobileFilterSheet({ isOpen, onClose, category, setCategory, idealFor, setIdealFor, type, setType, onClear, activeCount }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-white">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Filters</h2>
                            <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 hover:text-zinc-900">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <FilterSection label="Category" options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
                            <div className="h-px bg-zinc-100" />
                            <FilterSection label="Gender" options={IDEAL_FOR_OPTIONS} value={idealFor} onChange={setIdealFor} />
                            <div className="h-px bg-zinc-100" />
                            <FilterSection label="Type" options={TYPE_OPTIONS} value={type} onChange={setType} />
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-zinc-100 bg-zinc-50 space-y-3">
                            <button
                                onClick={onClose}
                                className="w-full py-3.5 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                            >
                                Show Results
                            </button>
                            {activeCount > 0 && (
                                <button
                                    onClick={() => { onClear(); onClose(); }}
                                    className="w-full py-3 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}