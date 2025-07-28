'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/types';
import { updateUserProfilePicture } from '@/actions/users';
import { LoaderCircle, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function ProfileDialog({ user, children }: { user: User; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSave = () => {
    startTransition(async () => {
      // In a real app, you would upload the file to a storage service
      // and get back a URL. For this demo, we'll just use a new placeholder.
      const newImageUrl = `https://placehold.co/128x128.png?text=${user.name.charAt(0)}&r=${Math.random()}`;

      const result = await updateUserProfilePicture(user.id, newImageUrl);

      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        setIsOpen(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Your Profile</DialogTitle>
          <DialogDescription>
            Update your profile picture here. Changes will be visible across the app.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                    <AvatarImage src={user.imageUrl} alt={user.name} />
                    <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
          <div className="space-y-2">
            <Label htmlFor="picture">Update Profile Picture</Label>
            <div className="flex items-center gap-2">
                 <Input id="picture" type="file" className="text-sm" />
            </div>
             <p className="text-xs text-muted-foreground">
                Note: File upload is a demo. Clicking save will assign a new random avatar.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="button" onClick={handleSave} disabled={isPending}>
            {isPending ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Upload className="mr-2 h-4 w-4" />
            )}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
