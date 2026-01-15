"use client";

import ProductForm from "../ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddProductPage() {
  return (
    <div className="space-y-6 pt-24">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold font-[Stardom-Regular]">Add New Product</h1>
      </div>

      {/* Render the reusable form in Create mode */}
      <ProductForm isEdit={false} />
    </div>
  );
}