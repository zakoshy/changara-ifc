
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Phone } from 'lucide-react';
import type { User } from '@/lib/types';


export function GiveDialog({ title, user, children }: { title: string, user: User, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">{title}</DialogTitle>
          <DialogDescription>
            Your generous giving enables us to continue our work. Thank you for your partnership.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 text-left">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg"><Smartphone/> M-Pesa Paybill</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="font-semibold">Paybill Number: <span className="font-mono text-primary text-base">247247</span></p>
                    <p className="font-semibold">Account Number: <span className="font-mono text-primary text-base">811335</span></p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg"><Phone/> Lipa na M-Pesa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="font-semibold">Send money directly to our treasurer:</p>
                    <p className="font-semibold">Number: <span className="font-mono text-primary text-base">0710660051</span></p>
                </CardContent>
            </Card>
        </div>

        <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
