"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, Search, ArrowBigUp } from "lucide-react";
import {
    Select, SelectContent, SelectGroup, SelectItem,
    SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import ProductCard from "@/components/ShopPage/ProductCard";
import MobileFilterSheet from "@/components/ShopPage/MobileFilterSheet";
import FilterPanel from "@/components/ShopPage/FilterPanel";
import BackgroundBlobs from "@/components/ShopPage/BackgroundBlobs";

/* --- SORTING CONSTANTS --- */
const SORT_OPTIONS = [
    { value: "relevant", label: "Relevant" },
    { value: "price-low-high", label: "Price: Low - High" },
    { value: "price-high-low", label: "Price: High - Low" }
];

export default function ShopPage() {

    /* STATE */
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [category, setCategory] = useState("All");
    const [idealFor, setIdealFor] = useState("All");
    const [type, setType] = useState("All");
    const [sortBy, setSortBy] = useState("relevant");
    const [search, setSearch] = useState("");
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    /* FETCH PRODUCTS ONLY ONCE (backend → store → filter frontend) */
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                setProducts(data?.products || []);
            } catch (err) {
                console.error("❌ Failed loading products", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        const onScroll = () => setShowScrollTop(window.scrollY > 450);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);

    }, []);

    /* FRONTEND FILTERING + SORT (super fast with <1000 products) */
    const filteredProducts = useMemo(() => {
        if (!products.length) return [];

        let list = [...products];

        if (category !== "All") list = list.filter(p => p.category?.toLowerCase() === category.toLowerCase());
        if (idealFor !== "All") list = list.filter(p => p.idealFor?.toLowerCase() === idealFor.toLowerCase());
        if (type !== "All") list = list.filter(p => p.type?.toLowerCase() === type.toLowerCase());

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p =>
                p.name?.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.tags?.some(tag => tag.toLowerCase().includes(q))
            );
        }

        if (sortBy === "price-low-high") list.sort((a, b) => a.price - b.price);
        if (sortBy === "price-high-low") list.sort((a, b) => b.price - a.price);

        return list;

    }, [products, category, idealFor, type, sortBy, search]);


    /* Count of active filters for UI badge */
    const activeFiltersCount =
        (category !== "All") +
        (idealFor !== "All") +
        (type !== "All");

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
                
                {/* --- HERO --- */}
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
                            Engineered for the cold. <br />Premium materials, oversized fits, limited runs.
                        </p>
                    </div>
                </section>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* --- FILTER SIDEBAR (desktop) --- */}
                    <aside className="hidden lg:block w-64 sticky top-24 shrink-0 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
                        <FilterPanel
                            category={category} setCategory={setCategory}
                            idealFor={idealFor} setIdealFor={setIdealFor}
                            type={type} setType={setType}
                            clearAll={clearFilters}
                            activeCount={activeFiltersCount}
                        />
                    </aside>

                    {/* --- PRODUCTS GRID --- */}
                    <div className="flex-1 w-full">

                        {/* Search + Sort Toolbar */}
                        <div className="pb-6 flex flex-col md:flex-row gap-4 justify-between items-center">

                            <div className="relative w-full md:max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-violet-600"
                                />
                            </div>

                            <div className="flex gap-2 items-center">

                                {/* Mobile Filter Trigger */}
                                <button
                                    onClick={() => setIsFilterSheetOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-xs uppercase tracking-wider shadow"
                                >
                                    <SlidersHorizontal size={14} /> Filters
                                    {activeFiltersCount > 0 && (
                                        <span className="bg-lime-400 text-zinc-900 px-1.5 rounded-sm ml-1">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>

                                {/* SORT DROPDOWN */}
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Sort by</SelectLabel>
                                            {SORT_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* PRODUCT RESULT GRID */}
                        {loading ? (
                            <p className="text-center py-16 text-zinc-500">Loading products...</p>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center py-20 border border-dashed border-zinc-300 rounded-3xl bg-white/50">
                                <Search className="h-10 w-10 text-zinc-300 mb-4" />
                                <p className="text-sm text-zinc-500 mb-4">No styles found matching your criteria.</p>
                                <button 
                                    onClick={clearFilters}
                                    className="text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full bg-zinc-900 text-white hover:bg-violet-600"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                <AnimatePresence mode="popLayout">
                                    {filteredProducts.map((product,i) => (
                                        <ProductCard key={product._id || i} product={product} index={i}/>
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

            {/* SCROLL TO TOP BUTTON */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 h-11 w-11 rounded-full bg-black text-white flex items-center justify-center shadow-lg"
                    >
                        <ArrowBigUp />
                    </motion.button>
                )}
            </AnimatePresence>

        </main>
    );
}
