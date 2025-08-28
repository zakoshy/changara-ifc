
'use server';

import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import type { SavedEventIdea, SavedSermonOutline } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function saveEventIdea(idea: { title: string; description: string }) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('savedEventIdeas');
        
        await collection.insertOne({ ...idea, createdAt: new Date() });

        revalidatePath('/pastor/dashboard/creations');
        return { success: true, message: 'Event idea saved successfully!' };
    } catch (error) {
        console.error('Error saving event idea:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function saveSermonOutline(sermon: { sermonTitle: string; outline: any[] }) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('savedSermonOutlines');

        await collection.insertOne({ ...sermon, createdAt: new Date() });
        
        revalidatePath('/pastor/dashboard/creations');
        return { success: true, message: 'Sermon outline saved successfully!' };
    } catch (error) {
        console.error('Error saving sermon outline:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function getSavedEventIdeas(): Promise<SavedEventIdea[]> {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('savedEventIdeas');
        const ideas = await collection.find({}).sort({ createdAt: -1 }).toArray();
        
        return ideas.map(idea => ({
            ...idea,
            id: (idea._id as ObjectId).toString(),
            _id: undefined,
        })) as SavedEventIdea[];
    } catch (error) {
        console.error("Failed to fetch saved event ideas:", error);
        return [];
    }
}

export async function getSavedSermonOutlines(): Promise<SavedSermonOutline[]> {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('savedSermonOutlines');
        const sermons = await collection.find({}).sort({ createdAt: -1 }).toArray();

        return sermons.map(sermon => ({
            ...sermon,
            id: (sermon._id as ObjectId).toString(),
            _id: undefined,
        })) as SavedSermonOutline[];
    } catch (error) {
        console.error("Failed to fetch saved sermon outlines:", error);
        return [];
    }
}

export async function deleteSavedEventIdea(id: string) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('savedEventIdeas');

        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return { success: false, message: 'Could not find idea to delete.' };
        }

        revalidatePath('/pastor/dashboard/creations');
        return { success: true, message: 'Saved idea deleted.' };
    } catch (error) {
        console.error('Delete saved idea error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


export async function deleteSavedSermon(id: string) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('savedSermonOutlines');

        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return { success: false, message: 'Could not find sermon to delete.' };
        }

        revalidatePath('/pastor/dashboard/creations');
        return { success: true, message: 'Saved sermon deleted.' };
    } catch (error) {
        console.error('Delete saved sermon error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
