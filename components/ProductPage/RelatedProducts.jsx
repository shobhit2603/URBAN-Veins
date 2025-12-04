import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "./SectionTitle";
import { ArrowRight } from "lucide-react";
import { products } from "@/public/images";

export default function RelatedProducts({ currentSlug, category }) {
    // Filter logic: Same category, not the current one, max 4
    const related = products
        .filter(p => p.category === category && p.slug !== currentSlug)
        .slice(0, 4);

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
                    <Link key={idx} href={`/product/${item.slug}`} className="group block">
                        <div className="relative aspect-3/4 bg-zinc-100 hover:rounded-4xl transition-all duration-300 overflow-hidden mb-3">
                            <Image
                                src={item.images[0]}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            {/* Quick Add Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <button className="w-full py-2 bg-white/90 backdrop-blur text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer">
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