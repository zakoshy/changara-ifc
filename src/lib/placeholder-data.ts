import type { User, Event } from './types';

export const placeholderUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'member', joinedAt: '2023-01-15' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', role: 'member', joinedAt: '2023-02-20' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'member', joinedAt: '2023-03-10' },
  { id: '4', name: 'Diana Miller', email: 'diana@example.com', role: 'member', joinedAt: '2023-04-05' },
  { id: '5', name: 'Ethan Davis', email: 'ethan@example.com', role: 'member', joinedAt: '2023-05-21' },
  { id: '6', name: 'Fiona Garcia', email: 'fiona@example.com', role: 'member', joinedAt: '2023-06-11' },
  { id: '7', name: 'George Rodriguez', email: 'george@example.com', role: 'member', joinedAt: '2023-07-19' },
  { id: '8', name: 'Hannah Martinez', email: 'hannah@example.com', role: 'member', joinedAt: '2023-08-01' },
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
    date: 'Friday, July 26, 2024',
    time: '7:00 PM',
    location: 'Youth Hall',
    description: 'A fun and engaging night for teenagers! We\'ll have games, worship, a relevant message, and plenty of time to hang out and build friendships.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '3',
    title: 'Community Outreach Day',
    date: 'Saturday, August 3, 2024',
    time: '9:00 AM - 2:00 PM',
    location: 'Local Park',
    description: 'Let\'s be the hands and feet of Jesus in our community. We will be helping with park cleanup and distributing care packages. Sign up to volunteer!',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '4',
    title: 'Women\'s Ministry Breakfast',
    date: 'Saturday, August 10, 2024',
    time: '9:30 AM',
    location: 'Fellowship Hall',
    description: 'A morning of fellowship, encouragement, and delicious food for all the ladies of our church. Come and be blessed!',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '5',
    title: 'Men\'s Prayer Meeting',
    date: 'Every First Saturday',
    time: '7:00 AM',
    location: 'Prayer Room',
    description: 'An early morning gathering for men to seek God\'s face, intercede for our families and church, and build each other up in faith.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '6',
    title: 'Annual Church Picnic',
    date: 'Sunday, September 1, 2024',
    time: '12:30 PM',
    location: 'Riverside Park',
    description: 'Our favorite annual tradition! Join us after the service for food, fun, games, and fellowship at the park. Bring a dish to share!',
    imageUrl: 'https://placehold.co/600x400.png',
  },
];
