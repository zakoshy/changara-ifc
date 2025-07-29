
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
    // Find all users who are NOT pastors
    const users = await usersCollection.find({ role: { $ne: 'pastor' } }).toArray();

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

export async function updateUserProfilePicture(userId: string, imageUrl: string | null) {
  try {
    if (!ObjectId.isValid(userId)) {
        return { error: 'Invalid user ID. Cannot update picture for a fallback user.' };
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    
    const updateOperation = imageUrl
      ? { $set: { imageUrl: imageUrl } }
      : { $unset: { imageUrl: "" } };

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      updateOperation
    );

    if (result.modifiedCount === 0 && result.matchedCount === 0) {
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
  // This is a simplified fetch. In a real app, you would
  // get the current user from a secure session.
  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    
    let user;
    // If a valid ObjectId is passed, try to find that user by ID.
    if (ObjectId.isValid(userId)) {
        user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    } 
    // Otherwise, if it's an email (from our localStorage logic), find by email.
    else if (userId.includes('@')) {
        user = await usersCollection.findOne({ email: userId });
    }

    // If no user is found by ID or email, fall back to the first 'member' for demo purposes.
    if (!user) {
        user = await usersCollection.findOne({ role: 'member' });
    }

    if (user) {
        return {
        ...user,
        id: (user._id as ObjectId).toString(),
        _id: undefined, 
        phone: user.phone || 'N/A',
        imageUrl: user.imageUrl || `https://placehold.co/128x128.png?text=${user.name.charAt(0)}`
        } as User;
    }

    // Fallback for when no member user is in the DB at all.
    return {
        id: 'fallback-user-id', // This ID is not a valid ObjectId
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

export async function deleteUser(userId: string) {
  try {
    if (!ObjectId.isValid(userId)) {
      return { success: false, message: 'Invalid user ID.' };
    }
    
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
    
    if (result.deletedCount === 0) {
      return { success: false, message: 'Could not find user to delete.' };
    }

    revalidatePath('/pastor/dashboard');
    return { success: true, message: 'User deleted successfully.' };
  } catch (error) {
    console.error('Delete user error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
