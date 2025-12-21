import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import Order from '@/models/Order';
import { auth } from '@/auth';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const session = await auth();

    // 1. Check Authentication
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // 2. Find Order
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // 3. Security Check: Ensure this order belongs to the logged-in user
    if (order.user.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden: This is not your order' }, { status: 403 });
    }

    return NextResponse.json({ order }, { status: 200 });

  } catch (error) {
    console.error('Fetch Single Order Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}