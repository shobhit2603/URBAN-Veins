import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import Product from '@/models/Product';
import User from '@/models/User';
import Order from '@/models/Order';
import { auth } from '@/auth';

export async function GET(request) {
  try {
    await dbConnect();

    // 1. Security Check
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // 2. Fetch Counts in Parallel
    const [totalUsers, totalProducts, totalOrders, revenueData] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({}),
      Order.countDocuments({}),
      Order.aggregate([
        { $match: { 'paymentInfo.paymentStatus': 'completed' } },
        { $group: { _id: null, total: { $sum: '$paymentInfo.amount' } } }
      ])
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // 3. Check Low Stock (Products where any variant has stock < 5)
    const lowStockCount = await Product.countDocuments({
      "variants.stock": { $lt: 5 }
    });

    return NextResponse.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockCount
    }, { status: 200 });

  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}