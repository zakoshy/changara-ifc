
"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { EventForm } from "./event-form";
import type { Event } from "@/lib/types";
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
import { Trash, LoaderCircle } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { deleteEvent } from "@/actions/events";
import { useToast } from "@/hooks/use-toast";


// This new component defers date formatting to the client side to avoid hydration errors.
function EventDateDisplay({ date, time }: { date: string, time: string }) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        // new Date() can cause mismatches between server and client timezones.
        // Running it in useEffect ensures it only runs on the client after hydration.
        try {
            setFormattedDate(format(new Date(date), "PPP"));
        } catch(e) {
            setFormattedDate('Invalid Date');
        }
    }, [date]);

    if (!formattedDate) {
        // You can return a placeholder/loader here if needed
        return <p className="text-sm text-muted-foreground h-5"></p>;
    }

    return (
        <p className="text-sm text-muted-foreground">{formattedDate} at {time}</p>
    );
}

function DeleteEventButton({ eventId, eventTitle }: { eventId: string, eventTitle: string}) {
    const [isPending, startTransition] = React.useTransition();
    const { toast } = useToast();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteEvent(eventId);
            if(result.success) {
                toast({ title: "Success", description: result.message });
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.message });
            }
        });
    };

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
                        This will permanently delete the event: "{eventTitle}". This action cannot be undone.
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


export function EventCalendar({ events }: { events: Event[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the calendar only renders on the client, avoiding hydration errors
    setIsClient(true);
    setSelectedDate(new Date());
  }, []);

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
    setIsFormOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold tracking-tight font-headline">Event Management</h1>
        <p className="text-muted-foreground mb-6">Click a date to create an event. View and manage upcoming events.</p>
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
        <h2 className="font-headline text-lg mb-4">Upcoming Events</h2>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {events.length > 0 ? events.map(event => (
                <div key={event.id} className="p-4 rounded-md border bg-card/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold">{event.title}</h3>
                            <EventDateDisplay date={event.date} time={event.time} />
                        </div>
                        <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                    </div>
                    <p className="text-sm mt-2">{event.description}</p>
                </div>
            )) : <p className="text-sm text-muted-foreground">No upcoming events. Click a date on the calendar to add one.</p>}
        </div>
      </div>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill out the details for your new event on{" "}
              {selectedDate ? format(selectedDate, "PPP") : ""}.
            </DialogDescription>
          </DialogHeader>
          <EventForm
            selectedDate={selectedDate}
            onFinished={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
