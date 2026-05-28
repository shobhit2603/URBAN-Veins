import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import Product from '@/models/Product';
import { auth } from '@/auth';
import { findDemoProductBySlug } from '@/lib/productsFallback';

// GET: Fetch a single product by slug
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    try {
      await dbConnect();

      const product = await Product.findOne({ slug: slug });

      if (!product) {
        const fallbackProduct = findDemoProductBySlug(slug);

        if (!fallbackProduct) {
          return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ product: fallbackProduct, fallback: true }, { status: 200 });
      }

      return NextResponse.json({ product }, { status: 200 });
    } catch (databaseError) {
      console.warn('Product detail API falling back to demo catalog:', databaseError.message);

      const product = findDemoProductBySlug(slug);

      if (!product) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ product, fallback: true }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a product (Admin Only)
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    // 1. Check Auth & Role
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { slug } = await params;
    const body = await request.json();

    // 2. Prepare Update Data
    // We explicitly extract fields to match the new Schema structure
    const {
      name, slug: newSlug, description, price, discountPrice,
      images, category, idealFor, type, brand, tags,
      variants, isFeatured, isActive
    } = body;

    const updateData = {
      name, description, price, discountPrice,
      images, category, idealFor, type, brand, tags,
      variants, isFeatured, isActive
    };

    // If a new slug is provided, update it; otherwise, keep the old one.
    if (newSlug) {
      updateData.slug = newSlug;
    }

    // Remove undefined fields so we don't overwrite existing data with nulls
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // 3. Update Product
    const updatedProduct = await Product.findOneAndUpdate(
      { slug: slug },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Product updated successfully', product: updatedProduct },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating product:', error);
    // Handle duplicate slug error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'A product with this name/slug already exists.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to update product', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product (Admin Only)
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    // 1. Check Auth & Role
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { slug } = await params;

    // 2. Delete Product
    const deletedProduct = await Product.findOneAndDelete({ slug: slug });

    if (!deletedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'Failed to delete product', error: error.message },
      { status: 500 }
    );
  }
}