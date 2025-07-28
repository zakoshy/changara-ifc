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


export function GiveDialog({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
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
     if (!phone || phone.length < 10) {
      toast({
        variant: 'destructive',
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number.',
      });
      return;
    }
    
    setLoading(true);
    
    // In a real app, you would call the M-Pesa API here.
    // We are simulating this with a server action.
    const result = await initiateStkPush({amount, phone});

    setLoading(false);

    if (result.success) {
        toast({
            title: 'Request Sent!',
            description: `An STK push has been sent to ${phone}. Please enter your M-Pesa PIN to complete the transaction.`,
        });
        setAmount('');
        setPhone('');
        setIsOpen(false);
    } else {
        toast({
            variant: 'destructive',
            title: 'Request Failed',
            description: result.message || 'Could not initiate STK push. Please try again.',
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
            Your faithful giving supports the work of our church. Thank you for your generosity.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <div className="col-span-3">
                <Input
                    id="phone"
                    type="tel"
                    placeholder="0712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full"
                />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Ksh</span>
                <Input
                    id="amount"
                    type="number"
                    placeholder="1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
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
