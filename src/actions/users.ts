'use server';

import clientPromise from '@/lib/mongodb';
import { User } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function getUsers(): Promise<User[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();

    return users.map(user => ({
      ...user,
      _id: undefined, // remove non-serializable object
      id: (user._id as ObjectId).toString(),
      imageUrl: user.imageUrl || 'https://placehold.co/40x40.png'
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
        _id: undefined,
        id: (pastor._id as ObjectId).toString(),
        imageUrl: pastor.imageUrl || 'https://placehold.co/40x40.png'
      } as User;
  
    } catch (error) {
      console.error("Failed to fetch pastor:", error);
      return null;
    }
  }
