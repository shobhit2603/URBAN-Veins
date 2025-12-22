import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import User from '@/models/User';
import { auth } from '@/auth';

// GET: Fetch User Profile
export async function GET(request) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user but exclude password and cart (cart is fetched separately)
    const user = await User.findById(session.user.id)
      .select('-password -cart -orders'); 

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error('Profile GET Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update User Profile
export async function PUT(request) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { name, mobile, alternateMobile, image, addresses } = data;

    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (mobile) updateFields.mobile = mobile;
    if (alternateMobile !== undefined) updateFields.alternateMobile = alternateMobile;
    if (image) updateFields.image = image; // Frontend sends the Cloudinary URL
    if (addresses) updateFields.addresses = addresses; // Array of address objects

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateFields },
      { new: true, runValidators: true } // Return updated doc & validate
    ).select('-password -cart');

    return NextResponse.json({ 
      message: 'Profile updated successfully', 
      user: updatedUser 
    }, { status: 200 });

  } catch (error) {
    console.error('Profile UPDATE Error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}