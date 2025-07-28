'use client';

import { useState, useTransition } from 'react';
import type { Teaching } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, Trash, LoaderCircle, Image, Video, Mic } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { createTeaching } from '@/actions/teachings';
import { deleteTeaching } from '@/actions/teachings';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image';

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
      Upload Teaching
    </Button>
  );
}

function AddTeachingForm({ onFinished }: { onFinished: () => void }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(createTeaching, initialState);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | 'audio'>('photo');

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Success!',
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

      <input type="hidden" name="mediaType" value={mediaType} />

      <div className="space-y-2">
        <Label>Media Type</Label>
        <div className="flex gap-2">
            <Button type="button" variant={mediaType === 'photo' ? 'default' : 'outline'} onClick={() => setMediaType('photo')}>
                <Image className="mr-2 h-4 w-4" /> Photo
            </Button>
            <Button type="button" variant={mediaType === 'video' ? 'default' : 'outline'} onClick={() => setMediaType('video')}>
                <Video className="mr-2 h-4 w-4" /> Video
            </Button>
            <Button type="button" variant={mediaType === 'audio' ? 'default' : 'outline'} onClick={() => setMediaType('audio')}>
                <Mic className="mr-2 h-4 w-4" /> Audio
            </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="media">Media File</Label>
        <Input id="media" name="media" type="file" required accept={mediaType === 'photo' ? 'image/*' : mediaType === 'video' ? 'video/*' : 'audio/*'} />
        <p className="text-xs text-muted-foreground">Upload is simulated. A placeholder will be used.</p>
        {state.errors?.media && <p className="text-sm font-medium text-destructive">{state.errors.media[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Teaching Text (Optional)</Label>
        <Textarea id="text" name="text" placeholder="Add your sermon notes or a description here..." rows={6} />
        {state.errors?.text && <p className="text-sm font-medium text-destructive">{state.errors.text[0]}</p>}
      </div>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onFinished}>Cancel</Button>
        <SubmitButton />
      </DialogFooter>
    </form>
  );
}

function AddTeachingDialog() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Teaching
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload New Teaching</DialogTitle>
          <DialogDescription>
            Select media type, upload a file, and add optional text.
          </DialogDescription>
        </DialogHeader>
        <AddTeachingForm onFinished={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function DeleteTeachingButton({ teachingId }: { teachingId: string }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteTeaching(teachingId);
            if (result.success) {
                toast({ title: "Success", description: result.message });
            } else {
                toast({ variant: "destructive", title: "Error", description: result.message });
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full">
                    <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this teaching.
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

function TeachingCard({ teaching }: { teaching: Teaching }) {
  const renderMedia = () => {
    switch (teaching.mediaType) {
      case 'photo':
        return <NextImage src={teaching.mediaUrl} alt="Teaching content" width={600} height={400} className="w-full h-auto rounded-t-lg object-cover" />;
      case 'video':
        return <div className="bg-slate-800 text-white flex items-center justify-center h-48 rounded-t-lg"><Video className="w-12 h-12" /></div>; // Placeholder
      case 'audio':
        return <div className="bg-slate-800 text-white flex items-center justify-center h-48 rounded-t-lg"><Mic className="w-12 h-12" /></div>; // Placeholder
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        {renderMedia()}
      </CardHeader>
      {teaching.text && (
        <CardContent className="flex-grow p-4">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{teaching.text}</p>
        </CardContent>
      )}
      <CardFooter className="p-2 bg-muted/50">
        <DeleteTeachingButton teachingId={teaching.id} />
      </CardFooter>
    </Card>
  );
}

export function TeachingsManager({ teachings }: { teachings: Teaching[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight font-headline">Teachings Library</h1>
            <p className="text-muted-foreground">Manage and upload teachings for your congregation.</p>
        </div>
        <AddTeachingDialog />
      </div>

      {teachings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teachings.map((teaching) => (
            <TeachingCard key={teaching.id} teaching={teaching} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg bg-card">
          <h2 className="text-xl font-semibold">No Teachings Uploaded</h2>
          <p className="text-muted-foreground mt-2">Click "Add Teaching" to upload your first one.</p>
        </div>
      )}
    </div>
  );
}
