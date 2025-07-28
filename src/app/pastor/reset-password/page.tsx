
'use client';

import { useActionState, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { resetPassword } from '@/actions/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSearchParams, useRouter } from 'next/navigation';

const initialState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? 'Resetting Password...' : 'Reset Password'}
    </Button>
  );
}

function PastorResetPasswordFormComponent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [state, formAction] = useActionState(resetPassword, initialState);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state.success && state.message) {
      toast({
        title: 'Success!',
        description: state.message,
      });
      router.push('/pastor/login');
    }
  }, [state.success, state.message, toast, router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!token) {
    return (
        <Card className="rounded-xl shadow-2xl w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The password reset link is missing or invalid. Please request a new one.</p>
            <Button asChild className="mt-4">
              <Link href="/pastor/forgot-password">Request New Link</Link>
            </Button>
          </CardContent>
        </Card>
    );
  }

  return (
      <form action={formAction}>
        <input type="hidden" name="token" value={token} />
        <Card className="rounded-xl shadow-2xl">
          <CardHeader className="text-center">
            <Link href="/" className="inline-block mx-auto mb-4">
                <span className="font-headline text-2xl font-bold">IFC Changara</span>
            </Link>
            <CardTitle className="text-2xl font-headline">Reset Your Password</CardTitle>
            <CardDescription>
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.message && !state.success && (
                <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
                {state.errors?.password && <p className="text-sm font-medium text-destructive">{state.errors.password[0]}</p>}
            </div>
            <SubmitButton />
          </CardContent>
        </Card>
      </form>
  );
}

function LoadingFallback() {
    return (
        <Card className="rounded-xl shadow-2xl w-full max-w-md">
            <CardHeader>
                <CardTitle>Loading...</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Please wait while we load the page.</p>
            </CardContent>
        </Card>
    );
}

export default function PastorResetPasswordPage() {
   return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<LoadingFallback />}>
          <PastorResetPasswordFormComponent />
        </Suspense>
      </div>
    </div>
  );
}
