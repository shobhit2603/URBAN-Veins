"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, Search, ArrowBigUp } from "lucide-react";
import { products } from "@/public/images";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ProductCard from "@/components/ShopPage/ProductCard";
import MobileFilterSheet from "@/components/ShopPage/MobileFilterSheet";
import FilterPanel from "@/components/ShopPage/FilterPanel";
import BackgroundBlobs from "@/components/ShopPage/BackgroundBlobs";

/* --- CONSTANTS --- */
const SORT_OPTIONS = [
    { value: "relevant", label: "Relevant" },
    { value: "price-low-high", label: "Price: Low - High" },
    { value: "price-high-low", label: "Price: High - Low" },
];

export default function ShopPage() {
    // --- State ---
    const [category, setCategory] = useState("All");
    const [idealFor, setIdealFor] = useState("All");
    const [type, setType] = useState("All");
    const [sortBy, setSortBy] = useState("relevant");
    const [search, setSearch] = useState("");
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

    // Note: 'scrolled' state kept to minimize logic changes, though sticky behavior is removed.
    const [scrolled, setScrolled] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 50);
            setShowScrollTop(y > 400); // show button after some scroll
        };

        // Run once on mount so state matches initial position
        handleScroll();

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    // --- Filtering Logic ---
    const filteredProducts = useMemo(() => {
        let list = [...products];

        if (category !== "All") list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
        if (idealFor !== "All") list = list.filter((p) => p.idealFor.toLowerCase() === idealFor.toLowerCase());
        if (type !== "All") list = list.filter((p) => p.type.toLowerCase() === type.toLowerCase());

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.tags.some((tag) => tag.toLowerCase().includes(q))
            );
        }

        if (sortBy === "price-low-high") list.sort((a, b) => a.price - b.price);
        else if (sortBy === "price-high-low") list.sort((a, b) => b.price - a.price);

        return list;
    }, [category, idealFor, type, sortBy, search]);

    const activeFiltersCount =
        (category !== "All" ? 1 : 0) +
        (idealFor !== "All" ? 1 : 0) +
        (type !== "All" ? 1 : 0);

    const clearFilters = () => {
        setCategory("All");
        setIdealFor("All");
        setType("All");
        setSearch("");
    };

    return (
        <main className="relative min-h-screen bg-[#FAFAFA] pt-20 pb-20 overflow-hidden">
            <BackgroundBlobs />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                {/* --- COMPACT HERO SECTION --- */}
                <section className="py-6 md:py-10 border-b border-zinc-200 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-2">
                                Browse our latest collections
                            </p>
                            <h1 className="text-3xl md:text-5xl font-[Stardom-Regular] font-bold tracking-tight uppercase text-zinc-900">
                                Winter Drops
                            </h1>
                        </div>
                        <p className="max-w-md text-sm text-zinc-500 text-right hidden md:block leading-relaxed">
                            Engineered for the cold. <br />
                            Premium materials, oversized fits, limited runs.
                        </p>
                    </div>
                </section>

                {/* --- MAIN LAYOUT GRID --- */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* --- SIDEBAR (Desktop) --- */}
                    <aside className="hidden lg:block w-64 sticky top-24 shrink-0 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
                        <FilterPanel
                            category={category} setCategory={setCategory}
                            idealFor={idealFor} setIdealFor={setIdealFor}
                            type={type} setType={setType}
                            clearAll={clearFilters}
                            activeCount={activeFiltersCount}
                        />
                    </aside>

                    {/* --- CONTENT AREA --- */}
                    <div className="flex-1 w-full">

                        {/* --- CONTROL BAR (Search & Sort) --- */}
                        <div className={`relative z-30 pb-4 lg:pb-6 transition-all`}>
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

                                {/* Search */}
                                <div className="relative w-full md:max-w-md group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-violet-500 transition-colors" />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all shadow-sm"
                                    />
                                </div>

                                {/* Mobile Actions & Desktop Sort */}
                                <div className="flex items-center justify-between w-full md:w-auto gap-3">
                                    <p className="hidden md:block text-xs text-zinc-500 font-medium uppercase tracking-wider">
                                        {filteredProducts.length} Results
                                    </p>

                                    <div className="flex items-center gap-2 ml-auto">
                                        {/* Mobile Filter Trigger */}
                                        <button
                                            onClick={() => setIsFilterSheetOpen(true)}
                                            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-zinc-900/10 active:scale-95 transition-transform"
                                        >
                                            <SlidersHorizontal size={14} />
                                            Filters
                                            {activeFiltersCount > 0 && (
                                                <span className="bg-lime-400 text-zinc-900 px-1.5 rounded-sm ml-1">
                                                    {activeFiltersCount}
                                                </span>
                                            )}
                                        </button>

                                        {/* Sort Dropdown */}
                                        <div className="relative group">
                                            <Select value={sortBy} onValueChange={setSortBy}>
                                                <SelectTrigger className="w-[180px] cursor-pointer">
                                                    <SelectValue placeholder="Sort by" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Sort by</SelectLabel>
                                                        {SORT_OPTIONS.map((opt) => (
                                                            <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">{opt.label}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- PRODUCT GRID --- */}
                        {filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-300 rounded-3xl bg-white/50">
                                <Search className="h-10 w-10 text-zinc-300 mb-4" />
                                <p className="text-sm text-zinc-500 mb-4">No styles found matching your criteria.</p>
                                <button
                                    onClick={clearFilters}
                                    className="text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full bg-zinc-900 text-white hover:bg-violet-600 transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            // grid-cols-3 -> grid-cols-4 for smaller cards
                            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <AnimatePresence mode="popLayout">
                                    {filteredProducts.map((product, index) => (
                                        <ProductCard key={product.slug} product={product} index={index} />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <MobileFilterSheet
                isOpen={isFilterSheetOpen}
                onClose={() => setIsFilterSheetOpen(false)}
                category={category} setCategory={setCategory}
                idealFor={idealFor} setIdealFor={setIdealFor}
                type={type} setType={setType}
                onClear={clearFilters}
                activeCount={activeFiltersCount}
            />

            {/* Floating Scroll-to-Top Button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        key="scroll-to-top"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        aria-label="Scroll to top"
                        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-40 h-11 w-11 rounded-full bg-black/90 backdrop-blur-sm shadow-lg shadow-violet-900/70 flex items-center justify-center text-zinc-100 hover:-translate-y-1 hover:shadow-xl active:scale-95 transition-all duration-300 cursor-pointer"
                    >
                        <ArrowBigUp className="h-5 w-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </main>
    );
}
