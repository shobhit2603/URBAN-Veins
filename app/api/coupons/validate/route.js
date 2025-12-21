import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import Coupon from '@/models/Coupon';
import { auth } from '@/auth';

export async function POST(request) {
  try {
    await dbConnect();
    
    // Ensure user is logged in
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { code, cartTotal } = await request.json();

    if (!code) {
      return NextResponse.json({ message: 'Coupon code is required' }, { status: 400 });
    }

    // Find active coupon
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      isActive: true 
    });

    if (!coupon) {
      return NextResponse.json({ message: 'Invalid coupon code' }, { status: 404 });
    }

    // Check expiration
    if (new Date() > new Date(coupon.expiresAt)) {
      return NextResponse.json({ message: 'Coupon has expired' }, { status: 400 });
    }

    // Check minimum purchase
    if (cartTotal < coupon.minPurchase) {
      return NextResponse.json({ 
        message: `Minimum purchase of ₹${coupon.minPurchase} required` 
      }, { status: 400 });
    }

    // Success
    return NextResponse.json({ 
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      code: coupon.code,
      message: 'Coupon applied successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Coupon Validation Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}