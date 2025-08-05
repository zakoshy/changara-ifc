'use server';

import clientPromise from '@/lib/mongodb';
import { Contribution } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function getContributions(): Promise<Contribution[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const contributionsCollection = db.collection('contributions');
    const contributions = await contributionsCollection.find({}).sort({ date: -1 }).toArray();

    // In a real app, you would join with the users table to get names.
    // For now, we will link contributions to users to get their details.
    
    const usersCollection = db.collection('users');

    const formattedContributions = await Promise.all(contributions.map(async (contribution) => {
        const user = await usersCollection.findOne({ _id: new ObjectId(contribution.userId) });
        return {
            ...contribution,
            _id: undefined, // remove non-serializable object
            id: (contribution._id as ObjectId).toString(),
            userName: user ? user.name : 'Unknown Member',
            userEmail: user ? user.email : 'Unknown Email'
        }
    }));
    
    return formattedContributions as Contribution[];

  } catch (error) {
    console.error("Failed to fetch contributions:", error);
    return [];
  }
}
