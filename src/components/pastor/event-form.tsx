'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createEvent } from '@/actions/events';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoaderCircle } from 'lucide-react';
import { format } from 'date-fns';

const initialState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
      Create Event
    </Button>
  );
}

export function EventForm({ selectedDate, onFinished }: { selectedDate?: Date; onFinished: () => void }) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(createEvent, initialState);

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Event Created!',
        description: state.message,
      });
      onFinished();
    }
  }, [state, toast, onFinished]);

  return (
    <form action={formAction} className="space-y-4">
      {state.message && !state.success && (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      <input type="hidden" name="date" value={selectedDate ? format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : ''} />
      
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input id="title" name="title" placeholder="e.g., Sunday Service" />
        {state.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="Briefly describe the event." />
        {state.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>}
      </div>

       <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" type="time" />
                {state.errors?.time && <p className="text-sm font-medium text-destructive">{state.errors.time[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="e.g., Main Sanctuary" />
                {state.errors?.location && <p className="text-sm font-medium text-destructive">{state.errors.location[0]}</p>}
            </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="teachingUrl">Teaching Materials (Optional)</Label>
        <Input id="teachingUrl" name="teachingUrl" type="file" />
        <p className="text-xs text-muted-foreground">Upload a PDF or document file. This is a placeholder and does not currently upload a file.</p>
        {state.errors?.teachingUrl && <p className="text-sm font-medium text-destructive">{state.errors.teachingUrl[0]}</p>}
      </div>

      <div className="flex justify-end gap-2">
         <Button type="button" variant="ghost" onClick={onFinished}>Cancel</Button>
         <SubmitButton />
      </div>
    </form>
  );
}
