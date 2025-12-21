import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import Coupon from '@/models/Coupon';
import { auth } from '@/auth';

// DELETE: Remove a coupon (Admin Only)
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const session = await auth();

    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Coupon deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}