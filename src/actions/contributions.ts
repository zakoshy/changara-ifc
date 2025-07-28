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

    // In a real app, you might join with the users table to get names.
    // For now, we'll assume the structure matches the placeholder.
    // The placeholder data has userName and userEmail, which we don't have in a real scenario yet
    // without linking contributions to users. We will create mock data for now.

    const formattedContributions = contributions.map(contribution => ({
      ...contribution,
      _id: undefined, // remove non-serializable object
      id: (contribution._id as ObjectId).toString(),
      userName: 'Member User', // Placeholder name
      userEmail: 'member@example.com' // Placeholder email
    })) as Contribution[];
    
    // Add placeholder data if none in DB to show table structure
    if (formattedContributions.length === 0) {
        return [
            { id: '1', mpesaRef: 'SGH45KL8OP', userName: 'Alice Johnson', userEmail: 'alice@example.com', date: '2024-07-21' },
            { id: '2', mpesaRef: 'SGH56MN9PQ', userName: 'Bob Williams', userEmail: 'bob@example.com', date: '2024-07-21' },
        ];
    }

    return formattedContributions;

  } catch (error) {
    console.error("Failed to fetch contributions:", error);
    return [];
  }
}
