
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Download, Mic, FileText, Video, LoaderCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { getTeachingById } from '@/actions/events';
import type { Event, Teaching, User } from '@/lib/types';
import { GiveDialog } from './give-dialog';


async function downloadMedia(mediaUrl: string, title: string) {
    try {
        const response = await fetch(mediaUrl);
        if (!response.ok) throw new Error('Network response was not ok.');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Extract extension and construct filename
        const extension = mediaUrl.split('.').pop()?.split('?')[0] || 'mp4';
        a.download = `${title.replace(/ /g, '_')}.${extension}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
        // Fallback for simple cases or CORS issues
        window.open(mediaUrl, '_blank');
    }
}


const TeachingDisplay = ({ teaching }: { teaching: Teaching }) => {

    const handleDownload = () => {
        downloadMedia(teaching.mediaUrl, teaching.text || "teaching_media");
    }

    const renderTeachingIcon = (mediaType: 'photo' | 'video' | 'audio') => {
        switch (mediaType) {
            case 'video': return <Video className="h-5 w-5" />;
            case 'audio': return <Mic className="h-5 w-5" />;
            default: return <FileText className="h-5 w-5" />;
        }
    };

    return (
        <div className="space-y-4">
             <Separator />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {renderTeachingIcon(teaching.mediaType)}
                    <h3 className="text-lg font-semibold">Sermon & Notes</h3>
                </div>
                 <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </Button>
            </div>
            
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                {teaching.mediaType === 'photo' && <Image src={teaching.mediaUrl} alt={teaching.text || 'Teaching media'} width={600} height={400} className="object-cover" />}
                {teaching.mediaType === 'video' && <video src={teaching.mediaUrl} controls className="w-full h-full">Your browser does not support the video tag.</video>}
                {teaching.mediaType === 'audio' && <div className="p-4 w-full"><audio src={teaching.mediaUrl} controls className="w-full">Your browser does not support the audio element.</audio></div>}
            </div>

            {teaching.text && <p className="text-sm text-muted-foreground">{teaching.text}</p>}
        </div>
    );
};


export function EventDetailsDialog({ event, user, children }: { event: Event, user: User, children: React.ReactNode }) {
    const [teaching, setTeaching] = useState<Teaching | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Only fetch teaching if the dialog is opened and there's a teachingId
        if (isOpen && event.teachingId && !teaching) {
            setIsLoading(true);
            getTeachingById(event.teachingId)
                .then(data => {
                    setTeaching(data);
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, event.teachingId, teaching]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">{event.title}</DialogTitle>
                    <DialogDescription>{event.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.date), 'EEEE, MMMM do, yyyy')}</span>
                    </div>
                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center p-8">
                            <LoaderCircle className="animate-spin text-primary" />
                        </div>
                    )}

                    {teaching && <TeachingDisplay teaching={teaching} />}

                    {!isLoading && !teaching && event.teachingId &&(
                         <div className="text-center p-4 text-muted-foreground">
                            <p>Could not load teaching materials.</p>
                        </div>
                    )}
                </div>
                 <DialogFooter>
                    <GiveDialog title={`Contribute to: ${event.title}`} user={user}>
                        <Button>Contribute to Event</Button>
                    </GiveDialog>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

