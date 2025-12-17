import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import User from '@/models/User';
import Product from '@/models/Product';
import { auth } from '@/auth';

// Helper to get populated cart
async function getPopulatedCart(userId) {
  const user = await User.findById(userId).populate({
    path: 'cart.product',
    model: 'Product',
    select: 'name price images slug variants', // Select fields needed for UI
  });
  return user.cart.filter(item => item.product); // Filter out null products (deleted items)
}

// 1. GET: Fetch Cart
export async function GET(request) {
  try {
    await dbConnect();
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const cart = await getPopulatedCart(session.user.id);
    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    console.error('Cart GET Error:', error);
    return NextResponse.json({ message: 'Error fetching cart' }, { status: 500 });
  }
}

// 2. POST: Add to Cart
export async function POST(request) {
  try {
    await dbConnect();
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { productId, quantity, color, size } = await request.json();

    if (!productId || !quantity || !color || !size) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const user = await User.findById(session.user.id);
    const product = await Product.findById(productId);

    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    // Find if this specific variant (Product + Color + Size) is already in cart
    const existingItemIndex = user.cart.findIndex(
      (item) => 
        item.product.toString() === productId && 
        item.color === color && 
        item.size === size
    );

    // Stock Check (Optional but recommended)
    const variant = product.variants.find(v => v.color === color && v.size === size);
    if (!variant || variant.stock < quantity) {
       return NextResponse.json({ message: 'Not enough stock available' }, { status: 400 });
    }

    if (existingItemIndex > -1) {
      // Item exists, update quantity
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      // New item, push to array
      user.cart.push({ product: productId, quantity, color, size });
    }

    await user.save();
    
    // Return updated cart
    const newCart = await getPopulatedCart(session.user.id);
    return NextResponse.json({ message: 'Added to cart', cart: newCart }, { status: 200 });

  } catch (error) {
    console.error('Cart POST Error:', error);
    return NextResponse.json({ message: 'Error adding to cart' }, { status: 500 });
  }
}

// 3. PUT: Update Quantity
export async function PUT(request) {
  try {
    await dbConnect();
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { itemId, quantity } = await request.json(); // itemId is the _id of the cart item subdocument

    const user = await User.findById(session.user.id);
    const cartItem = user.cart.id(itemId);

    if (!cartItem) return NextResponse.json({ message: 'Item not found in cart' }, { status: 404 });

    if (quantity <= 0) {
      // If quantity is 0 or less, remove it
      cartItem.deleteOne();
    } else {
      // Check stock before updating
      // Note: This requires an extra DB call if you want strict stock checking here
      cartItem.quantity = quantity;
    }

    await user.save();
    const newCart = await getPopulatedCart(session.user.id);
    return NextResponse.json({ message: 'Cart updated', cart: newCart }, { status: 200 });

  } catch (error) {
    console.error('Cart PUT Error:', error);
    return NextResponse.json({ message: 'Error updating cart' }, { status: 500 });
  }
}

// 4. DELETE: Remove Item
export async function DELETE(request) {
  try {
    await dbConnect();
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { itemId } = await request.json();

    const user = await User.findById(session.user.id);
    
    // Use pull to remove the item from the array
    user.cart.pull({ _id: itemId });
    
    await user.save();
    const newCart = await getPopulatedCart(session.user.id);
    return NextResponse.json({ message: 'Item removed', cart: newCart }, { status: 200 });

  } catch (error) {
    console.error('Cart DELETE Error:', error);
    return NextResponse.json({ message: 'Error removing item' }, { status: 500 });
  }
}