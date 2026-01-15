import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { checkAdmin } from '@/lib/adminAuth';

export async function POST(request) {
  try {
    // 1. Security Check
    const { error, status } = await checkAdmin();
    if (error) {
      return NextResponse.json({ message: error }, { status });
    }

    // 2. Debugging Check (Server-side logs)
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecret) {
      console.error("❌ CLOUDINARY_API_SECRET is missing in .env.local");
      return NextResponse.json({ message: "Server misconfiguration: Missing API Secret" }, { status: 500 });
    }

    // 3. Generate Signature
    const timestamp = Math.round((new Date).getTime() / 1000);
    
    // The parameters here MUST match exactly what you append to formData in the frontend
    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      folder: 'urban-veins-products', 
    }, apiSecret);

    return NextResponse.json({ timestamp, signature }, { status: 200 });

  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json(
      { message: 'Error generating signature', error: error.message },
      { status: 500 }
    );
  }
}