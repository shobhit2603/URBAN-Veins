// models/User.js
import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const AddressSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // "Home", "Work"
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name.'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email.'],
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Please provide a valid email address.'],
    },
    image: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      // required only for credentials users
      select: false, // never return by default
    },
    mobile: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number.'],
    },
    alternateMobile: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number.'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true,
    },

    // OAuth provider IDs
    googleId: { type: String },
    appleId: { type: String },

    // Email verification
    emailVerified: { type: Date, default: null },

    // Relations
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    addresses: [AddressSchema],

    cart: [CartItemSchema],

    // --- Wishlist: list of product IDs ---
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
