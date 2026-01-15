import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import Order from '@/models/Order';
import User from '@/models/User'; // Needed for population
import { checkAdmin } from '@/lib/adminAuth';

export async function GET(request) {
  try {
    await dbConnect();

    // 1. Security Check
    const { error, status } = await checkAdmin();
    if (error) {
      return NextResponse.json({ message: error }, { status });
    }

    // 2. Fetch All Orders
    const orders = await Order.find({})
      .populate('user', 'name email') // Get customer details
      .sort({ createdAt: -1 }); // Newest first

    return NextResponse.json({ orders }, { status: 200 });

  } catch (error) {
    console.error('Admin Orders Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}