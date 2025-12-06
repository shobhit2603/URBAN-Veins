"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ShieldCheck, Truck } from "lucide-react";

import RelatedProducts from "@/components/ProductPage/RelatedProducts";
import ReviewsSection from "@/components/ProductPage/ReviewsSection";
import DescriptionSection from "@/components/ProductPage/DescriptionSection";
import ProductDetails from "@/components/ProductPage/ProductDetails";
import ProductGallery from "@/components/ProductPage/ProductGallery";

export default function ProductPage() {
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch product from backend
    useEffect(() => {
        if (!params?.slug) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.slug}`);
                if (!res.ok) {
                    console.error("Product API error:", res.status);
                    setProduct(null);
                    return;
                }
                const data = await res.json();
                if (data?.product) setProduct(data.product);
            } catch (err) {
                console.error("❌ Product fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params?.slug]);

    // Loaders
    if (!params?.slug) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-zinc-500">
                Loading product...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center text-zinc-500">
                Product not found.
            </div>
        );
    }

    return (
        <main className="relative min-h-screen bg-[#FAFAFA] pt-24 pb-20 overflow-x-hidden">
            {/* Grain overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 mix-blend-multiply"></div>

            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-violet-200/70 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-[10%] left-0 w-[40vw] h-[40vw] bg-lime-200/50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-8">
                    <Link href="/" className="hover:text-zinc-900">Home</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-zinc-900">Shop</Link>
                    <span>/</span>
                    <span className="text-violet-600">
                        {product.categoryName || product.category}
                    </span>
                </nav>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-10">
                    <div className="lg:col-span-6">
                        <ProductGallery images={product.images} name={product.name} />
                    </div>

                    <div className="lg:col-span-6 relative">
                        <div className="sticky top-28">
                            <ProductDetails product={product} />
                        </div>
                    </div>
                </div>

                {/* Description + Reviews */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-zinc-200 pt-16 mb-20">
                    <div className="lg:col-span-7 space-y-16">
                        <DescriptionSection description={product.description} />
                        <ReviewsSection productId={product._id} />
                    </div>
                    <div className="lg:col-span-5">
                        <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm space-y-6">
                            <h4 className="font-bold uppercase tracking-widest text-sm">Why Urban Veins?</h4>
                            <ul className="space-y-4">
                                <li className="flex gap-4 items-start">
                                    <ShieldCheck className="text-violet-500" size={20} />
                                    <div>
                                        <p className="font-bold text-sm text-zinc-900">Authentic Streetwear</p>
                                        <p className="text-xs text-zinc-500 mt-1">
                                            Every piece is verified for quality.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <Truck className="text-lime-500" size={20} />
                                    <div>
                                        <p className="font-bold text-sm text-zinc-900">Express Shipping</p>
                                        <p className="text-xs text-zinc-500 mt-1">
                                            Free shipping above ₹2,999.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Related products */}
                <RelatedProducts currentSlug={product.slug} category={product.category} />
            </div>
        </main>
    );
}
