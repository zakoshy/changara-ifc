'use client';

import Image from 'next/image';
import type { Event } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Bell, HandHeart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GiveDialog } from './give-dialog';

export function EventCard({ event }: { event: Event }) {
  const { toast } = useToast();

  const handleSetReminder = () => {
    toast({
      title: 'Reminder Set!',
      description: `We'll remind you about "${event.title}".`,
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="church event"
          />
        </div>
        <div className="p-6">
          <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{event.date}</span>
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
        </div>
      </CardHeader>
      <CardContent className="flex-grow px-6 pb-4">
        <CardDescription>{event.description}</CardDescription>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex gap-2">
        <Button variant="outline" className="w-full" onClick={handleSetReminder}>
          <Bell className="mr-2 h-4 w-4" />
          Set Reminder
        </Button>
        <GiveDialog title={`Contribute to: ${event.title}`}>
          <Button className="w-full">
            <HandHeart className="mr-2 h-4 w-4" />
            Contribute
          </Button>
        </GiveDialog>
      </CardFooter>
    </Card>
  );
}
