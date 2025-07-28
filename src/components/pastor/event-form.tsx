
'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { createEvent, updateEvent } from '@/actions/events';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoaderCircle, Plus, FileImage, Video, Mic } from 'lucide-react';
import { format } from 'date-fns';
import type { Event } from '@/lib/types';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const initialState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
      {isEditing ? 'Save Changes' : 'Create'}
    </Button>
  );
}

export function EventForm({ 
    selectedDate, 
    onFinished,
    event 
}: { 
    selectedDate?: Date; 
    onFinished: () => void;
    event?: Event | null;
}) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEditing = !!event;
  // Use updateEvent if editing, otherwise use the combined createEvent
  const action = isEditing ? updateEvent : createEvent;
  const [state, formAction] = useActionState(action, initialState);

  const [teachingMediaType, setTeachingMediaType] = useState<'photo' | 'video' | 'audio'>('photo');

  useEffect(() => {
    if (state.success) {
      toast({
        title: state.message || (isEditing ? 'Event Updated!' : 'Content Created!'),
      });
      onFinished();
    }
  }, [state, toast, onFinished, isEditing]);

  const dateValue = event?.date || (selectedDate ? format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : '');
  
  const handleMediaSelect = (type: 'photo' | 'video' | 'audio') => {
    setTeachingMediaType(type);
    fileInputRef.current?.click();
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.message && !state.success && (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {/* --- EVENT FORM --- */}
      <div className="space-y-4 p-4 border rounded-lg">
        <CardHeader className="p-0">
          <CardTitle className="text-lg">Create an Event</CardTitle>
          <CardDescription>This section is optional. Fill it out to schedule a new event.</CardDescription>
        </CardHeader>
        
        <input type="hidden" name="date" value={dateValue} />
        {isEditing && <input type="hidden" name="id" value={event.id} />}
        
        <div className="space-y-2">
          <Label htmlFor="title">Event Title</Label>
          <Input id="title" name="title" placeholder="e.g., Sunday Service" defaultValue={event?.title}/>
          {state.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" placeholder="Briefly describe the event..." defaultValue={event?.description}/>
          {state.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" name="time" type="time" defaultValue={event?.time} />
                  {state.errors?.time && <p className="text-sm font-medium text-destructive">{state.errors.time[0]}</p>}
              </div>
              <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="e.g., Main Sanctuary" defaultValue={event?.location}/>
                  {state.errors?.location && <p className="text-sm font-medium text-destructive">{state.errors.location[0]}</p>}
              </div>
        </div>
      </div>
      
      {/* --- TEACHING FORM --- */}
       <div className="space-y-4 p-4 border rounded-lg">
          <CardHeader className="p-0">
            <CardTitle className="text-lg">Create a Teaching</CardTitle>
            <CardDescription>This section is optional. Use it to post standalone teachings.</CardDescription>
          </CardHeader>
          <input type="hidden" name="teachingMediaType" value={teachingMediaType} />
          <Input id="teachingMediaUrl" name="teachingMediaUrl" type="file" ref={fileInputRef} className="hidden"/>

          <div className="space-y-2">
            <Label htmlFor="teachingText">Teaching Notes</Label>
            <div className="relative">
                <Textarea id="teachingText" name="teachingText" placeholder="Type your sermon notes or teaching points here..." rows={5} className="pl-12"/>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute bottom-2 left-2 h-8 w-8">
                            <Plus className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => handleMediaSelect('photo')}>
                            <FileImage className="mr-2 h-4 w-4"/>
                            <span>Photo</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleMediaSelect('video')}>
                             <Video className="mr-2 h-4 w-4"/>
                             <span>Video</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleMediaSelect('audio')}>
                             <Mic className="mr-2 h-4 w-4"/>
                             <span>Audio</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <p className="text-xs text-muted-foreground">Click the plus icon to attach media. This is a placeholder and does not currently upload a file.</p>
          </div>
       </div>


      <div className="flex justify-end gap-2 pt-4">
         <Button type="button" variant="ghost" onClick={onFinished}>Cancel</Button>
         <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  );
}
