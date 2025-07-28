'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { requestPasswordReset } from '@/actions/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? 'Sending Link...' : 'Send Reset Link'}
    </Button>
  );
}


export default function PastorForgotPasswordPage() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(requestPasswordReset, initialState);

  useEffect(() => {
    if (state.success && state.message) {
      toast({
        title: 'Check Your Email',
        description: state.message,
      });
    }
  }, [state.success, state.message, toast]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <form action={formAction}>
          <Card className="rounded-xl shadow-2xl">
            <CardHeader className="text-center">
               <Link href="/" className="inline-block mx-auto mb-4">
                <span className="font-headline text-2xl font-bold">IFC Changara</span>
              </Link>
              <CardTitle className="text-2xl font-headline">Forgot Password?</CardTitle>
              <CardDescription>
                No worries, we&apos;ll send you reset instructions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {state.message && !state.success && (
                 <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}
               {state.success && state.message && (
                 <Alert>
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="pastor@example.com"
                  required
                />
                {state.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
              </div>
              <SubmitButton />
              <div className="mt-4 text-center">
                 <Button variant="ghost" asChild>
                  <Link href="/pastor/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Pastor Login
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
