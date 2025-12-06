// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db/dbConnect';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, password, mobile } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return NextResponse.json(
        { error: 'Email is already registered. Please log in.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      // role defaults to 'user'
      // emailVerified stays null for now (no email verification flow yet)
    });

    return NextResponse.json(
      {
        message: 'User registered successfully.',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong while registering.' },
      { status: 500 }
    );
  }
}
