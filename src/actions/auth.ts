'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.'}),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export async function signup(prevState: any, formData: FormData) {
  const validatedFields = signupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { name, email, phone, password } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return {
        message: 'An account with this email already exists.',
      };
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.insertOne({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'member',
      joinedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Account created successfully! You can now log in.',
    }

  } catch (error) {
    console.error('Signup error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

    