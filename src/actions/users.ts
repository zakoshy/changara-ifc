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
        return { error: 'Invalid user ID. Cannot update picture for a fallback user.' };
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
  // In a real app, you'd have session management to get the currently logged-in user.
  // For this demo, we'll find the first 'member' user.
  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // In a real app, you'd use the userId passed in. For now, we get the first member.
    const user = await usersCollection.findOne({ role: 'member' });

    if (user) {
        return {
        ...user,
        id: (user._id as ObjectId).toString(),
        _id: undefined, // remove non-serializable object
        phone: user.phone || 'N/A',
        imageUrl: user.imageUrl || `https://placehold.co/40x40.png?text=${user.name.charAt(0)}`
        } as User;
    }

    // Fallback for when no member user is in the DB, to prevent the app from crashing.
    return {
        id: 'fallback-user-id', // This ID is not a valid ObjectId, which is handled.
        name: 'Member User',
        email: 'member@example.com',
        phone: '555-555-5555',
        role: 'member',
        joinedAt: new Date().toISOString(),
        imageUrl: 'https://placehold.co/128x128.png'
    };
  } catch (error) {
    console.error("Failed to fetch user:", error);
     // Fallback in case of DB error
    return {
        id: 'fallback-user-id',
        name: 'Member User',
        email: 'member@example.com',
        phone: '555-555-5555',
        role: 'member',
        joinedAt: new Date().toISOString(),
        imageUrl: 'https://placehold.co/128x128.png'
    };
  }
}
