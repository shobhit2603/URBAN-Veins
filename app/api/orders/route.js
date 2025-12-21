import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import Order from '@/models/Order';
import { auth } from '@/auth';

export async function GET(request) {
  try {
    await dbConnect();
    const session = await auth();

    // 1. Check Authentication
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch Orders for THIS user only
    const orders = await Order.find({ user: session.user.id })
      .sort({ createdAt: -1 }) // Newest first
      .select('orderId totalAmount paymentInfo orderStatus createdAt items'); // Optimization: Select only needed fields

    return NextResponse.json({ orders }, { status: 200 });

  } catch (error) {
    console.error('Fetch Orders Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}