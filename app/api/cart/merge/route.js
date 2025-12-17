import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import User from '@/models/User';
import { auth } from '@/auth';

export async function POST(request) {
  try {
    await dbConnect();
    const session = await auth();
    
    // Ensure user is logged in
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { localCart } = await request.json();

    // If local cart is empty, do nothing
    if (!localCart || !Array.isArray(localCart) || localCart.length === 0) {
      return NextResponse.json({ message: 'No items to merge' }, { status: 200 });
    }

    const user = await User.findById(session.user.id);

    // Merge Logic
    for (const item of localCart) {
      // Map frontend item fields to backend schema
      // Assuming frontend uses: _id (product), quantity, selectedColor, selectedSize
      // We handle fallback naming just in case
      const productId = item._id || item.productId || item.product;
      const quantity = item.quantity || 1;
      const color = item.selectedColor || item.color;
      const size = item.selectedSize || item.size;

      if (!productId || !color || !size) continue; // Skip invalid items

      // Check if this specific variant is already in the DB cart
      const existingItemIndex = user.cart.findIndex(
        (dbItem) => 
          dbItem.product.toString() === productId && 
          dbItem.color === color && 
          dbItem.size === size
      );

      if (existingItemIndex > -1) {
        // Item exists: Update quantity
        user.cart[existingItemIndex].quantity += quantity;
      } else {
        // New item: Push to cart
        user.cart.push({
          product: productId,
          quantity: quantity,
          color: color,
          size: size
        });
      }
    }

    await user.save();

    return NextResponse.json({ message: 'Cart merged successfully' }, { status: 200 });

  } catch (error) {
    console.error('Cart Merge Error:', error);
    return NextResponse.json({ message: 'Error merging cart' }, { status: 500 });
  }
}