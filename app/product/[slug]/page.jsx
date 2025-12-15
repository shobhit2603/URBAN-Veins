'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ShieldCheck, Truck, Loader2, AlertCircle } from "lucide-react";

import RelatedProducts from "@/components/ProductPage/RelatedProducts";
import ReviewsSection from "@/components/ProductPage/ReviewsSection";
import DescriptionSection from "@/components/ProductPage/DescriptionSection";
import ProductDetails from "@/components/ProductPage/ProductDetails";
import ProductGallery from "@/components/ProductPage/ProductGallery";

// --- UTILITY COMPONENTS ---

const GrainOverlay = () => (
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 mix-blend-multiply"></div>
);

// --- MAIN PAGE COMPONENT ---

export default function ProductPage() {
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!params.slug) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/products/${params.slug}`);
                
                if (!res.ok) {
                    if (res.status === 404) throw new Error("Product not found");
                    throw new Error("Failed to load product");
                }

                const data = await res.json();
                setProduct(data.product);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
                <p className="text-zinc-500 animate-pulse">Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-4 text-zinc-500">
                <AlertCircle className="w-10 h-10 text-red-400" />
                <p className="text-lg font-medium">{error || "Product not found"}</p>
                <Link href="/shop" className="text-violet-600 hover:underline">
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <main className="relative min-h-screen bg-[#FAFAFA] pt-24 pb-20 overflow-x-hidden">
            <GrainOverlay />

            {/* Background Blobs (Consistent with Shop) */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-violet-200/70 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-[10%] left-0 w-[40vw] h-[40vw] bg-lime-200/50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">

                {/* 1. Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-8">
                    <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-zinc-900 transition-colors">Shop</Link>
                    <span>/</span>
                    <span className="text-violet-600">{product.category}</span>
                </nav>

                {/* 2. Main Product Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-10">

                    {/* LEFT: Image Gallery (7 Cols) */}
                    <div className="lg:col-span-6">
                        <ProductGallery images={product.images} name={product.name} />
                    </div>

                    {/* RIGHT: Product Details (5 Cols) */}
                    <div className="lg:col-span-6 relative">
                        <div className="sticky top-28">
                            <ProductDetails product={product} />
                        </div>
                    </div>
                </div>

                {/* 3. Detailed Info & Reviews */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-zinc-200 pt-16 mb-20">
                    <div className="lg:col-span-7 space-y-16">
                        <DescriptionSection description={product.description} />
                        {/* We pass the productId to ReviewsSection so it can fetch reviews later if needed */}
                        <ReviewsSection productId={product._id} />
                    </div>
                    <div className="lg:col-span-5">
                        {/* Additional contextual info */}
                        <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm space-y-6">
                            <h4 className="font-bold uppercase tracking-widest text-sm">Why Urban Veins?</h4>
                            <ul className="space-y-4">
                                <li className="flex gap-4 items-start">
                                    <ShieldCheck className="text-violet-500 shrink-0" size={20} />
                                    <div>
                                        <p className="font-bold text-sm text-zinc-900">Authentic Streetwear</p>
                                        <p className="text-xs text-zinc-500 mt-1">Every piece is verified for quality and authenticity.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <Truck className="text-lime-500 shrink-0" size={20} />
                                    <div>
                                        <p className="font-bold text-sm text-zinc-900">Express Shipping</p>
                                        <p className="text-xs text-zinc-500 mt-1">Free shipping on orders above ₹2999.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 4. Related Products */}
                <RelatedProducts currentSlug={product.slug} category={product.category} />

            </div>
        </main>
    )
}