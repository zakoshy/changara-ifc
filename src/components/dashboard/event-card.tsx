'use client';

import type { Event, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, HandHeart } from 'lucide-react';
import { GiveDialog } from './give-dialog';
import { format } from 'date-fns';
import { ReminderPopover } from './reminder-popover';

export function EventCard({ event, user }: { event: Event, user: User }) {
  const eventDate = new Date(event.date);

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
      <CardHeader className="p-6">
        <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{format(eventDate, 'PPP')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow px-6 pb-4">
        <CardDescription>{event.description}</CardDescription>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex gap-2">
        <ReminderPopover eventTitle={event.title} />
        <GiveDialog title={`Contribute to: ${event.title}`} user={user}>
          <Button className="w-full">
            <HandHeart className="mr-2 h-4 w-4" />
            Contribute
          </Button>
        </GiveDialog>
      </CardFooter>
    </Card>
  );
}
