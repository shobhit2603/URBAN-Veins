import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide a coupon code'],
    unique: true,
    uppercase: true, // Auto-convert "save10" to "SAVE10"
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Please specify discount type (percentage/fixed)'],
  },
  discountValue: {
    type: Number,
    required: [true, 'Please provide discount value'],
    min: 0,
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: 0,
  },
  expiresAt: {
    type: Date,
    required: [true, 'Please provide an expiration date'],
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);