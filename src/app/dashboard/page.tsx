
'use client';

import { useState, useEffect } from 'react';
import { getEvents } from '@/actions/events';
import { FeedCard } from '@/components/dashboard/feed-card';
import { User, Event, FeedItem } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage({ user }: { user: User }) {
  const [upcomingEvents, setUpcomingEvents] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadEvents() {
        setLoading(true);
        const allEvents = await getEvents();
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to the beginning of the day

        const filteredEvents = allEvents
            .filter((event) => {
            try {
                const eventDate = new Date(event.date);
                return eventDate >= today;
            } catch (e) {
                return false;
            }
            })
            .map((item) => ({ ...item, type: 'event', sortDate: new Date(item.date) }))
            .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime()) as FeedItem[];
        
        setUpcomingEvents(filteredEvents);
        setLoading(false);
    }

    if (user) {
        loadEvents();
    }
  }, [user])


  return (
    <div className="flex flex-col gap-8 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Welcome, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening at the church.
          </p>
        </div>
      </div>
      
      <Separator />

      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Upcoming Events
        </h2>
        {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
            </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((item) => (
              <FeedCard key={`${item.type}-${item.id}`} item={item} user={user} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg bg-card">
            <h2 className="text-xl font-semibold">No Upcoming Events</h2>
            <p className="text-muted-foreground mt-2">
              There are no upcoming events scheduled. Please check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
