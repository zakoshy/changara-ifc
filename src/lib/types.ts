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
  teachingUrl?: string;
};

export type Contribution = {
    id: string;
    mpesaRef: string;
    userName: string;
    userEmail: string;
    date: string;
};
