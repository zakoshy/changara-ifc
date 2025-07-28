'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/mongodb';
import { Teaching } from '@/lib/types';
import { ObjectId } from 'mongodb';

const teachingSchema = z.object({
  mediaType: z.enum(['photo', 'video', 'audio']),
  text: z.string().optional(),
  media: z.any().optional(),
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
    const { mediaType, text } = validatedFields.data;

    // In a real app, you would handle the file upload to a storage service (like S3 or Firebase Storage)
    // and get a URL back. For this simulation, we'll use a placeholder.
    let mediaUrl = '';
    switch(mediaType) {
        case 'photo':
            mediaUrl = `https://placehold.co/600x400.png?text=Teaching+Photo`;
            break;
        case 'video':
            mediaUrl = 'https://placehold.co/600x400.png?text=Teaching+Video'; // Placeholder, real video would be different
            break;
        case 'audio':
            mediaUrl = 'https://placehold.co/600x400.png?text=Teaching+Audio'; // Placeholder
            break;
    }


    const client = await clientPromise;
    const db = client.db();
    const teachingsCollection = db.collection('teachings');

    await teachingsCollection.insertOne({
      mediaType,
      mediaUrl,
      text,
      createdAt: new Date().toISOString(),
    });

    revalidatePath('/pastor/dashboard');
    return {
      success: true,
      message: 'Teaching uploaded successfully!',
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
      _id: undefined,
      id: (teaching._id as ObjectId).toString(),
    })) as Teaching[];

  } catch (error) {
    console.error("Failed to fetch teachings:", error);
    return [];
  }
}


export async function deleteTeaching(teachingId: string) {
  try {
    if (!ObjectId.isValid(teachingId)) {
      return { success: false, message: 'Invalid teaching ID.' };
    }
    
    const client = await clientPromise;
    const db = client.db();
    const teachingsCollection = db.collection('teachings');

    // In a real app, you would also delete the file from your storage provider.
    const result = await teachingsCollection.deleteOne({ _id: new ObjectId(teachingId) });
    
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
