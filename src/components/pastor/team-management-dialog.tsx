
'use client';

import { useState, useRef, ChangeEvent, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LoaderCircle, Plus, Trash2, Edit, Camera, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TeamMember } from '@/lib/types';
import { addOrUpdateTeamMember, deleteTeamMember } from '@/actions/team';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';

const initialState = { message: null, errors: {}, success: false };

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
      {isEditing ? 'Save Changes' : 'Add Member'}
    </Button>
  );
}

function TeamMemberForm({ member, onFinished }: { member?: TeamMember | null; onFinished: () => void }) {
  const [state, formAction] = useActionState(addOrUpdateTeamMember, initialState);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(member?.imageUrl || null);
  const isEditing = !!member;

  useEffect(() => {
    if (state.success) {
      toast({ title: 'Success!', description: state.message });
      onFinished();
    }
  }, [state, toast, onFinished]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={formAction} className="space-y-4">
      {state.message && !state.success && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-primary/10">
            <AvatarImage src={previewUrl || undefined} alt={member?.name || 'New Member'} />
            <AvatarFallback className="text-3xl">{member?.name?.charAt(0) || '?'}</AvatarFallback>
          </Avatar>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        {previewUrl && <input type="hidden" name="imageUrl" value={previewUrl} />}
        {state.errors?.imageUrl && <p className="text-sm font-medium text-destructive">{state.errors.imageUrl[0]}</p>}
      </div>
      
      {member?.id && <input type="hidden" name="id" value={member.id} />}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" placeholder="e.g., Jane Doe" defaultValue={member?.name} required />
        {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Input id="position" name="position" placeholder="e.g., Lead Pastor" defaultValue={member?.position} required />
        {state.errors?.position && <p className="text-sm font-medium text-destructive">{state.errors.position[0]}</p>}
      </div>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onFinished}>Cancel</Button>
        <SubmitButton isEditing={isEditing} />
      </DialogFooter>
    </form>
  );
}

export function TeamManagementDialog({ teamMembers, children }: { teamMembers: TeamMember[]; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const { toast } = useToast();

  const handleAddNew = () => {
    setEditingMember(null);
    setIsFormVisible(true);
  };
  
  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsFormVisible(true);
  };
  
  const handleDelete = async (id: string) => {
    const result = await deleteTeamMember(id);
    if(result.success) {
      toast({ title: 'Success', description: result.message });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  }

  const onFormFinished = () => {
    setIsFormVisible(false);
    setEditingMember(null);
  };

  const onDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form view when dialog closes
      setIsFormVisible(false);
      setEditingMember(null);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Church Team</DialogTitle>
          <DialogDescription>Add, edit, or remove members from the team displayed on the homepage.</DialogDescription>
        </DialogHeader>
        
        {isFormVisible ? (
          <TeamMemberForm member={editingMember} onFinished={onFormFinished} />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Add New Member</Button>
            </div>
            <Separator />
            <div className="space-y-4">
              {teamMembers.length > 0 ? (
                teamMembers.map(member => (
                  <Card key={member.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.imageUrl} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.position}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(member)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(member.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No team members added yet.</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
