
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
import { LoaderCircle, Mail, User as UserIcon, Phone, KeyRound, Camera } from 'lucide-react';
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.imageUrl || null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    if (!fileToUpload) {
        toast({
            variant: 'destructive',
            title: 'No file selected',
            description: 'Please select a new picture to update your profile.',
        });
        return;
    }
    startTransition(async () => {
      // In a real app, this would upload the file and get a URL.
      // Here we simulate it with a new placeholder URL based on the file preview.
      const newImageUrl = previewUrl; // Use the preview URL directly
      const result = await updateUserProfilePicture(user.id, newImageUrl!);

      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        window.location.reload(); // Reload to show changes everywhere
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">Your Profile</DialogTitle>
          <DialogDescription>View your profile information and update your picture.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <Avatar className="h-32 w-32 border-2 border-primary/10">
                    <AvatarImage src={previewUrl || user.imageUrl} alt={user.name} />
                    <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-background"
                    onClick={handleCameraClick}
                >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Change profile picture</span>
                </Button>
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
            <Link href="/forgot-password">
              <KeyRound className="mr-2 h-4 w-4" />
              Reset Password
            </Link>
          </Button>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isPending}>
            Close
          </Button>
          <Button type="button" onClick={handleSaveChanges} disabled={isPending || !fileToUpload}>
            {isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
