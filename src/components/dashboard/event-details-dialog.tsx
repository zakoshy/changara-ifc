
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
    const { toast } = useToast();

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch(teaching.mediaUrl);
            if (!response.ok) throw new Error('Network response was not ok.');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            const fileExtension = teaching.mediaUrl.split('.').pop()?.split('?')[0] || 'tmp';
            let fileName = 'teaching_download';
            if (teaching.text) {
                fileName = teaching.text.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            }
            a.download = `${fileName}.${fileExtension}`;
            
            document.body.appendChild(a);
a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
            toast({
                title: "Download Started",
                description: "Your file is downloading.",
            });

        } catch (error) {
            console.error('Download failed:', error);
             toast({
                variant: "destructive",
                title: "Download Failed",
                description: "Could not download the file. Please try again.",
            });
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
            <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    {renderTeachingIcon(teaching.mediaType)}
                    <h3 className="text-lg font-semibold">Sermon & Notes</h3>
                </div>
                 <Button
                    variant="secondary"
                    onClick={handleDownload}
                    disabled={isDownloading}
                >
                    {isDownloading ? (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="mr-2 h-4 w-4" />
                    )}
                    Download
                </Button>
            </div>
            
            <div className="relative aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                <div className="w-full h-full">
                    {teaching.mediaType === 'photo' && <Image src={teaching.mediaUrl} alt={teaching.text || 'Teaching media'} width={600} height={400} className="object-cover w-full h-full" data-ai-hint="church teaching" />}
                    {teaching.mediaType === 'video' && <video src={teaching.mediaUrl} controls className="w-full h-full">Your browser does not support the video tag.</video>}
                    {teaching.mediaType === 'audio' && <div className="p-4 w-full h-full flex items-center justify-center"><audio src={teaching.mediaUrl} controls className="w-full">Your browser does not support the audio element.</audio></div>}
                </div>
            </div>

            {teaching.text && <p className="text-sm text-muted-foreground">{teaching.text}</p>}
        </div>
    );
};


export function EventDetailsDialog({ event, teaching: initialTeaching, user, children }: { event?: Event, teaching?: Teaching, user: User, children: React.ReactNode }) {
    const [teaching, setTeaching] = useState<Teaching | null>(initialTeaching || null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    const displayTeaching = teaching || initialTeaching;
    const displayEvent = event;

    useEffect(() => {
        // Fetch teaching if it's part of an event and not already loaded
        if (isOpen && displayEvent?.teachingId && !displayTeaching) {
            setIsLoading(true);
            getTeachingById(displayEvent.teachingId)
                .then(data => {
                    setTeaching(data);
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, displayEvent, displayTeaching]);

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
                    <DialogTitle className="font-headline text-2xl">{displayEvent?.title || displayTeaching?.text || 'Details'}</DialogTitle>
                    {displayEvent?.description && <DialogDescription>{displayEvent.description}</DialogDescription>}
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {displayEvent && (
                        <>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(displayEvent.date), 'EEEE, MMMM do, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{displayEvent.time}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{displayEvent.location}</span>
                            </div>
                        </>
                    )}


                    {isLoading && (
                        <div className="flex items-center justify-center p-8">
                            <LoaderCircle className="animate-spin text-primary" />
                        </div>
                    )}

                    {displayTeaching && <TeachingDisplay teaching={displayTeaching} />}

                    {!isLoading && !displayTeaching && displayEvent?.teachingId &&(
                         <div className="text-center p-4 text-muted-foreground">
                            <p>Could not load teaching materials.</p>
                        </div>
                    )}
                </div>
                 <DialogFooter className="sm:justify-between gap-2">
                    {displayEvent ? (
                        <>
                            <ReminderPopover eventTitle={displayEvent.title} />
                            <GiveDialog title={`Contribute to: ${displayEvent.title}`} user={user}>
                                <Button>Contribute to Event</Button>
                            </GiveDialog>
                        </>
                    ) : (
                        <Button onClick={() => setIsOpen(false)}>Close</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
