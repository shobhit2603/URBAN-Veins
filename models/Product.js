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
    discountPrice: { // Renamed from 'mrp' to align with previous discussions, optional
      type: Number,
      min: 0,
    },

    // Image Gallery
    images: {
      type: [String], // Array of image URLs
      validate: [arrayLimit, '{PATH} must have at least 1 image'],
    },
    
    // Category (Keeping as String for simplicity as per your schema)
    category: {
      type: String,    
      required: [true, "Please provide a category name"], 
      index: true, 
    },

    // Filters
    idealFor: {
      type: String,
      enum: ["men", "women", "unisex"], 
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

    // Reviews (Reference to Review model)
    // Note: If you haven't created the Review model yet, this ref will point to a non-existent model until you do.
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
// Enables full-text search for:
// name, description, tags
// -------------------------------
ProductSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});

// Generate slug from name before saving
ProductSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().split(' ').join('-');
  }
  next();
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);