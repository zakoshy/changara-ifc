export type User = {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'pastor';
  joinedAt: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
};
