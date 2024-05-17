import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import User from '@/model/user.model';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();
  const emailPattern = /^\S+@rezy\.in$/i;
  if (!name || !email || !password) {
    return NextResponse.json(
      { message: 'Missing required fields' },
      { status: 206 }
    );
  }
  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { message: 'Email not allowed.' },
      { status: 400 }
    );
  }
  try {
    await connectToMongoDB();
    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 409 }
      );
    } else {
      const user = new User({
        name: name,
        email: email,
        password: password,
      });
      await user.save();
      return NextResponse.json({ message: 'created' }, { status: 202 });
    }
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json({ message: 'error' }, { status: 400 });
}
