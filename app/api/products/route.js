import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import Product from '@/models/Product';
import { auth } from '@/auth';
import { filterProducts, getDemoProducts } from '@/lib/productsFallback';

function readFilters(searchParams) {
  return {
    search: searchParams.get('search'),
    category: searchParams.get('category'),
    idealFor: searchParams.get('idealFor'),
    type: searchParams.get('type'),
    sort: searchParams.get('sort'),
    featured: searchParams.get('featured'),
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = readFilters(searchParams);

    try {
      await dbConnect();

      const query = { isActive: true };

      if (filters.search) {
        query.$text = { $search: filters.search };
      }

      if (filters.category && filters.category !== 'all') {
        query.category = { $regex: new RegExp(`^${filters.category}$`, 'i') };
      }

      if (filters.idealFor && filters.idealFor !== 'all') {
        query.idealFor = filters.idealFor;
      }

      if (filters.type && filters.type !== 'all') {
        query.type = filters.type;
      }

      if (filters.featured === 'true') {
        query.isFeatured = true;
      }

      let sortOption = { createdAt: -1 };
      if (filters.sort === 'price-asc') sortOption = { price: 1 };
      if (filters.sort === 'price-desc') sortOption = { price: -1 };

      const products = await Product.find(query).sort(sortOption);

      if (products.length > 0) {
        return NextResponse.json({ products }, { status: 200 });
      }

      const fallbackProducts = filterProducts(getDemoProducts(), filters);

      return NextResponse.json({ products: fallbackProducts, fallback: true }, { status: 200 });
    } catch (databaseError) {
      console.warn('Products API falling back to demo catalog:', databaseError.message);

      const products = filterProducts(getDemoProducts(), filters);

      return NextResponse.json({ products, fallback: true }, { status: 200 });
    }

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