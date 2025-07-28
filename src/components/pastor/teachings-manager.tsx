
'use client';

import React, { useState, useTransition } from 'react';
import { useActionState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
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
import { Plus, LoaderCircle, Image as ImageIcon, Video, Mic, Trash2 } from 'lucide-react';
import { createTeaching, deleteTeaching } from '@/actions/teachings';
import { useToast } from '@/hooks/use-toast';
import { Teaching } from '@/lib/types';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';

const initialState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useActionState(createTeaching, initialState);
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <LoaderCircle className="animate-spin" /> : 'Create Teaching'}
    </Button>
  );
}

function DeleteTeachingButton({ teachingId }: { teachingId: string }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTeaching(teachingId);
      if (result.success) {
        toast({ title: "Success", description: result.message });
      } else {
        toast({ variant: 'destructive', title: "Error", description: result.message });
      }
    });
  };

  return (
     <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-80 hover:opacity-100">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete this teaching. This cannot be undone.
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


export function TeachingsManager({ teachings }: { teachings: Teaching[] }) {
  const [state, formAction] = useActionState(createTeaching, initialState);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | 'audio' | null>(null);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    if (state.success) {
      toast({
        title: 'Teaching Created!',
        description: state.message,
      });
      setIsFormDialogOpen(false);
      setTextAreaValue('');
    }
  }, [state, toast]);

  const handleMediaSelect = (type: 'photo' | 'video' | 'audio') => {
    setMediaType(type);
    setIsMediaDialogOpen(false);
    setIsFormDialogOpen(true);
  };
  
  const handleOpenFormDialog = () => {
    // If there is text, open form directly
    if(textAreaValue.trim()) {
        setMediaType('photo'); // Default to photo if no media selected but text exists
        setIsFormDialogOpen(true);
    } else {
        setIsMediaDialogOpen(true);
    }
  }

  return (
    <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">Teachings</h2>
        <p className="text-muted-foreground mb-4">Create, view, and manage standalone church teachings.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="flex flex-col items-center justify-center p-6 border-2 border-dashed bg-muted/50 hover:border-primary transition-colors">
                <form action={formAction} className="w-full">
                    <CardHeader className="p-0">
                        <CardTitle className="text-lg font-semibold">New Teaching</CardTitle>
                        <CardDescription>Add text notes and attach media.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pt-4 flex-grow w-full">
                        <Textarea 
                            name="text" 
                            placeholder="Type your sermon notes or teaching points here..." 
                            className="w-full flex-grow"
                            rows={5}
                            value={textAreaValue}
                            onChange={(e) => setTextAreaValue(e.target.value)}
                        />
                    </CardContent>
                    <CardFooter className="p-0 pt-4">
                        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                             <Button type="button" onClick={handleOpenFormDialog}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Teaching
                             </Button>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Teaching</DialogTitle>
                                    <DialogDescription>
                                        You are creating a new teaching. The selected media type is for simulation purposes.
                                    </DialogDescription>
                                </DialogHeader>
                                 <form action={formAction} className="space-y-4">
                                    <input type="hidden" name="mediaType" value={mediaType || 'photo'} />
                                     <div className="space-y-2">
                                        <label>Teaching Notes</label>
                                        <Textarea name="text" defaultValue={textAreaValue} rows={6} />
                                     </div>
                                     <div className="space-y-2">
                                        <label>Media (placeholder)</label>
                                        <Input type="file" />
                                        <p className="text-xs text-muted-foreground">You selected a {mediaType}. This is a placeholder and does not actually upload a file.</p>
                                     </div>
                                     <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="ghost">Cancel</Button>
                                        </DialogClose>
                                        <SubmitButton />
                                     </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </form>
            </Card>

            {/* Existing Teachings */}
            {teachings.map(teaching => (
                <Card key={teaching.id} className="relative group">
                    <CardContent className="p-4">
                        <div className="aspect-video bg-muted rounded-md mb-4 flex items-center justify-center">
                            <Image src={teaching.mediaUrl} alt={teaching.mediaType} width={600} height={400} className="rounded-md object-cover" />
                        </div>
                        {teaching.text && <p className="text-sm text-muted-foreground mb-2">{teaching.text}</p>}
                        <p className="text-xs text-muted-foreground/80">
                            Posted on {format(new Date(teaching.createdAt), "PPP")}
                        </p>
                    </CardContent>
                     <DeleteTeachingButton teachingId={teaching.id} />
                </Card>
            ))}

        </div>

        <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Media Type</DialogTitle>
                    <DialogDescription>
                        What type of teaching material would you like to add?
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
                    <Button variant="outline" className="h-24 flex-col" onClick={() => handleMediaSelect('photo')}>
                        <ImageIcon className="h-8 w-8 mb-2" />
                        <span>Photo</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col" onClick={() => handleMediaSelect('video')}>
                        <Video className="h-8 w-8 mb-2" />
                        <span>Video</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col" onClick={() => handleMediaSelect('audio')}>
                        <Mic className="h-8 w-8 mb-2" />
                        <span>Audio</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}
