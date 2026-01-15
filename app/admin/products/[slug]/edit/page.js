"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import ProductForm from "../../ProductForm"; // Importing the reusable form

export default function EditProductPage({ params }) {
  // Unwrap params for Next.js 15+
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;
  const router = useRouter();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          // The API returns { product: ... }
          setProduct(data.product);
        } else {
          alert("Product not found");
          router.push("/admin/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
        fetchProduct();
    }
  }, [slug, router]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-zinc-400" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="space-y-6 pt-24">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products" 
          className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold font-[Stardom-Regular]">Edit Product</h1>
      </div>

      {/* Render the reusable form in Edit mode with the fetched data */}
      <ProductForm initialData={product} isEdit={true} />
    </div>
  );
}