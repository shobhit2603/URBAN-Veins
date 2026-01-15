"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Loader2 
} from "lucide-react";

// Common tags to suggest
const SUGGESTED_TAGS = ["Trending", "Best Seller", "New Arrival", "Featured", "Sale", "Premium"];

export default function ProductForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // --- FORM STATE ---
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [discountPrice, setDiscountPrice] = useState(initialData?.discountPrice || "");
  const [category, setCategory] = useState(initialData?.category || "");
  
  const [idealFor, setIdealFor] = useState(initialData?.idealFor || "unisex");
  const [type, setType] = useState(initialData?.type || "top-wear");
  const [brand, setBrand] = useState(initialData?.brand || "Urban Veins");

  const [tags, setTags] = useState(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");

  const [images, setImages] = useState(initialData?.images || []);
  const [variants, setVariants] = useState(initialData?.variants || [
    { color: "", size: "", stock: 0 }
  ]);
  
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);

  // --- HANDLERS ---

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!isEdit) {
      setSlug(val.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // --- DEBUGGING CHECK ---
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    if (!cloudName || !apiKey) {
      alert("Missing Cloudinary Environment Variables! Check .env.local and Restart Server.");
      console.error("Cloud Name:", cloudName, "API Key:", apiKey);
      return;
    }

    setIsUploading(true);
    const newImages = [...images];

    try {
      // 1. Get Signature
      const signRes = await fetch('/api/admin/cloudinary-sign', { method: 'POST' });
      
      if (!signRes.ok) throw new Error("Failed to get signature from backend");
      const { signature, timestamp } = await signRes.json();

      console.log("Got Signature:", signature, "Timestamp:", timestamp);

      // 2. Upload Each File
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('api_key', apiKey); // Using the variable checked above
        formData.append('folder', 'urban-veins-products'); // Must match backend exactly

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        
        console.log(`Uploading to ${url}...`);

        const uploadRes = await fetch(url, { method: 'POST', body: formData });
        
        if (!uploadRes.ok) {
           const errData = await uploadRes.json();
           console.error("Cloudinary Error Details:", errData);
           throw new Error(errData.error?.message || "Upload failed");
        }

        const data = await uploadRes.json();
        
        if (data.secure_url) {
          newImages.push(data.secure_url);
        }
      }
      setImages(newImages);
    } catch (error) {
      console.error("Upload process failed:", error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Tags
  const handleAddTag = (e) => {
    if (e) e.preventDefault();
    const val = tagInput.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Variants
  const addVariant = () => {
    setVariants([...variants, { color: "", size: "", stock: 0 }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name,
      slug,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      category,
      idealFor,
      type,
      brand,
      tags,
      images,
      variants: variants.map(v => ({...v, stock: Number(v.stock)})),
      isActive,
      isFeatured
    };

    try {
      const url = isEdit ? `/api/products/${initialData.slug}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(isEdit ? "Product updated!" : "Product created!");
        router.push("/admin/products");
        router.refresh();
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
      
      {/* 1. Basic Info */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Product Name</label>
            <input 
              required
              type="text" 
              value={name} 
              onChange={handleNameChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              placeholder="e.g. Oversized Tee"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Slug</label>
            <input 
              required
              type="text" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)}
              disabled={isEdit}
              className="w-full mt-1 p-2 border rounded-lg bg-zinc-50"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase">Description</label>
          <textarea 
            required
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg h-32 focus:ring-2 focus:ring-black outline-none resize-none"
          />
        </div>
      </div>

      {/* 2. Pricing & Organization */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Pricing & Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Price (₹)</label>
            <input 
              required
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Discount Price (Optional)</label>
            <input 
              type="number" 
              value={discountPrice} 
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Category</label>
            <input 
              required
              type="text" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. T-Shirts"
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Ideal For</label>
            <select 
              value={idealFor} 
              onChange={(e) => setIdealFor(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-white"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
              <option value="kids">Kids</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-white"
            >
              <option value="top-wear">Top Wear</option>
              <option value="bottom-wear">Bottom Wear</option>
              <option value="footwear">Footwear</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase">Brand</label>
            <input 
              type="text" 
              value={brand} 
              onChange={(e) => setBrand(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase">Tags</label>
          <div className="mt-1 border rounded-lg p-2 flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span key={i} className="bg-zinc-900 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                {tag} <button type="button" onClick={() => removeTag(i)}><X size={12}/></button>
              </span>
            ))}
            <input 
              type="text" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
              placeholder="Type & Enter..."
              className="flex-1 outline-none text-sm min-w-[100px]"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {SUGGESTED_TAGS.map(t => (
              <button 
                key={t} 
                type="button" 
                onClick={() => !tags.includes(t) && setTags([...tags, t])}
                className="text-xs border px-2 py-1 rounded-full hover:bg-zinc-100"
              >
                + {t}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="accent-black" />
            <span className="text-sm font-medium">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="accent-black" />
            <span className="text-sm font-medium">Featured</span>
          </label>
        </div>
      </div>

      {/* 3. Images */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Product Images</h2>
        <div className="flex flex-wrap gap-4">
          {images.map((url, i) => (
            <div key={i} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
              <Image src={url} alt="Product" fill className="object-cover" />
              <button 
                type="button" 
                onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <label className="w-24 h-24 border-2 border-dashed border-zinc-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors">
            {isUploading ? <Loader2 className="animate-spin" /> : <Upload className="text-zinc-400" />}
            <span className="text-xs text-zinc-500 mt-1">Upload</span>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* 4. Variants */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Variants</h2>
          <button type="button" onClick={addVariant} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            <Plus size={16} /> Add Variant
          </button>
        </div>
        {variants.map((v, i) => (
          <div key={i} className="flex gap-4 items-end border-b pb-4 last:border-0">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Color</label>
              <input 
                type="text" 
                value={v.color} 
                onChange={(e) => updateVariant(i, 'color', e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="w-24">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Size</label>
              <input 
                type="text" 
                value={v.size} 
                onChange={(e) => updateVariant(i, 'size', e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="w-24">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Stock</label>
              <input 
                type="number" 
                value={v.stock} 
                onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <button 
              type="button" 
              onClick={() => removeVariant(i)} 
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg mb-[1px]"
              disabled={variants.length === 1}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={isLoading || isUploading}
          className="bg-black text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-800 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {isEdit ? "Update Product" : "Create Product"}
        </button>
      </div>

    </form>
  );
}