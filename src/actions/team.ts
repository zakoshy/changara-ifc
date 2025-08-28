
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/mongodb';
import { TeamMember } from '@/lib/types';
import { ObjectId } from 'mongodb';

const teamMemberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name is required.'),
  position: z.string().min(2, 'Position is required.'),
  imageUrl: z.string().url('A valid image URL is required.'),
});

export async function addOrUpdateTeamMember(prevState: any, formData: FormData) {
  const validatedFields = teamMemberSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors and try again.',
    };
  }

  const { id, ...data } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('teamMembers');

    if (id && ObjectId.isValid(id)) {
      // Update existing member
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
    } else {
      // Add new member
      await collection.insertOne(data);
    }

    revalidatePath('/pastor/dashboard/members');
    revalidatePath('/'); // Revalidate homepage to show new team member
    return { success: true, message: `Team member ${id ? 'updated' : 'added'} successfully!` };

  } catch (error) {
    console.error('Team member save error:', error);
    return { message: 'An unexpected error occurred.' };
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('teamMembers');
    const members = await collection.find({}).toArray();

    return members.map(member => ({
      ...member,
      id: (member._id as ObjectId).toString(),
      _id: undefined,
    })) as TeamMember[];
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return [];
  }
}

export async function deleteTeamMember(id: string) {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, message: 'Invalid team member ID.' };
    }
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('teamMembers');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return { success: false, message: 'Could not find team member to delete.' };
    }

    revalidatePath('/pastor/dashboard/members');
    revalidatePath('/');
    return { success: true, message: 'Team member deleted successfully.' };
  } catch (error) {
    console.error('Delete team member error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
