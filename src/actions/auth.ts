
'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { randomBytes } from 'crypto';
import { promisify } from 'util';

const loginSchema = z.object({
  identifier: z.string().min(1, { message: 'Please enter your email or name.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  role: z.enum(['member', 'pastor']).optional(),
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { identifier, password, role } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ 
      $or: [{ email: identifier }, { name: identifier }] 
    });

    if (!user) {
      return { message: 'Invalid credentials provided.' };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return { message: 'Invalid credentials provided.' };
    }
    
    // If a role is specified during login (i.e., pastor login form), 
    // check if it matches the user's role.
    if (role && user.role !== role) {
      return { message: 'Login failed. You do not have the required role.' };
    }

    return {
      success: true,
      role: user.role,
      email: user.email, // Return email on success
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

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
    
    // Assign 'pastor' role if the email matches, otherwise assign 'member'
    const userRole = email === 'edwindezak@gmail.com' ? 'pastor' : 'member';

    await usersCollection.insertOne({
      name,
      email,
      phone,
      password: hashedPassword,
      role: userRole,
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

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

export async function requestPasswordReset(prevState: any, formData: FormData) {
  const validatedFields = forgotPasswordSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });

    if (!user) {
      // Don't reveal if the user exists or not for security reasons
      return {
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.',
      };
    }

    // Generate a secure token
    const randomBytesAsync = promisify(randomBytes);
    const token = (await randomBytesAsync(32)).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { resetToken: token, resetTokenExpiry: tokenExpiry } }
    );
    
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/reset-password?token=${token}`;

    // --- In this prototype, we log the link to the console instead of sending an email. ---
    console.log(`Password reset link for ${email}: ${resetLink}`);
    // --- End of TODO ---

    return {
      success: true,
      message: 'A password reset link has been generated. Please check the development console to retrieve it.',
    };

  } catch (error) {
    console.error('Password reset request error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Invalid token.'),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export async function resetPassword(prevState: any, formData: FormData) {
   const validatedFields = resetPasswordSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { token, password } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return {
        message: 'This password reset link is invalid or has expired.',
      };
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" },
      }
    );

    return {
      success: true,
      message: 'Your password has been reset successfully. You can now log in.',
    }

  } catch (error) {
    console.error('Password reset error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}
