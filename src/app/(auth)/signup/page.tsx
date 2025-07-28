'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you'd handle user creation here
    // For this scaffold, we'll just redirect to the login page
    router.push('/login');
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <Card className="rounded-xl shadow-2xl">
            <CardHeader className="text-center">
              <Link href="/" className="inline-block mx-auto mb-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full w-fit">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5a.5.5 0 0 0-1 0V5h-2a.5.5 0 0 0 0 1h2v2H9a.5.5 0 0 0 0 1h2v2H9a.5.5 0 0 0 0 1h2v2.5a.5.5 0 0 0 1 0V13h2a.5.5 0 0 0 0-1h-2v-2h2a.5.5 0 0 0 0-1h-2V6h2a.5.5 0 0 0 0-1h-2V2.5zM2.75 7.063C2.22 7.563 2 8.24 2 9v1a1 1 0 0 0 1 1h2v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10h2a1 1 0 0 0 1-1V9c0-.76-.22-1.437-.75-1.937L12.5 2.023a.5.5 0 0 0-.5 0l-9.25 5.04zM4.688 7.5H19.31L12 3.844 4.688 7.5z"/></svg>
                </div>
              </Link>
              <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
              <CardDescription>Join our community by creating your account below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+254 712 345678" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
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
              </div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline font-medium text-primary">
                  Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
