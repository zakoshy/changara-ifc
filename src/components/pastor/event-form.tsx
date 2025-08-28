
'use client';

import { useActionState, useEffect, useState, useRef, ChangeEvent } from 'react';
import { useFormStatus } from 'react-dom';
import { createEvent, updateEvent } from '@/actions/events';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoaderCircle, Plus, FileImage, Video, Mic, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { Event, Teaching } from '@/lib/types';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';
import { DatePicker } from '../ui/date-picker';


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
    event,
    teaching,
    isTeachingOnly = false,
}: { 
    selectedDate?: Date; 
    onFinished: () => void;
    event?: Event | null;
    teaching?: Teaching | null;
    isTeachingOnly?: boolean;
}) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEditing = !!event;
  const action = isEditing ? updateEvent : createEvent;
  const [state, formAction] = useActionState(action, initialState);

  const [teachingMediaType, setTeachingMediaType] = useState<'photo' | 'video' | 'audio'>('photo');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [teachingDate, setTeachingDate] = useState<Date | undefined>(
    isTeachingOnly ? new Date() : undefined
  );
  
  // When the component loads in edit mode, set the media preview from the teaching prop
  useEffect(() => {
    if (teaching?.mediaUrl) {
      setMediaPreview(teaching.mediaUrl);
      setTeachingMediaType(teaching.mediaType);
    }
    if (isTeachingOnly && teaching?.createdAt) {
        setTeachingDate(new Date(teaching.createdAt));
    }
  }, [teaching, isTeachingOnly]);


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
    if (!isEditing) {
        fileInputRef.current?.click();
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <form action={formAction} className="space-y-6">
      {state.message && !state.success && (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {/* --- EVENT FORM --- */}
      {!isTeachingOnly && (
        <div className="space-y-4 p-4 border rounded-lg">
          <CardHeader className="p-0">
            <CardTitle className="text-lg">Create an Event</CardTitle>
            <CardDescription>This section is optional. Fill it out to schedule a new event.</CardDescription>
          </CardHeader>
          
          <input type="hidden" name="date" value={dateValue} />
          {isEditing && event && <input type="hidden" name="id" value={event.id} />}
          {isEditing && teaching && <input type="hidden" name="teachingId" value={teaching.id} />}

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
      )}
      
      {/* --- TEACHING FORM --- */}
       <div className="space-y-4 p-4 border rounded-lg">
          <CardHeader className="p-0">
            <CardTitle className="text-lg">Create or Edit a Teaching</CardTitle>
            <CardDescription>This can be linked to the event or stand alone. In edit mode, only text can be changed.</CardDescription>
          </CardHeader>
          
          <input type="hidden" name="teachingMediaType" value={teachingMediaType} />
          {mediaPreview && <input type="hidden" name="teachingMediaUrl" value={mediaPreview} />}
          {teachingDate && <input type="hidden" name="teachingDate" value={teachingDate.toISOString()} />}


          <Input 
            id="teachingMediaFileInput" 
            name="teachingMediaFileInput" 
            type="file" 
            ref={fileInputRef} 
            className="hidden"
            onChange={handleFileChange} 
            accept="image/*,video/*,audio/*"
            disabled={isEditing}
          />

          {isTeachingOnly && (
             <div className="space-y-2">
              <Label htmlFor="teaching-date">Teaching Date</Label>
              <DatePicker date={teachingDate} setDate={setTeachingDate} />
            </div>
          )}

          {mediaPreview && (
             <div className="mt-4 p-2 border rounded-md">
                <p className="text-sm font-medium mb-2">Media Preview:</p>
                <div className="flex justify-center items-center bg-muted rounded-md">
                {teachingMediaType === 'photo' && (
                    <Image src={mediaPreview} alt="Preview" width={400} height={300} className="rounded-md object-contain max-h-60" />
                )}
                {teachingMediaType === 'video' && (
                    <video src={mediaPreview} controls className="w-full rounded-md max-h-60">Your browser does not support the video tag.</video>
                )}
                {teachingMediaType === 'audio' && (
                    <audio src={mediaPreview} controls className="w-full">Your browser does not support the audio element.</audio>
                )}
                </div>
            </div>
          )}


          <div className="space-y-2">
            <Label htmlFor="teachingText">Teaching Notes</Label>
            <div className="relative">
                <Textarea id="teachingText" name="teachingText" placeholder="Type your sermon notes or teaching points here..." rows={5} className="pl-12" defaultValue={teaching?.text} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute bottom-2 left-2 h-8 w-8" disabled={isEditing}>
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
            <p className="text-xs text-muted-foreground">
                {isEditing ? "Media cannot be changed in edit mode." : "Click the plus icon to attach media."}
            </p>
          </div>
       </div>


      <div className="flex justify-end gap-2 pt-4">
         <Button type="button" variant="ghost" onClick={onFinished}>Cancel</Button>
         <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  );
}
