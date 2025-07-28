'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/mongodb';
import { Teaching } from '@/lib/types';
import { ObjectId } from 'mongodb';
import {v4 as uuidv4} from 'uuid';

const teachingSchema = z.object({
  text: z.string().optional(),
  mediaType: z.enum(['photo', 'video', 'audio']),
});

export async function createTeaching(prevState: any, formData: FormData) {
  const validatedFields = teachingSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const teachingsCollection = db.collection('teachings');
    
    const { text, mediaType } = validatedFields.data;
    
    // In a real app, you would handle file uploads to a storage service (e.g., S3, Firebase Storage)
    // and store the URL. For this demo, we'll use a placeholder.
    let mediaUrl = 'https://placehold.co/600x400.png';
    if (mediaType === 'video') {
        mediaUrl = 'https://placehold.co/600x400.png/000000/FFFFFF?text=Video';
    } else if (mediaType === 'audio') {
        mediaUrl = 'https://placehold.co/600x400.png/E8E8E8/000000?text=Audio';
    }

    await teachingsCollection.insertOne({
      id: uuidv4(),
      text,
      mediaType,
      mediaUrl,
      createdAt: new Date().toISOString(),
    });

    revalidatePath('/pastor/dashboard');
    return {
      success: true,
      message: 'Teaching created successfully!',
    };
  } catch (error) {
    console.error('Create teaching error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function getTeachings(): Promise<Teaching[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const teachingsCollection = db.collection('teachings');
    const teachings = await teachingsCollection.find({}).sort({ createdAt: -1 }).toArray();

    return teachings.map(teaching => ({
      ...teaching,
      _id: undefined, // remove non-serializable object
      id: (teaching.id as string),
    })) as Teaching[];

  } catch (error) {
    console.error("Failed to fetch teachings:", error);
    return [];
  }
}

export async function deleteTeaching(teachingId: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const teachingsCollection = db.collection('teachings');

    const result = await teachingsCollection.deleteOne({ id: teachingId });
    
    if (result.deletedCount === 0) {
      return { success: false, message: 'Could not find teaching to delete.' };
    }

    revalidatePath('/pastor/dashboard');
    return { success: true, message: 'Teaching deleted successfully.' };
  } catch (error) {
    console.error('Delete teaching error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
