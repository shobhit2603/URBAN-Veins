import mongoose from "mongoose";

// ================================
// Variant Schema (Color + Size + Stock)
// ================================
const VariantSchema = new mongoose.Schema(
  {
    color: { type: String, required: true },
    size: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false } // prevents unnecessary _id in each variant
);

// ================================
// Product Schema
// ================================
const ProductSchema = new mongoose.Schema(
  {
    // Basic Product Info
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },

    // Pricing
    price: { type: Number, required: true },       // final price
    mrp: { type: Number },                         // original price (optional)

    // Image Gallery
    images: [{ type: String, required: true }],    // array of Cloudinary URLs
    
    // Category (Link to category model, expandable)
    category: {
      type: String,    
      required: [true, "Please provide a category name"], 
      index: true, 
    },

    // Filters
    idealFor: { type: String, enum: ["men", "women", "unisex"], default: "unisex", index: true },
    type: { type: String, default: "top-wear", index: true },
    brand: { type: String, default: "Urban Veins", index: true },

    tags: [{ type: String, trim: true }],

    // Variants
    variants: [VariantSchema],

    // Reviews
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    // Visibility / Status
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false }, // For homepage highlights
  },
  { timestamps: true }
);

// -------------------------------
// 🔍 Search Index
// Enables full-text search for:
// name, description, tags, brand
// -------------------------------
ProductSchema.index({
  name: "text",
  description: "text",
  tags: "text",
  brand: 1,
  category: 1,
  type: 1,
});

// ================================
export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
