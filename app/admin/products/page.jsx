"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Loader2,
  AlertCircle
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // --- 1. FETCH PRODUCTS ---
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        // The API returns { products: [...] }
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 2. DELETE HANDLER ---
  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.slug !== slug));
        alert("Product deleted successfully");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    }
  };

  // --- 3. FILTERING ---
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
    </div>
  );

  return (
    <div className="space-y-6 pt-24">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 font-[Stardom-Regular]">Products</h1>
          <p className="text-zinc-500 text-sm">Manage your inventory and catalog.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-zinc-900 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-zinc-800 transition-colors font-medium shadow-lg shadow-zinc-900/10"
        >
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input 
          type="text" 
          placeholder="Search products by name or category..." 
          className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-50/50 border-b border-zinc-100">
            <tr>
              <th className="p-4 font-medium text-xs text-zinc-500 uppercase tracking-wider">Product</th>
              <th className="p-4 font-medium text-xs text-zinc-500 uppercase tracking-wider">Category</th>
              <th className="p-4 font-medium text-xs text-zinc-500 uppercase tracking-wider">Price</th>
              <th className="p-4 font-medium text-xs text-zinc-500 uppercase tracking-wider">Stock</th>
              <th className="p-4 font-medium text-xs text-zinc-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                // Calculate total stock across all variants
                const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;

                return (
                  <tr key={product._id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0 border border-zinc-200">
                          {product.images?.[0] ? (
                            <Image 
                              src={product.images[0]} 
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                              <AlertCircle size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">{product.name}</p>
                          <p className="text-xs text-zinc-500 font-mono">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-600 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-zinc-900">₹{product.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        totalStock < 5 
                          ? 'bg-red-50 text-red-700 border border-red-100' 
                          : 'bg-green-50 text-green-700 border border-green-100'
                      }`}>
                        {totalStock} in stock
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/products/${product.slug}/edit`}
                          className="p-2 text-zinc-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                        >
                           <Edit size={16} />
                        </Link>
                        
                        <button 
                          onClick={() => handleDelete(product.slug)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="p-12 text-center text-zinc-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-zinc-300" />
                    <p>No products found matching &quot;{search}&quot;</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}