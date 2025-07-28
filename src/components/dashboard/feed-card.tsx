
'use client';

import type { FeedItem, User, Event } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { EventDetailsDialog } from './event-details-dialog';


export function FeedCard({ item, user }: { item: FeedItem; user: User }) {
  const isEvent = item.type === 'event';

  if (!isEvent) return null; // Only render events on the main feed

  const event = item as Event;

  return (
    <EventDetailsDialog event={event} user={user}>
        <Card className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-primary/20 cursor-pointer h-full">
            <CardHeader className="p-6">
                <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(event.date), 'PPP')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow px-6 pb-4">
                <CardDescription>{event.description}</CardDescription>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4 mt-auto">
                 <Button variant="ghost" className="w-full text-primary">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    </EventDetailsDialog>
  );
}
