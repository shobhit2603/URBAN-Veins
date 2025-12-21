import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { auth } from '@/auth';
import mongoose from 'mongoose';

// POST: Create a Review
export async function POST(request) {
  try {
    await dbConnect();
    
    // 1. Check Authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { productId, rating, comment } = await request.json();

    // 2. Validate Input
    if (!productId || !rating || !comment) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 3. Create Review
    // Using create() directly. If duplicate (same user/product), mongoose throws code 11000
    const review = await Review.create({
      user: session.user.id,
      product: productId,
      rating: Number(rating),
      comment,
    });

    // 4. Calculate New Average Rating & NumReviews
    // We use MongoDB Aggregation for precise calculation
    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: '$product',
          numReviews: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    // 5. Update Product with new stats and push review ID
    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: stats[0].avgRating,
        numReviews: stats[0].numReviews,
        $push: { reviews: review._id }
      });
    }

    return NextResponse.json({ message: 'Review added successfully', review }, { status: 201 });

  } catch (error) {
    // Handle duplicate review error from MongoDB index
    if (error.code === 11000) {
      return NextResponse.json({ message: 'You have already reviewed this product' }, { status: 400 });
    }
    console.error('Create Review Error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

// GET: Fetch Reviews for a Product
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    // Fetch reviews and populate user details (name, image)
    const reviews = await Review.find({ product: productId })
      .sort({ createdAt: -1 }) // Newest first
      .populate('user', 'name image');

    return NextResponse.json({ reviews }, { status: 200 });

  } catch (error) {
    console.error('Get Reviews Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}