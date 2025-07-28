import type { User, Event, Contribution } from './types';

export const placeholderUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'member', joinedAt: '2023-01-15', imageUrl: 'https://placehold.co/40x40.png' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', role: 'member', joinedAt: '2023-02-20', imageUrl: 'https://placehold.co/40x40.png' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'member', joinedAt: '2023-03-10', imageUrl: 'https://placehold.co/40x40.png' },
  { id: '4', name: 'Diana Miller', email: 'diana@example.com', role: 'member', joinedAt: '2023-04-05', imageUrl: 'https://placehold.co/40x40.png' },
  { id: '5', name: 'Ethan Davis', email: 'ethan@example.com', role: 'member', joinedAt: '2023-05-21', imageUrl: 'https://placehold.co/40x40.png' },
  { id: '6', name: 'Fiona Garcia', email: 'fiona@example.com', role: 'member', joinedAt: '2023-06-11', imageUrl: 'https://placehold.co/40x40.png' },
  { id: '7', name: 'George Rodriguez', email: 'george@example.com', role: 'member', joinedAt: '2023-07-19', imageUrl: 'https://placehold.co/40x40.png' },
  { id: '8', name: 'Hannah Martinez', email: 'hannah@example.com', role: 'member', joinedAt: '2023-08-01', imageUrl: 'https://placehold.co/40x40.png' },
];

export const placeholderEvents: Event[] = [
  {
    id: '1',
    title: 'Sunday Worship Service',
    date: 'Every Sunday',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for our weekly worship service, a time of praise, prayer, and powerful teaching from the Word of God. All are welcome to experience His presence.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '2',
    title: 'Youth Group Night',
    date: '2024-07-26T10:00:00.000Z',
    time: '7:00 PM',
    location: 'Youth Hall',
    description: 'A fun and engaging night for teenagers! We\'ll have games, worship, a relevant message, and plenty of time to hang out and build friendships.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '3',
    title: 'Community Outreach Day',
    date: '2024-08-03T10:00:00.000Z',
    time: '9:00 AM - 2:00 PM',
    location: 'Local Park',
    description: 'Let\'s be the hands and feet of Jesus in our community. We will be helping with park cleanup and distributing care packages. Sign up to volunteer!',
    imageUrl: 'https://placehold.co/600x400.png',
  },
];

export const placeholderContributions: Contribution[] = [
    { id: '1', mpesaRef: 'SGH45KL8OP', userName: 'Alice Johnson', userEmail: 'alice@example.com', date: '2024-07-21' },
    { id: '2', mpesaRef: 'SGH56MN9PQ', userName: 'Bob Williams', userEmail: 'bob@example.com', date: '2024-07-21' },
    { id: '3', mpesaRef: 'SGI78HJ2RS', userName: 'Charlie Brown', userEmail: 'charlie@example.com', date: '2024-07-20' },
    { id: '4', mpesaRef: 'SGJ90BC3TU', userName: 'Alice Johnson', userEmail: 'alice@example.com', date: '2024-07-14' },
];
