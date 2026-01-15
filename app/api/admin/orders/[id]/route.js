import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import Order from '@/models/Order';
import User from '@/models/User'; // Needed to populate customer details
import { checkAdmin } from '@/lib/adminAuth';

// GET: Fetch Single Order Details (Admin Only)
export async function GET(request, { params }) {
  await dbConnect();

  try {
    // 1. Security Check
    const { error, status } = await checkAdmin();
    if (error) {
      return NextResponse.json({ message: error }, { status });
    }

    const { id } = await params;

    // 2. Fetch Order and Populate User
    const order = await Order.findById(id).populate({
      path: 'user',
      model: 'User',
      select: 'name email mobile image', // Get customer contact info
    });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { message: 'Error fetching order', error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update Order Status (Admin Only)
export async function PUT(request, { params }) {
  await dbConnect();

  try {
    // 1. Security Check
    const { error, status } = await checkAdmin();
    if (error) {
      return NextResponse.json({ message: error }, { status });
    }

    const { id } = await params;
    const { orderStatus } = await request.json();

    // 2. Validate Status
    const validStatuses = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // 3. Update Order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { message: 'Error updating order', error: error.message },
      { status: 500 }
    );
  }
}