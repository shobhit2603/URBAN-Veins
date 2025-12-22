import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@/auth';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    // 1. Check if user is authenticated
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Generate Signature
    const timestamp = Math.round((new Date).getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      folder: 'urban-veins-users', // Separate folder for user avatars
    }, process.env.CLOUDINARY_API_SECRET);

    return NextResponse.json({ timestamp, signature }, { status: 200 });

  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json(
      { message: 'Error generating signature', error: error.message },
      { status: 500 }
    );
  }
}