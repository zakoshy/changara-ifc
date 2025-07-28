'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellCheck, BellRing } from 'lucide-react';

export function ReminderPopover({ eventTitle }: { eventTitle: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const [reminderTime, setReminderTime] = useState('10:00');
  const { toast } = useToast();

  const handleSetReminder = () => {
    toast({
      title: 'Reminder Set!',
      description: `We'll remind you about "${eventTitle}" at ${reminderTime}.`,
    });
    setReminderSet(true);
    setIsOpen(false);
  };

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    if (checked) {
      setIsOpen(true);
    } else {
      setReminderSet(false);
      toast({
        title: 'Reminder Canceled',
        description: `Your reminder for "${eventTitle}" has been canceled.`,
      });
    }
  };

  if (reminderSet) {
    return (
      <div className="flex w-full items-center space-x-2">
        <Checkbox
          id={`reminder-set-${eventTitle}`}
          checked={true}
          onCheckedChange={handleCheckboxChange}
        />
        <Label
          htmlFor={`reminder-set-${eventTitle}`}
          className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          <div className="flex items-center gap-2 text-primary">
            <BellCheck className="h-4 w-4" />
            <span>Reminder set for {reminderTime}</span>
          </div>
        </Label>
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          <Bell className="mr-2 h-4 w-4" />
          Set Reminder
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Set a Reminder</h4>
            <p className="text-sm text-muted-foreground">Select a time to be notified for this event.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="col-span-2 h-8"
              />
            </div>
          </div>
          <Button onClick={handleSetReminder}>
            <BellRing className="mr-2 h-4 w-4" />
            Set Reminder
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
