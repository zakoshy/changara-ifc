'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Church } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you'd handle authentication here
    // For this scaffold, we'll just redirect to the dashboard
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <Card className="rounded-xl shadow-2xl">
            <CardHeader className="text-center">
              <Link href="/" className="inline-block mx-auto mb-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full w-fit">
                  <Church className="h-8 w-8" />
                </div>
              </Link>
              <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
              <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="underline font-medium text-primary">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
