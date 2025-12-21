import { motion } from "motion/react";
import { Heart, Minus, Plus, ShoppingBag, Star, Zap } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

export default function ProductDetails({ product }) {
    // Extract unique sizes and colors from variants
    const sizes = [...new Set(product.variants.map(v => v.size))];
    const colors = [...new Set(product.variants.map(v => v.color))];

    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [qty, setQty] = useState(1);

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            toast("Please select a size and color", {
                action: {
                    label: "OK",
                }
            })
            return;
        }
        addToCart(product, selectedSize, selectedColor, qty);
        // Optional: Reset qty or show success message
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6 max-sm:-mt-5">

            {/* Header */}
            <div>
                <div className="flex justify-between items-start">
                    <h1 className="text-3xl md:text-5xl font-[Stardom-Regular] font-black text-zinc-900 leading-[0.9] uppercase mb-2">
                        {product.name}
                    </h1>
                    <button className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-red-500 transition-colors  ">
                        <Heart size={24} />
                    </button>
                </div>

                <div className="flex items-center gap-4 mt-2">
                    <span className="text-2xl font-bold text-violet-600">₹{product.price}</span>
                    <div className="h-4 w-px bg-zinc-300" />
                    <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    size={14} 
                                    fill={i < Math.round(product.averageRating || 0) ? "currentColor" : "none"} 
                                    className={i < Math.round(product.averageRating || 0) ? "text-yellow-400" : "text-zinc-200"}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-zinc-500 ml-1">
                            ({product.averageRating ? product.averageRating.toFixed(1) : "0.0"}) 
                            {product.numReviews ? ` • ${product.numReviews} reviews` : ""}
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                {product.description}
            </p>

            {/* Separator */}
            <div className="h-px bg-zinc-200 w-full" />

            {/* Selectors */}
            <div className="space-y-6">

                {/* Color Selector */}
                <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Select Color</span>
                    <div className="flex flex-wrap gap-3">
                        {colors.map((color, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedColor(color)}
                                className={`group relative px-4 py-2 rounded-lg border   text-sm font-medium transition-all ${selectedColor === color
                                    ? "border-violet-600 bg-violet-50 text-violet-700 shadow-sm"
                                    : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                                    }`}
                            >
                                {color}
                                {selectedColor === color && (
                                    <motion.span layoutId="activeColor" className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                                    </motion.span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Size Selector */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Select Size</span>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 underline  ">Size Chart</button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {sizes.map((size, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedSize(size)}
                                className={`h-12 w-full rounded-xl   border text-sm font-bold transition-all uppercase ${selectedSize === size
                                    ? "bg-zinc-900 text-white border-zinc-900 shadow-lg"
                                    : "bg-white text-zinc-900 border-zinc-200 hover:border-zinc-400"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col gap-3">

                <div className="flex gap-3 h-14">
                    {/* Quantity */}
                    <div className="w-32 bg-zinc-100 rounded-full flex items-center justify-between px-4 border border-zinc-200">
                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 hover:text-violet-600  "><Minus size={16} /></button>
                        <span className="font-bold text-zinc-900">{qty}</span>
                        <button onClick={() => setQty(qty + 1)} className="p-1 hover:text-violet-600  "><Plus size={16} /></button>
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-zinc-900 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-violet-600 transition-colors shadow-lg flex items-center justify-center gap-2 group  ">
                        <ShoppingBag size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Add to Cart
                    </button>
                </div>

                {/* Buy Now */}
                <button className="group w-full h-14 bg-lime-400 text-zinc-900 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-lime-300 transition-colors shadow-[0_0_20px_rgba(163,230,53,0.4)] flex items-center justify-center gap-2  ">
                    <Zap size={18} fill="currentColor" className="group-hover:-translate-x-1 transition-transform" />
                    Buy It Now
                </button>
            </div>

            {/* Meta Tags */}
            <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-zinc-100 rounded-md text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        #{tag}
                    </span>
                ))}
            </div>

        </motion.div>
    );
}