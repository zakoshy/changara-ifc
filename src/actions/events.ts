'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/mongodb';
import { Event } from '@/lib/types';
import { ObjectId } from 'mongodb';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  date: z.string().min(1, 'Date is required.'),
  time: z.string().min(1, 'Time is required.'),
  location: z.string().min(1, 'Location is required.'),
  teachingUrl: z.any().optional(),
});

export async function createEvent(prevState: any, formData: FormData) {
  const validatedFields = eventSchema.safeParse(
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
    const eventsCollection = db.collection('events');
    
    // TODO: Handle actual file upload for teaching material
    // For now, we are just saving the URL if provided
    const { teachingUrl, ...eventData } = validatedFields.data;
    
    await eventsCollection.insertOne({
      ...eventData,
      teachingUrl: teachingUrl ? '/placeholder.pdf' : undefined, // Placeholder for file path
      imageUrl: 'https://placehold.co/600x400.png' // Placeholder image
    });

    revalidatePath('/pastor/dashboard');
    return {
      success: true,
      message: 'Event created successfully!',
    };
  } catch (error) {
    console.error('Create event error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}


export async function getEvents(): Promise<Event[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const eventsCollection = db.collection('events');
    const events = await eventsCollection.find({}).sort({ date: 1 }).toArray();

    return events.map(event => ({
      ...event,
      _id: undefined, // remove non-serializable object
      id: (event._id as ObjectId).toString(),
      imageUrl: event.imageUrl || 'https://placehold.co/600x400.png',
    })) as Event[];

  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

export async function deleteEvent(eventId: string) {
  try {
    if (!ObjectId.isValid(eventId)) {
      return { success: false, message: 'Invalid event ID.' };
    }
    
    const client = await clientPromise;
    const db = client.db();
    const eventsCollection = db.collection('events');

    const result = await eventsCollection.deleteOne({ _id: new ObjectId(eventId) });
    
    if (result.deletedCount === 0) {
      return { success: false, message: 'Could not find event to delete.' };
    }

    revalidatePath('/pastor/dashboard');
    return { success: true, message: 'Event deleted successfully.' };
  } catch (error) {
    console.error('Delete event error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
