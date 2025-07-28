'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { randomBytes } from 'crypto';
import { promisify } from 'util';

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

    // --- TODO: Integrate your email sending service here ---
    // Example: await sendEmail({ to: email, subject: 'Reset Your Password', body: `Click here to reset: ${resetLink}` });
    console.log(`Password reset link for ${email}: ${resetLink}`);
    // --- End of TODO ---

    return {
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.',
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
