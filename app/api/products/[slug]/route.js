import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import Product from '@/models/Product';
import { auth } from '@/auth';

// GET: Fetch a single product by slug
export async function GET(request, { params }) {
  try {
    await dbConnect();
    // In Next.js 15+, params is a Promise and must be awaited
    const { slug } = await params;

    const product = await Product.findOne({ slug: slug });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
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

    // 2. Update Product
    // { new: true } returns the updated document
    // { runValidators: true } ensures updates follow schema rules (enums, required fields)
    const updatedProduct = await Product.findOneAndUpdate(
      { slug: slug },
      body,
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
    // Handle duplicate slug error if name is changed to an existing one
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