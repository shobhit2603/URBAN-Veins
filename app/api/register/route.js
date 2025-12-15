import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection'; // Ensure this filename matches your created file (e.g., db.js or dbConnection.js)
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // 1. Get data from the frontend
    const body = await request.json();
    const { email, password } = body;
    
    // Normalize fields (handle if frontend sends 'fullName' or 'phone')
    const name = body.name || body.fullName;
    const mobile = body.mobile || body.phone;

    // 2. Validate
    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { message: 'All fields (Name, Email, Mobile, Password) are required.' },
        { status: 400 }
      );
    }

    // 3. Connect to DB
    await dbConnect();

    // 4. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create User
    await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}