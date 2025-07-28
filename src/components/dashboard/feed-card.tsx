
'use client';

import type { FeedItem, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, HandHeart, Mic, FileText, Video } from 'lucide-react';
import { GiveDialog } from './give-dialog';
import { format } from 'date-fns';
import { ReminderPopover } from './reminder-popover';
import Image from 'next/image';

const renderTeachingIcon = (mediaType: 'photo' | 'video' | 'audio') => {
    switch (mediaType) {
        case 'video': return <Video className="h-4 w-4" />;
        case 'audio': return <Mic className="h-4 w-4" />;
        default: return <FileText className="h-4 w-4" />;
    }
};


export function FeedCard({ item, user }: { item: FeedItem; user: User }) {
  const isEvent = item.type === 'event';

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
      {isEvent ? (
        // Event Card Layout
        <>
          <CardHeader className="p-6">
            <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(item.date), 'PPP')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{item.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{item.location}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow px-6 pb-4">
            <CardDescription>{item.description}</CardDescription>
          </CardContent>
          <CardFooter className="bg-muted/50 p-4 flex gap-2">
            <ReminderPopover eventTitle={item.title} />
            <GiveDialog title={`Contribute to: ${item.title}`} user={user}>
              <Button className="w-full">
                <HandHeart className="mr-2 h-4 w-4" />
                Contribute
              </Button>
            </GiveDialog>
          </CardFooter>
        </>
      ) : (
        // Teaching Card Layout
        <>
           <CardHeader className="p-6">
             <div className="aspect-video bg-muted rounded-md -mt-2 -mx-2 mb-4 flex items-center justify-center">
                {item.mediaType === 'photo' && <Image src={item.mediaUrl} alt={item.text || 'Teaching media'} width={600} height={400} className="rounded-t-md object-cover" />}
                {item.mediaType === 'video' && <video src={item.mediaUrl} controls className="w-full h-full rounded-t-md">Your browser does not support the video tag.</video>}
                {item.mediaType === 'audio' && <div className="p-4 w-full"><audio src={item.mediaUrl} controls className="w-full">Your browser does not support the audio element.</audio></div>}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {renderTeachingIcon(item.mediaType)}
                <span>Posted on {format(new Date(item.createdAt), 'PPP')}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow px-6 pb-4">
            {item.text && <p className="text-sm text-muted-foreground">{item.text}</p>}
          </CardContent>
           <CardFooter className="bg-muted/50 p-4">
                <GiveDialog title="Support our ministry" user={user}>
                    <Button className="w-full">
                        <HandHeart className="mr-2 h-4 w-4" />
                        Give Tithe/Offering
                    </Button>
                </GiveDialog>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
