import { ObjectId } from "mongodb";

export type User = {
  _id?: ObjectId;
  id: string; 
  name: string;
  email: string;
  phone?: string;
  role: 'member' | 'pastor';
  joinedAt: string;
  password?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  imageUrl?: string;
};

export type Event = {
  _id?: ObjectId;
  id: string; // from placeholder
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
  teachingId?: string;
};

export type Contribution = {
    id: string;
    mpesaRef: string;
    userName: string;
    userEmail: string;
    date: string;
};

export type Teaching = {
  _id?: ObjectId;
  id: string;
  mediaType: 'photo' | 'video' | 'audio';
  mediaUrl: string;
  text?: string;
  createdAt: string;
};

// Union type for the combined feed
export type FeedItem = (Event & { type: 'event'; sortDate: Date }) | (Teaching & { type: 'teaching'; sortDate: Date });

export type SavedEventIdea = {
  _id?: ObjectId;
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export type SavedSermonOutline = {
  _id?: ObjectId;
  id: string;
  sermonTitle: string;
  outline: {
    pointTitle: string;
    content: string;
    supportingVerses: string[];
  }[];
  createdAt: string;
}

export type TeamMember = {
  _id?: ObjectId;
  id: string;
  name: string;
  position: string;
  imageUrl: string;
};
