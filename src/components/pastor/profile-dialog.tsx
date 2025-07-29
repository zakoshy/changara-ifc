'use client';

import { useState, useTransition, ChangeEvent, useRef } from 'react';
import Link from 'next/link';
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
import { LoaderCircle, Upload, Mail, User as UserIcon, Phone, KeyRound, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';

function ProfileInfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

export function ProfileDialog({ user, children }: { user: User; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleSave();
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    startTransition(async () => {
      // In a real app, this would upload the file to a storage bucket
      // and get a URL. Here we simulate it with a new placeholder.
      const newImageUrl = `https://placehold.co/128x128.png?text=${user.name.charAt(0)}&r=${Math.random()}`;
      const result = await updateUserProfilePicture(user.id, newImageUrl);

      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        window.location.reload(); // Reload to show the new picture everywhere
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
          <DialogTitle className="font-headline">Pastor Profile</DialogTitle>
          <DialogDescription>View your profile information and update your picture.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-4">
             <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <Avatar className="h-32 w-32 border-2 border-primary/10">
                <AvatarImage src={user.imageUrl} alt={user.name} />
                <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="text-white h-10 w-10" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <div className="space-y-1 text-center">
              <p className="text-xl font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="space-y-4">
            <ProfileInfoRow icon={<UserIcon className="w-5 h-5" />} label="Full Name" value={user.name} />
            <ProfileInfoRow icon={<Mail className="w-5 h-5" />} label="Email Address" value={user.email} />
            <ProfileInfoRow icon={<Phone className="w-5 h-5" />} label="Phone Number" value={user.phone || 'Not provided'} />
          </div>
          <Separator />
          <Button variant="outline" asChild>
            <Link href="/pastor/forgot-password">
              <KeyRound className="mr-2 h-4 w-4" />
              Reset Password
            </Link>
          </Button>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isPending}>
            Close
          </Button>
          <Button type="button" onClick={handleAvatarClick} disabled={isPending}>
            {isPending ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Update Picture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
