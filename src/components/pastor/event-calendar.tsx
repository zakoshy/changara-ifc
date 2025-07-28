
"use client";

import { useState, useEffect } from "react";
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
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";


// This new component defers date formatting to the client side to avoid hydration errors.
function EventDateDisplay({ date, time }: { date: string, time: string }) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        // new Date() can cause mismatches between server and client timezones.
        // Running it in useEffect ensures it only runs on the client after hydration.
        setFormattedDate(format(new Date(date), "PPP"));
    }, [date]);

    if (!formattedDate) {
        // You can return a placeholder/loader here if needed
        return <p className="text-sm text-muted-foreground h-5"></p>;
    }

    return (
        <p className="text-sm text-muted-foreground">{formattedDate} at {time}</p>
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

  const eventDates = events.map(event => new Date(event.date));

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setIsFormOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
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
        <div className="space-y-4">
            {events.length > 0 ? events.map(event => (
                <div key={event.id} className="p-4 rounded-md border bg-card/50">
                    <h3 className="font-semibold">{event.title}</h3>
                    <EventDateDisplay date={event.date} time={event.time} />
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
