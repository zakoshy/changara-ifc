'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/mongodb';
import { Event } from '@/lib/types';
import { ObjectId } from 'mongodb';
import {v4 as uuidv4} from 'uuid';


const eventSchema = z.object({
  // Event fields (optional)
  title: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  
  // Teaching fields (optional)
  teachingText: z.string().optional(),
  teachingMediaType: z.enum(['photo', 'video', 'audio']).optional(),
  teachingMediaUrl: z.any().optional(), // For file upload placeholder
});


// Schema for updating an event, which requires an ID
const eventUpdateSchema = z.object({
    id: z.string().min(1, 'Event ID is required.'),
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

  const { title, description, date, time, location, teachingText, teachingMediaType } = validatedFields.data;
  
  const isEventDataPresent = title && description && date && time && location;
  const isTeachingDataPresent = teachingText || teachingMediaType;

  if (!isEventDataPresent && !isTeachingDataPresent) {
      return {
          message: 'Please fill out either the event details or the teaching details.',
      };
  }


  try {
    const client = await clientPromise;
    const db = client.db();
    
    let eventCreated = false;
    let teachingCreated = false;

    // Create Event if data is present
    if (isEventDataPresent) {
        const eventsCollection = db.collection('events');
        await eventsCollection.insertOne({
            title,
            description,
            date,
            time,
            location,
            imageUrl: 'https://placehold.co/600x400.png' // Placeholder image
        });
        eventCreated = true;
    }

    // Create Teaching if data is present
    if (isTeachingDataPresent) {
        const teachingsCollection = db.collection('teachings');
        let mediaUrl = 'https://placehold.co/600x400.png';
        if (teachingMediaType === 'video') {
            mediaUrl = 'https://placehold.co/600x400.png/000000/FFFFFF?text=Video';
        } else if (teachingMediaType === 'audio') {
            mediaUrl = 'https://placehold.co/600x400.png/E8E8E8/000000?text=Audio';
        }

        await teachingsCollection.insertOne({
          id: uuidv4(),
          text: teachingText,
          mediaType: teachingMediaType || 'photo',
          mediaUrl,
          createdAt: new Date().toISOString(),
        });
        teachingCreated = true;
    }

    revalidatePath('/pastor/dashboard');
    
    let successMessage = '';
    if (eventCreated && teachingCreated) {
        successMessage = 'Event and Teaching created successfully!';
    } else if (eventCreated) {
        successMessage = 'Event created successfully!';
    } else if (teachingCreated) {
        successMessage = 'Teaching created successfully!';
    }

    return {
      success: true,
      message: successMessage,
    };
  } catch (error) {
    console.error('Create error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function updateEvent(prevState: any, formData: FormData) {
  const validatedFields = eventUpdateSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }
  
  try {
    const { id, teachingUrl, ...eventData } = validatedFields.data;

    if (!ObjectId.isValid(id)) {
      return { message: 'Invalid event ID.' };
    }

    const client = await clientPromise;
    const db = client.db();
    const eventsCollection = db.collection('events');

    await eventsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: eventData }
    );
    
    revalidatePath('/pastor/dashboard');
    return {
      success: true,
      message: 'Event updated successfully!',
    };

  } catch(error) {
    console.error('Update event error:', error);
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

export type Teaching = {
  _id?: ObjectId;
  id: string;
  mediaType: 'photo' | 'video' | 'audio';
  mediaUrl: string;
  text?: string;
  createdAt: string;
};
