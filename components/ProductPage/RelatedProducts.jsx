"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "./SectionTitle";
import { ArrowRight, Loader2 } from "lucide-react";

export default function RelatedProducts({ currentSlug, category }) {
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!category) return;

        const fetchRelated = async () => {
            try {
                // Fetch products by category
                // Note: You might want to create a specific API for "related" to handle exclusion logic on backend
                // For now, we'll fetch by category and filter client-side as per your previous logic, 
                // or better, pass a query param to exclude currentSlug if your API supports it.
                // Assuming standard list API: /api/products?category=CategoryName
                const res = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
                
                if (res.ok) {
                    const data = await res.json();
                    const allProducts = data.products || [];
                    
                    // Filter out current product and limit to 4
                    const filtered = allProducts
                        .filter(p => p.slug !== currentSlug)
                        .slice(0, 4);
                    
                    setRelated(filtered);
                }
            } catch (error) {
                console.error("Failed to fetch related products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelated();
    }, [category, currentSlug]);

    if (loading) return (
        <section className="border-t border-zinc-200 pt-13 min-h-[300px] flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-zinc-300 animate-spin" />
        </section>
    );

    if (related.length === 0) return null;

    return (
        <section className="border-t border-zinc-200 pt-13">
            <div className="flex items-center justify-between mb-5">
                <SectionTitle>You Might Also Like</SectionTitle>
                <Link href="/shop" className="group flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-violet-600 transition-colors -mt-5">
                    View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {related.map((item, idx) => (
                    <Link key={idx} href={`/shop/${item.slug}`} className="group block">
                        <div className="relative aspect-3/4 bg-zinc-100 hover:rounded-4xl transition-all duration-300 overflow-hidden mb-3">
                            {item.images && item.images[0] && (
                                <Image
                                    src={item.images[0]}
                                    alt={item.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                            )}
                            {/* Quick Add Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <button className="w-full py-2 bg-white/90 backdrop-blur text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg hover:bg-zinc-900 hover:text-white transition-colors  ">
                                    View Product
                                </button>
                            </div>
                        </div>
                        <h5 className="text-sm font-bold text-zinc-900 truncate">{item.name}</h5>
                        <p className="text-xs text-zinc-700">₹{item.price}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}