import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react"
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product, index }) {
    const image = product.images?.[0];

    return (
        <motion.article
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group relative flex flex-col bg-white overflow-hidden border border-zinc-100 hover:border-zinc-300 hover:rounded-4xl transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50 cursor-pointer"
        >
            {/* Image Container */}
            <Link href={`/product/${product.slug}`} className="relative aspect-4/5 overflow-hidden bg-zinc-100">
                {/* Badge */}
                <div className="absolute top-3 left-3 z-20 flex gap-2">
                    <span className="px-2 py-1 rounded-md bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-zinc-900 shadow-sm">
                        {product.category}
                    </span>
                    {product.tags?.includes("New") && (
                        <span className="px-2 py-1 rounded-md bg-lime-400 text-[10px] font-bold uppercase tracking-wider text-zinc-900 shadow-sm">
                            New
                        </span>
                    )}
                </div>

                {image && (
                    <Image
                        src={image.src ?? image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />
                )}

                {/* Overlay Action */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <button className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-zinc-900 hover:text-white transition-colors">
                        <ArrowUpRight size={18} />
                    </button>
                </div>
            </Link>

            {/* Details */}
            <div className="p-4 flex flex-col gap-1">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-bold text-zinc-900 line-clamp-1 group-hover:text-violet-600 transition-colors">
                        {product.name}
                    </h3>
                    <span className="text-sm font-bold text-zinc-900">₹{product.price}</span>
                </div>
                <p className="text-xs text-zinc-500 capitalize">
                    {product.idealFor} • {product.type.replace("-", " ")}
                </p>
            </div>
        </motion.article>
    );
}