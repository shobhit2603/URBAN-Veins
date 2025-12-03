'use client';

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ShieldCheck, Truck } from "lucide-react";
import { products } from "@/public/images";

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

export default function ProductPage({ props }) {
    const params = useParams();

    const product = useMemo(() => {
        if (!params.slug) return null;
        return products.find(p => p.slug === params.slug) || null;
    }, [params.slug]);

    if (!params.slug) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"><div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div></div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center text-zinc-500">Product not found.</div>;


    return (
        <main className="relative min-h-screen bg-[#FAFAFA] pt-24 pb-20 overflow-x-hidden">
            <GrainOverlay />

            {/* Background Blobs (Consistent with Shop) */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-violet-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-[10%] left-0 w-[40vw] h-[40vw] bg-lime-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">

                    {/* LEFT: Image Gallery (7 Cols) */}
                    <div className="lg:col-span-7">
                        <ProductGallery images={product.images} name={product.name} />
                    </div>

                    {/* RIGHT: Product Details (5 Cols) */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-28">
                            <ProductDetails product={product} />
                        </div>
                    </div>
                </div>

                {/* 3. Detailed Info & Reviews */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-zinc-200 pt-16 mb-20">
                    <div className="lg:col-span-7 space-y-16">
                        <DescriptionSection description={product.description} />
                        <ReviewsSection />
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