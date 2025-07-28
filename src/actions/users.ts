'use server';

import clientPromise from '@/lib/mongodb';
import { User } from '@/lib/types';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

export async function getUsers(): Promise<User[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();

    return users.map(user => ({
      ...user,
      id: (user._id as ObjectId).toString(),
      _id: undefined, // remove non-serializable object
      imageUrl: user.imageUrl || `https://placehold.co/40x40.png?text=${user.name.charAt(0)}`
    })) as User[];

  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}


export async function getPastor(): Promise<User | null> {
    try {
      const client = await clientPromise;
      const db = client.db();
      const usersCollection = db.collection('users');
      const pastor = await usersCollection.findOne({ role: 'pastor' });
  
      if (!pastor) {
        return null;
      }
      
      return {
        ...pastor,
        id: (pastor._id as ObjectId).toString(),
        _id: undefined,
        imageUrl: pastor.imageUrl || 'https://placehold.co/40x40.png'
      } as User;
  
    } catch (error) {
      console.error("Failed to fetch pastor:", error);
      return null;
    }
  }

export async function updateUserProfilePicture(userId: string, imageUrl: string) {
  try {
    if (!ObjectId.isValid(userId)) {
        return { error: 'Invalid user ID.' };
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { imageUrl: imageUrl } }
    );

    if (result.modifiedCount === 0) {
        return { error: 'Could not find the user to update.' };
    }
    
    revalidatePath('/dashboard');
    revalidatePath('/pastor/dashboard');

    return { success: true, message: 'Profile picture updated successfully!' };
  } catch (error) {
    console.error('Update profile picture error:', error);
    return { error: 'An unexpected error occurred.' };
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  // This is a mock function. In a real app, you'd have session management
  // to get the currently logged-in user. We'll find the first 'member' user.
  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Find the first user with the role 'member' as a stand-in for the current user
    const user = await usersCollection.findOne({ role: 'member' });

    if (!user) {
      return null;
    }

    return {
      ...user,
      id: (user._id as ObjectId).toString(),
      _id: undefined,
      imageUrl: user.imageUrl || `https://placehold.co/40x40.png?text=${user.name.charAt(0)}`
    } as User;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}