'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/mongodb';
import { Event } from '@/lib/types';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  date: z.string().min(1, 'Date is required.'),
  time: z.string().min(1, 'Time is required.'),
  location: z.string().min(1, 'Location is required.'),
  teachingUrl: z.string().url().optional().or(z.literal('')),
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
    const eventsCollection = db.collection<Omit<Event, 'id'>>('events');
    
    // TODO: Handle actual file upload for teaching material
    // For now, we are just saving the URL if provided
    
    await eventsCollection.insertOne({
      ...validatedFields.data,
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
    const events = await eventsCollection.find({}).toArray();

    return events.map(event => {
      const { _id, ...rest } = event;
      return {
        ...rest,
        id: _id.toString(),
      }
    }) as Event[];

  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}
