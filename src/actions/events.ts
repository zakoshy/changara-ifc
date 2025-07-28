
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/mongodb';
import { Event, Teaching } from '@/lib/types';
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
    
    // Teaching fields for update
    teachingId: z.string().optional(),
    teachingText: z.string().optional(),
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

  const { title, description, date, time, location, teachingText, teachingMediaType, teachingMediaUrl } = validatedFields.data;
  
  const isEventDataPresent = title && description && date && time && location;
  const isTeachingDataPresent = teachingText || teachingMediaUrl;

  if (!isEventDataPresent && !isTeachingDataPresent) {
      return {
          message: 'Please fill out either the event details or the teaching details.',
      };
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    let teachingId: string | undefined = undefined;
    const createPromises = [];

    // If teaching data is present, prepare it for creation.
    if (isTeachingDataPresent) {
        const teachingsCollection = db.collection('teachings');
        
        // Use the uploaded media URL if available, otherwise a placeholder
        let mediaUrl = teachingMediaUrl || 'https://placehold.co/600x400.png';
        if (!teachingMediaUrl) {
            if (teachingMediaType === 'video') {
                mediaUrl = 'https://placehold.co/600x400.png/000000/FFFFFF?text=Video';
            } else if (teachingMediaType === 'audio') {
                mediaUrl = 'https://placehold.co/600x400.png/E8E8E8/000000?text=Audio';
            }
        }

        const newTeachingId = uuidv4();
        teachingId = newTeachingId; // Assign for event linking

        const teachingCreationPromise = teachingsCollection.insertOne({
          id: newTeachingId,
          text: teachingText,
          mediaType: teachingMediaType || 'photo',
          mediaUrl,
          createdAt: new Date().toISOString(),
        });
        createPromises.push(teachingCreationPromise);
    }
    
    // Prepare Event creation if data is present
    if (isEventDataPresent) {
        const eventsCollection = db.collection('events');
        const eventCreationPromise = eventsCollection.insertOne({
            title,
            description,
            date,
            time,
            location,
            imageUrl: 'https://placehold.co/600x400.png', // Placeholder image
            teachingId: teachingId, // Link the teaching if it was created
        });
         createPromises.push(eventCreationPromise);
    }
    
    // Execute all creation promises concurrently
    if(createPromises.length > 0) {
        await Promise.all(createPromises);
    }


    revalidatePath('/pastor/dashboard');
    revalidatePath('/dashboard');
    
    let successMessage = '';
    if (isEventDataPresent && isTeachingDataPresent) {
        successMessage = 'Event and Teaching created successfully!';
    } else if (isEventDataPresent) {
        successMessage = 'Event created successfully!';
    } else if (isTeachingDataPresent) {
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
    const { id, teachingId, teachingText, ...eventData } = validatedFields.data;

    if (!ObjectId.isValid(id)) {
      return { message: 'Invalid event ID.' };
    }

    const client = await clientPromise;
    const db = client.db();
    const eventsCollection = db.collection('events');
    
    const updatePromises = [];

    // Update the event document
    const eventUpdatePromise = eventsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: eventData }
    );
    updatePromises.push(eventUpdatePromise);
    
    // If there's a linked teaching, update it as well.
    if (teachingId && teachingText) {
        const teachingsCollection = db.collection('teachings');
        const teachingUpdatePromise = teachingsCollection.updateOne(
            { id: teachingId },
            { $set: { text: teachingText } }
        );
        updatePromises.push(teachingUpdatePromise);
    }

    await Promise.all(updatePromises);
    
    revalidatePath('/pastor/dashboard');
    revalidatePath('/dashboard');
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
      teachingId: event.teachingId,
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
    revalidatePath('/dashboard');
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

export async function getTeachingById(teachingId: string): Promise<Teaching | null> {
    if (!teachingId) return null;
    try {
        const client = await clientPromise;
        const db = client.db();
        const teachingsCollection = db.collection('teachings');
        const teaching = await teachingsCollection.findOne({ id: teachingId });

        if (!teaching) return null;

        return {
            ...teaching,
            _id: undefined,
            id: teaching.id as string,
        } as Teaching;

    } catch (error) {
        console.error("Failed to fetch teaching by ID:", error);
        return null;
    }
}


export async function deleteTeaching(teachingId: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const teachingsCollection = db.collection('teachings');

    // Also need to remove the teachingId from any event that references it.
    const eventsCollection = db.collection('events');
    await eventsCollection.updateMany({ teachingId: teachingId }, { $unset: { teachingId: "" } });

    const result = await teachingsCollection.deleteOne({ id: teachingId });
    
    if (result.deletedCount === 0) {
      return { success: false, message: 'Could not find teaching to delete.' };
    }

    revalidatePath('/pastor/dashboard');
    revalidatePath('/dashboard');
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

export async function getEventById(eventId: string): Promise<Event | null> {
    if (!ObjectId.isValid(eventId)) return null;
    try {
        const client = await clientPromise;
        const db = client.db();
        const eventsCollection = db.collection('events');
        const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });

        if (!event) return null;

        return {
            ...event,
            _id: undefined,
            id: (event._id as ObjectId).toString(),
            imageUrl: event.imageUrl || 'https://placehold.co/600x400.png',
        } as Event;

    } catch (error) {
        console.error("Failed to fetch event by ID:", error);
        return null;
    }
}
