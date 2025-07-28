'use client';

import { useState } from 'react';
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
import { initiateStkPush } from '@/actions/mpesa';
import { LoaderCircle } from 'lucide-react';
import type { User } from '@/lib/types';


export function GiveDialog({ title, user, children }: { title: string, user: User, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGive = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to give.',
      });
      return;
    }
    
    if (!user.phone) {
         toast({
            variant: 'destructive',
            title: 'Phone Number Missing',
            description: 'Your phone number is not set in your profile. Please add it to continue.',
        });
        return;
    }
    
    setLoading(true);
    
    const result = await initiateStkPush({amount, phone: user.phone});

    setLoading(false);

    if (result.success) {
        toast({
            title: 'Request Sent!',
            description: `An STK push has been sent to ${user.phone}. Please enter your M-Pesa PIN to complete the transaction.`,
        });
        setAmount('');
        setIsOpen(false);
    } else {
        toast({
            variant: 'destructive',
            title: 'Request Failed',
            description: result.message || 'Could not initiate STK push. Please check the details and try again.',
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{title}</DialogTitle>
          <DialogDescription>
            Your faithful giving supports the work of our church. Your number ({user.phone}) will be used for the M-Pesa transaction.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="amount">
              Amount (Ksh)
            </Label>
            <div className="col-span-3 relative">
                <Input
                    id="amount"
                    type="number"
                    placeholder="Enter the amount you wish to give"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full"
                />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>Cancel</Button>
          <Button type="submit" onClick={handleGive} disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : 'Give Now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
