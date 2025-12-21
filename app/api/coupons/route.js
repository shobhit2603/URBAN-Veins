import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import Coupon from '@/models/Coupon';
import { auth } from '@/auth';

// GET: List all coupons (Admin Only)
export async function GET(request) {
  try {
    await dbConnect();
    const session = await auth();
    
    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    // Fetch coupons, sorted by newest first
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ coupons }, { status: 200 });

  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST: Create a new coupon (Admin Only)
export async function POST(request) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { code, discountType, discountValue, expiresAt, minPurchase } = body;
    
    // Validation
    if (!code || !discountType || !discountValue || !expiresAt) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check for duplicate code
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return NextResponse.json({ message: 'Coupon code already exists' }, { status: 400 });
    }

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        discountType,
        discountValue,
        expiresAt: new Date(expiresAt),
        minPurchase: minPurchase || 0,
        isActive: true
    });

    return NextResponse.json({ message: 'Coupon created successfully', coupon }, { status: 201 });

  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}