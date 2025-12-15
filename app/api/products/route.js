import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import Product from '@/models/Product';
import { auth } from '@/auth'; // We use the auth helper from your auth.js configuration

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    // Extraction filters
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const idealFor = searchParams.get('idealFor');
    const type = searchParams.get('type');
    const sort = searchParams.get('sort'); // price-asc, price-desc, newest
    const featured = searchParams.get('featured');

    // Build the query object
    let query = { isActive: true };

    // 1. Text Search (Name, Description, Tags)
    if (search) {
      query.$text = { $search: search };
    }

    // 2. Category Filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // 3. Gender/Target Filter (Men, Women, Unisex)
    if (idealFor && idealFor !== 'all') {
      query.idealFor = idealFor;
    }

    // 4. Product Type Filter
    if (type && type !== 'all') {
      query.type = type;
    }

    // 5. Featured Filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sorting Logic
    let sortOption = { createdAt: -1 }; // Default: Newest first
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    // If using text search, sorting by relevance score is often better, 
    // but explicit sort overrides it.

    const products = await Product.find(query).sort(sortOption);

    return NextResponse.json({ products }, { status: 200 });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    // 1. Check Authentication & Role
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    // 2. Get Data
    const body = await request.json();

    // 3. Validate Basic Fields (Mongoose will also validate, but early check is good)
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { message: 'Missing required fields (name, price, category)' },
        { status: 400 }
      );
    }

    // 4. Create Product
    const newProduct = await Product.create(body);

    return NextResponse.json(
      { message: 'Product created successfully', product: newProduct },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating product:', error);
    // Handle duplicate slug error specifically
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'A product with this name/slug already exists.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to create product', error: error.message },
      { status: 500 }
    );
  }
}