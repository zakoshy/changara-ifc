
"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { EventForm } from "./event-form";
import type { Event, Teaching } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash, LoaderCircle, Edit, FileText, Video, Mic, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { deleteEvent, deleteTeaching, getTeachingById } from "@/actions/events";
import { useToast } from "@/hooks/use-toast";


// This new component defers date formatting to the client side to avoid hydration errors.
function ItemDateDisplay({ date, time }: { date: string, time?: string }) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        // new Date() can cause mismatches between server and client timezones.
        // Running it in useEffect ensures it only runs on the client after hydration.
        try {
            const dateObj = new Date(date);
            const dateString = format(dateObj, "PPP");
            setFormattedDate(time ? `${dateString} at ${time}`: `Posted on ${dateString}`);
        } catch(e) {
            setFormattedDate('Invalid Date');
        }
    }, [date, time]);

    if (!formattedDate) {
        // You can return a placeholder/loader here if needed
        return <p className="text-sm text-muted-foreground h-5"></p>;
    }

    return (
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
    );
}

function DeleteItemButton({ item, isEvent }: { item: Event | Teaching, isEvent: boolean }) {
    const [isPending, startTransition] = React.useTransition();
    const { toast } = useToast();

    const handleDelete = () => {
        startTransition(async () => {
            const action = isEvent ? deleteEvent : deleteTeaching;
            const result = await action(item.id);
            if(result.success) {
                toast({ title: "Success", description: result.message });
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.message });
            }
        });
    };
    
    const title = isEvent ? (item as Event).title : (item as Teaching).text?.substring(0, 30) + '...';

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" className="h-7 w-7">
                    <Trash className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete "{title}". This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                        {isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

const renderTeachingIcon = (mediaType: 'photo' | 'video' | 'audio' | undefined) => {
    switch (mediaType) {
        case 'video': return <Video className="h-4 w-4 text-muted-foreground" />;
        case 'audio': return <Mic className="h-4 w-4 text-muted-foreground" />;
        default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
};


export function EventCalendar({ events, teachings }: { events: Event[], teachings: Teaching[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingTeaching, setEditingTeaching] = useState<Teaching | null>(null);


  useEffect(() => {
    // This ensures the calendar only renders on the client, avoiding hydration errors
    setIsClient(true);
    setSelectedDate(new Date());
  }, []);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter(event => new Date(event.date) >= today);
  
  // Filter out teachings that are already linked to an upcoming event
  const eventTeachingIds = new Set(upcomingEvents.map(e => e.teachingId).filter(Boolean));
  const upcomingStandaloneTeachings = teachings
    .filter(teaching => new Date(teaching.createdAt) >= today && !eventTeachingIds.has(teaching.id));


  const combinedItems = [
    ...upcomingEvents.map(item => ({...item, type: 'event', sortDate: new Date(item.date)})),
    ...upcomingStandaloneTeachings.map(item => ({...item, type: 'teaching', sortDate: new Date(item.createdAt)}))
  ].sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());

  const eventDates = events.map(event => {
      try {
          return new Date(event.date);
      } catch(e) {
          return null;
      }
  }).filter(d => d !== null) as Date[];

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setEditingEvent(null);
    setEditingTeaching(null);
    setIsFormOpen(true);
  };
  
  const handleEditClick = async (item: Event | Teaching) => {
    if (item.type === 'event') {
        const event = item as Event;
        setEditingEvent(event);
        setSelectedDate(new Date(event.date));
        if (event.teachingId) {
            const teachingData = await getTeachingById(event.teachingId);
            setEditingTeaching(teachingData);
        } else {
            setEditingTeaching(null);
        }
    } else {
        const teaching = item as Teaching;
        setEditingTeaching(teaching);
        setEditingEvent(null); // No associated event
        setSelectedDate(new Date(teaching.createdAt));
    }
    setIsFormOpen(true);
  }

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
    setEditingTeaching(null);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold tracking-tight font-headline">Event Management</h1>
        <p className="text-muted-foreground mb-6">Click a date to create an event. View and manage upcoming events and teachings.</p>
        <div className="rounded-md border bg-card p-4">
            {isClient ? (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="p-0"
                  modifiers={{
                    events: eventDates,
                  }}
                  modifiersClassNames={{
                    events: "bg-primary/20 rounded-full",
                  }}
                  initialFocus
                />
            ) : (
                <Skeleton className="h-[298px] w-full" />
            )}
        </div>
      </div>
      <div>
        <h2 className="font-headline text-lg mb-4">Upcoming</h2>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {combinedItems.length > 0 ? combinedItems.map(item => (
                <div key={`${item.type}-${item.id}`} className="p-4 rounded-md border bg-card/50">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                {item.type === 'event' ? <CalendarIcon className="h-4 w-4 text-muted-foreground" /> : renderTeachingIcon((item as Teaching).mediaType)}
                            </div>
                            <div>
                                <h3 className="font-semibold">{item.type === 'event' ? (item as Event).title : (item as Teaching).text || 'Media Teaching'}</h3>
                                <ItemDateDisplay date={item.type === 'event' ? (item as Event).date : (item as Teaching).createdAt} time={item.type === 'event' ? (item as Event).time : undefined} />
                            </div>
                        </div>
                         <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleEditClick(item)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <DeleteItemButton item={item} isEvent={item.type === 'event'} />
                        </div>
                    </div>
                    {item.type === 'event' && <p className="text-sm mt-2">{(item as Event).description}</p>}
                </div>
            )) : <p className="text-sm text-muted-foreground">No upcoming items. Click a date on the calendar to add one.</p>}
        </div>
      </div>
      <Dialog open={isFormOpen} onOpenChange={closeForm}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event & Teaching' : 'Create New Event or Teaching'}</DialogTitle>
            <DialogDescription>
             {editingEvent 
                ? "Update the details for your event and the linked teaching."
                : `Fill out the details for your new item on ${selectedDate ? format(selectedDate, "PPP") : ""}. Both sections are optional.`
             }
            </DialogDescription>
          </DialogHeader>
          <EventForm
            selectedDate={selectedDate}
            onFinished={closeForm}
            event={editingEvent}
            teaching={editingTeaching}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
