'use client';

import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
    const shipping = subtotal > 5000 ? 0 : 200; // Example logic: Free shipping over ₹5000
    const total = subtotal + shipping; 

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] text-zinc-900 relative pt-24 md:pt-32 pb-20 px-4 md:px-8 selection:bg-lime-400 selection:text-zinc-900">

            {/* Background Texture (Consistent with Login) */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply fixed"></div>

            {/* 2. Abstract Background Blobs */}
            <div className="absolute top-[-10%] right-[10%] w-[50vw] h-[50vw] bg-violet-200 rounded-full blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-lime-200/50 rounded-full blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" style={{ animationDuration: '10s' }} />

            <div className="max-w-[1400px] mx-auto relative z-10">

                {/* Header */}
                <div className="flex flex-col gap-2 mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-[Stardom-Regular] font-black uppercase tracking-tight"
                    >
                        Your <span className="text-zinc-400">Cart.</span>
                    </motion.h1>
                    <p className="text-zinc-500 font-medium">
                        {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} secured in your bag.
                    </p>
                </div>

                {cartItems.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 gap-6 text-center border-t border-zinc-200"
                    >
                        <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag size={40} className="text-zinc-500" />
                        </div>
                        <h2 className="text-2xl font-bold uppercase">Your cart is ghosting you.</h2>
                        <p className="text-zinc-500 max-w-sm">Looks like you haven&apos;t added any streetwear heat yet.</p>
                        <Link href="/shop">
                            <button className="mt-4 px-8 py-3 bg-zinc-900 text-white rounded-full font-bold uppercase tracking-widest hover:bg-violet-600 transition-colors  ">
                                Go Shop
                            </button>
                        </Link>
                    </motion.div>
                ) : (
                    /* Cart Grid */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                        {/* Left: Cart Items List */}
                        <div className="lg:col-span-8 flex flex-col gap-3">
                            <div className="hidden md:flex justify-between pb-4 border-b border-zinc-400 text-xs font-bold text-zinc-800 uppercase tracking-widest">
                                <span>Product</span>
                                <div className="flex gap-20 pr-8">
                                    <span>Quantity</span>
                                    <span>Total</span>
                                </div>
                            </div>

                            <AnimatePresence mode="popLayout">
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={`${item.slug}-${item.selectedSize}-${item.selectedColor}`}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        className="group relative flex flex-col md:flex-row gap-6 py-6 border-b border-zinc-100 bg-white/50 backdrop-blur-sm rounded-2xl p-4 hover:bg-white transition-colors"
                                    >
                                        {/* Image */}
                                        <div className="relative w-full md:w-32 aspect-4/5 bg-zinc-100 rounded-xl overflow-hidden shrink-0">
                                            <Image
                                                src={item.images[0]}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col md:flex-row justify-between">
                                            <div className="flex flex-col justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between md:block">
                                                        <h3 className="font-bold text-lg md:text-xl leading-tight">{item.name}</h3>
                                                        <span className="md:hidden font-bold">₹{item.price * item.quantity}</span>
                                                    </div>
                                                    <p className="text-zinc-500 text-sm">{item.category}</p>
                                                    <div className="flex gap-3 mt-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                        <span className="bg-zinc-100 px-2 py-1 rounded">{item.selectedSize}</span>
                                                        <span className="bg-zinc-100 px-2 py-1 rounded flex items-center gap-1">
                                                            <span className="w-2 h-2 rounded-full bg-current opacity-50"></span>
                                                            {item.selectedColor}
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.slug, item.selectedSize, item.selectedColor)}
                                                    className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-600 uppercase tracking-wider mt-4 w-fit transition-colors  "
                                                >
                                                    <Trash2 size={14} /> Remove
                                                </button>
                                            </div>

                                            {/* Quantity & Price (Desktop) */}
                                            <div className="flex items-center justify-between md:justify-end gap-12 md:gap-20 mt-6 md:mt-0">
                                                {/* Qty Selector */}
                                                <div className="flex items-center gap-4 bg-zinc-50 rounded-full px-4 py-2 border border-zinc-200">
                                                    <button
                                                        onClick={() => updateQuantity(item.slug, item.selectedSize, item.selectedColor, item.quantity - 1)}
                                                        className="hover:text-violet-600 transition-colors  "
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.slug, item.selectedSize, item.selectedColor, item.quantity + 1)}
                                                        className="hover:text-violet-600 transition-colors  "
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                {/* Item Total */}
                                                <span className="hidden md:block font-bold text-lg w-20 text-right">
                                                    ₹{item.price * item.quantity}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Right: Sticky Summary */}
                        <div className="lg:col-span-4 h-fit sticky top-32">
                            <div className="bg-white p-6 md:p-8 rounded-3xl border border-zinc-200 shadow-sm">
                                <h3 className="font-[Stardom-Regular] text-2xl font-bold mb-6">Order Summary</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-zinc-500 text-sm font-medium">
                                        <span>Subtotal</span>
                                        <span className="text-zinc-900">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-500 text-sm font-medium">
                                        <span>Shipping</span>
                                        <span className="text-zinc-900">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                                    </div>
                                    <div className="h-px bg-zinc-100 w-full my-2"></div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>₹{total}</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                                        Taxes and shipping calculated at checkout. Orders above ₹5000 qualify for free express shipping.
                                    </p>
                                </div>

                                {/* Magnetic Checkout Button */}
                                <button className="relative w-full h-14 overflow-hidden rounded-full bg-zinc-900 group  ">
                                    <div className="absolute inset-0 w-full h-full bg-lime-400 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />

                                    <span className="relative z-10 w-full h-full flex items-center justify-center gap-2 text-white transition-colors duration-500 group-hover:text-zinc-900 font-bold tracking-widest text-sm uppercase">
                                        Proceed to Checkout <ArrowRight size={18} />
                                    </span>
                                </button>

                                {/* Payment Icons */}
                                <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale">
                                    {/* Placeholders for payment icons */}
                                    <div className="h-6 w-10 bg-zinc-200 rounded"></div>
                                    <div className="h-6 w-10 bg-zinc-200 rounded"></div>
                                    <div className="h-6 w-10 bg-zinc-200 rounded"></div>
                                    <div className="h-6 w-10 bg-zinc-200 rounded"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}