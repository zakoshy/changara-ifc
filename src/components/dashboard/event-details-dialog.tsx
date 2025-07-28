
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
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ReminderPopover } from './reminder-popover';


const TeachingDisplay = ({ teaching }: { teaching: Teaching }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);
    const { toast } = useToast();

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            // Simulate network delay for fetching
            await new Promise(resolve => setTimeout(resolve, 1500));

            const response = await fetch(teaching.mediaUrl);
            if (!response.ok) throw new Error('Network response was not ok.');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const extension = teaching.mediaUrl.split('.').pop()?.split('?')[0] || 'mp4';
            a.download = `${(teaching.text || "teaching_media").replace(/ /g, '_')}.${extension}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
            toast({
                title: "Download Started",
                description: "Your file is downloading.",
            });
            setIsDownloaded(true);

        } catch (error) {
            console.error('Download failed:', error);
             toast({
                variant: "destructive",
                title: "Download Failed",
                description: "Could not download the file. Please try again.",
            });
            // Fallback for simple cases or CORS issues
            window.open(teaching.mediaUrl, '_blank');
        } finally {
            setIsDownloading(false);
        }
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
            <div className="flex items-center gap-2">
                {renderTeachingIcon(teaching.mediaType)}
                <h3 className="text-lg font-semibold">Sermon & Notes</h3>
            </div>
            
            <div className="relative aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                <div className={cn(
                    "w-full h-full transition-all duration-500",
                    !isDownloaded && "blur-md scale-110"
                )}>
                    {teaching.mediaType === 'photo' && <Image src={teaching.mediaUrl} alt={teaching.text || 'Teaching media'} width={600} height={400} className="object-cover w-full h-full" data-ai-hint="church teaching" />}
                    {teaching.mediaType === 'video' && <video src={teaching.mediaUrl} controls={isDownloaded} className="w-full h-full">Your browser does not support the video tag.</video>}
                    {teaching.mediaType === 'audio' && <div className="p-4 w-full h-full flex items-center justify-center"><audio src={teaching.mediaUrl} controls className="w-full">Your browser does not support the audio element.</audio></div>}
                </div>

                {!isDownloaded && (
                     <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-14 w-14 rounded-full shadow-2xl"
                            onClick={handleDownload}
                            disabled={isDownloading}
                        >
                            {isDownloading ? (
                                <LoaderCircle className="h-6 w-6 animate-spin" />
                            ) : (
                                <Download className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                )}
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

    // Reset teaching state when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setTeaching(null);
        }
    }, [isOpen])

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
                 <DialogFooter className="sm:justify-between gap-2">
                    <ReminderPopover eventTitle={event.title} />
                    <GiveDialog title={`Contribute to: ${event.title}`} user={user}>
                        <Button>Contribute to Event</Button>
                    </GiveDialog>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

