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
import { CreditCard, DollarSign } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

export function GiveDialog({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const handleGive = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to give.',
      });
      return;
    }
    
    toast({
      title: 'Thank You!',
      description: `Your contribution of $${amount} has been received.`,
    });
    setAmount('');
    setIsOpen(false);
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
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup defaultValue="card" className="flex gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 font-normal"><CreditCard className="w-4 h-4"/> Credit/Debit Card</Label>
                </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleGive}>Give Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
