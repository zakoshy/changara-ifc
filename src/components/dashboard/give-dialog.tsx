
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
import { LoaderCircle, ArrowLeft } from 'lucide-react';
import type { User } from '@/lib/types';
import { cn } from '@/lib/utils';


const MpesaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
    <g>
      <path d="M127.514 255.029C57.088 255.029 0 197.941 0 127.514C0 57.089 57.088 0 127.514 0c70.426 0 127.515 57.089 127.515 127.514c0 70.427-57.089 127.515-127.515 127.515" fill="#59b449"></path>
      <path d="M68.867 172.569h118.295V83.46H68.867v89.109zm43.344-76.43h30.05v-8.73h-30.05v8.73zm-30.732 23.32h92.793v41.97H81.479v-41.97z" fill="#fff"></path>
      <path d="M112.211 83.46v34.45h30.05V83.46h-30.05zM81.479 130.99h30.732v-8.73H81.479v8.73zm63.525 0h30.732v-8.73h-30.732v8.73zm-31.762 28.9h30.05v-25.96h-30.05v25.96z" fill="#fff"></path>
    </g>
  </svg>
);

const PayPalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.068 20.392c.546.12 1.107.158 1.65.158 4.41 0 6.16-2.532 6.518-6.19.043-.44.068-.89.08-1.332l.092-1.077c.108-1.163.535-3.32 2.62-3.32.748 0 1.29.352 1.543 1.252.02.063.036.128.05.195.12.51.15.938.15 1.29 0 .2-.008.397-.02.59-.112 1.393-.578 3.96-2.96 3.96-.334 0-.66-.08-.967-.225-.37-.17-.61-.45-.73-.83-.03-.1-.05-.202-.07-.306-.52-2.148-2.6-2.73-4.41-2.73h-.99c-.382 0-.74.02-1.07.05l-1.076.108c-.48.048-.832.11-1.04.185-.71.26-1.15.73-1.33 1.45-.14.57-.06 1.44.17 2.47.21.94.52 1.83.92 2.65.04.09.09.17.14.25.13.2.28.39.44.56zM8.32 3.608c2.97-1.15 6.27-1.29 8.24-.31.29.14.47.45.33.74-.14.29-.45.47-.74.33-1.63-.82-4.52-.7-7.1.31-.29.11-.6.02-.71-.26-.12-.28-.03-.6.25-.81z" fill="#0070ba"/>
    <path d="M6.333 4.952C8.363 2.14 12.353.97 15.113.88c.32-.01.58.25.59.57.01.32-.25.58-.57.59-2.32.08-5.83 1.08-7.6 3.52-.18.25-.5.32-.75.15-.25-.18-.32-.5-.15-.76z" fill="#0070ba"/>
  </svg>
);

const MastercardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M35.13 13.49H2.87a2.88 2.88 0 0 0-2.87 2.88v4.75a2.88 2.88 0 0 0 2.87 2.88h32.26a2.88 2.88 0 0 0 2.87-2.88v-4.75a2.88 2.88 0 0 0-2.87-2.88z" fill="#ff5f00"/>
    <path d="M11.53 0A12 12 0 0 0 0 9.77v4.46a12 12 0 0 0 23.05 0V9.77A12 12 0 0 0 11.53 0z" fill="#eb001b"/>
    <path d="M38 9.77A12 12 0 0 0 26.47 0a12 12 0 0 0-3.42 24 12 12 0 0 0 15-9.77V9.77z" fill="#f79e1b"/>
  </svg>
);

type PaymentMethod = 'mpesa' | 'paypal' | 'mastercard' | null;

export function GiveDialog({ title, user, children }: { title: string, user: User, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const { toast } = useToast();

  const handleMpesaGive = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid amount to give.' });
      return;
    }
    if (!user.phone) {
      toast({ variant: 'destructive', title: 'Phone Number Missing', description: 'Your phone number is not set in your profile. Please add it to continue.' });
      return;
    }
    
    setLoading(true);
    const result = await initiateStkPush({amount, phone: user.phone});
    setLoading(false);

    if (result.success) {
      toast({ title: 'Request Sent!', description: `An STK push has been sent to ${user.phone}. Please enter your M-Pesa PIN to complete the transaction.` });
      resetDialog();
    } else {
      toast({ variant: 'destructive', title: 'Request Failed', description: result.message || 'Could not initiate STK push. Please check the details and try again.' });
    }
  };

  const handleGenericPayment = async (methodName: string) => {
     if (!amount || parseFloat(amount) <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid amount to give.' });
      return;
    }
    setLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    toast({ title: 'Payment Successful!', description: `Your contribution of Ksh ${amount} via ${methodName} was successful.` });
    resetDialog();
  }

  const resetDialog = () => {
    setAmount('');
    setSelectedMethod(null);
    setIsOpen(false);
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setAmount('');
        setSelectedMethod(null);
      }, 200); 
    }
    setIsOpen(open);
  }

  const renderContent = () => {
    const commonAmountInput = (
      <div className="grid grid-cols-1 items-center gap-4">
        <Label htmlFor="amount">Amount (Ksh)</Label>
        <Input id="amount" type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full" />
      </div>
    );

    if (selectedMethod === 'mpesa') {
      return (
        <>
          <DialogDescription>
            Your faithful giving supports the work of our church. Your number ({user.phone}) will be used for the M-Pesa transaction.
          </DialogDescription>
          <div className="grid gap-4 py-4">
            {commonAmountInput}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setSelectedMethod(null)} disabled={loading}><ArrowLeft className="mr-2 h-4 w-4"/>Back</Button>
            <Button type="submit" onClick={handleMpesaGive} disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : 'Give Now'}
            </Button>
          </DialogFooter>
        </>
      );
    }

    if (selectedMethod === 'paypal') {
        return (
            <>
                <DialogDescription>Enter your PayPal email address to proceed with the payment.</DialogDescription>
                <div className="grid gap-4 py-4">
                    {commonAmountInput}
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="paypal-email">PayPal Email</Label>
                        <Input id="paypal-email" type="email" placeholder="email@example.com" defaultValue={user.email} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setSelectedMethod(null)} disabled={loading}><ArrowLeft className="mr-2 h-4 w-4"/>Back</Button>
                    <Button type="submit" onClick={() => handleGenericPayment('PayPal')} disabled={loading}>
                        {loading ? <LoaderCircle className="animate-spin" /> : `Pay Ksh ${amount || '0'}`}
                    </Button>
                </DialogFooter>
            </>
        )
    }
    
    if (selectedMethod === 'mastercard') {
        return (
            <>
                <DialogDescription>Enter your card details to complete the payment securely.</DialogDescription>
                <div className="grid gap-4 py-4">
                    {commonAmountInput}
                     <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiry-date">Expiry Date</Label>
                            <Input id="expiry-date" placeholder="MM / YY" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setSelectedMethod(null)} disabled={loading}><ArrowLeft className="mr-2 h-4 w-4"/>Back</Button>
                     <Button type="submit" onClick={() => handleGenericPayment('Card')} disabled={loading}>
                        {loading ? <LoaderCircle className="animate-spin" /> : `Pay Ksh ${amount || '0'}`}
                    </Button>
                </DialogFooter>
            </>
        )
    }

    // Default view: payment method selection
    return (
      <>
        <DialogDescription>
          Choose your preferred method to give. Your faithful support helps us continue our work.
        </DialogDescription>
        <div className="grid gap-4 py-4">
            <Button variant="outline" className="justify-start h-12 text-base gap-4" onClick={() => setSelectedMethod('mpesa')}>
                <MpesaIcon />
                <span>Pay with M-Pesa</span>
            </Button>
            <Button variant="outline" className="justify-start h-12 text-base gap-4" onClick={() => setSelectedMethod('paypal')}>
                <PayPalIcon />
                <span>Pay with PayPal</span>
            </Button>
            <Button variant="outline" className="justify-start h-12 text-base gap-4" onClick={() => setSelectedMethod('mastercard')}>
                <MastercardIcon />
                <span>Pay with Card</span>
            </Button>
        </div>
        <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{title}</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
