'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { login } from '@/actions/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? 'Logging In...' : 'Login'}
    </Button>
  );
}

export default function PastorLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction] = useFormState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state.success && state.role === 'pastor') {
      toast({
        title: 'Login Successful',
        description: 'Welcome back, Pastor!',
      });
      router.push('/pastor/dashboard');
    }
  }, [state.success, state.role, router, toast]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <form action={formAction}>
           <input type="hidden" name="role" value="pastor" />
          <Card className="rounded-xl shadow-2xl">
            <CardHeader className="text-center">
              <Link href="/" className="inline-block mx-auto mb-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full w-fit">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5a.5.5 0 0 0-1 0V5h-2a.5.5 0 0 0 0 1h2v2H9a.5.5 0 0 0 0 1h2v2H9a.5.5 0 0 0 0 1h2v2.5a.5.5 0 0 0 1 0V13h2a.5.5 0 0 0 0-1h-2v-2h2a.5.5 0 0 0 0-1h-2V6h2a.5.5 0 0 0 0-1h-2V2.5zM2.75 7.063C2.22 7.563 2 8.24 2 9v1a1 1 0 0 0 1 1h2v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10h2a1 1 0 0 0 1-1V9c0-.76-.22-1.437-.75-1.937L12.5 2.023a.5.5 0 0 0-.5 0l-9.25 5.04zM4.688 7.5H19.31L12 3.844 4.688 7.5z"/></svg>
                </div>
              </Link>
              <CardTitle className="text-2xl font-headline">Pastor Login</CardTitle>
              <CardDescription>Enter your credentials to access the pastor dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {state.message && !state.success && (
                <Alert variant="destructive">
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or Name</Label>
                <Input id="identifier" name="identifier" type="text" placeholder="your name or pastor@example.com" required />
                {state.errors?.identifier && <p className="text-sm font-medium text-destructive">{state.errors.identifier[0]}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/pastor/forgot-password" passHref>
                    <Button variant="link" className="px-0 text-sm h-auto">Forgot password?</Button>
                  </Link>
                </div>
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
      </div>
    </div>
  );
}
