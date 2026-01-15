import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import Product from '@/models/Product';
import { auth } from '@/auth';

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

    // 2. Category Filter (Case Insensitive)
    if (category && category !== 'all') {
      // Allows "hoodies" to match "Hoodies"
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // 3. Gender/Target Filter
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
    const { 
      name, slug, description, price, discountPrice, 
      images, category, idealFor, type, brand, tags, 
      variants, isFeatured, isActive 
    } = body;

    // 3. Validate Required Fields (Including new ones)
    if (!name || !price || !category || !idealFor || !type) {
      return NextResponse.json(
        { message: 'Missing required fields (name, price, category, idealFor, type)' },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
        name,
        slug,
        description,
        price,
        discountPrice,
        images,
        category,
        idealFor,
        type,
        brand,
        tags,
        variants,
        isFeatured,
        isActive
    });

    return NextResponse.json(
      { message: 'Product created successfully', product: newProduct },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating product:', error);
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