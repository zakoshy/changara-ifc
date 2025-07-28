'use client';

import React, { useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { LoaderCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Teaching } from '@/lib/types';
import { format } from 'date-fns';

function DeleteTeachingButton({ teachingId, deleteTeachingAction }: { teachingId: string, deleteTeachingAction: (id: string) => Promise<any> }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTeachingAction(teachingId);
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


export function TeachingsDisplay({ teachings, deleteTeachingAction }: { teachings: Teaching[], deleteTeachingAction: (id: string) => Promise<any> }) {
  
  if (teachings.length === 0) {
      return null; // Don't render anything if there are no teachings
  }
    
  return (
    <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">Recent Teachings</h2>
        <p className="text-muted-foreground mb-4">View and manage standalone church teachings.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                     <DeleteTeachingButton teachingId={teaching.id} deleteTeachingAction={deleteTeachingAction}/>
                </Card>
            ))}
        </div>
    </div>
  );
}
