import mongoose from 'mongoose';

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
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },

    // Pricing
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },

    // Image Gallery
    images: {
      type: [String],
      validate: [arrayLimit, '{PATH} must have at least 1 image'],
    },
    
    // Category
    category: {
      type: String,    
      required: [true, "Please provide a category name"], 
      index: true, 
    },

    // Filters
    idealFor: {
      type: String,
      enum: ["men", "women", "unisex", "kids"],
      default: "unisex",
      index: true
    },
    type: {
      type: String,
      default: "top-wear",
      index: true
    },
    brand: {
      type: String,
      default: "Urban Veins",
      index: true
    },

    tags: [{ type: String, trim: true }],

    // Variants
    variants: [VariantSchema],

    // Reviews
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    // Visibility / Status
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Helper validator for images array
function arrayLimit(val) {
  return val.length > 0;
}

// -------------------------------
// 🔍 Search Index
// -------------------------------
ProductSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});

// REMOVED THE pre('validate') HOOK TO FIX THE ERROR
// We will handle slug generation in the API route instead.

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);