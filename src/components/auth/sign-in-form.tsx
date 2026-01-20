'use client';

import { auth } from '@/lib/firebase';
import {
  GoogleAuthProvider,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 12.89C34.399 8.872 29.585 6.5 24 6.5C14.336 6.5 6.5 14.336 6.5 24S14.336 41.5 24 41.5c9.113 0 16.5-7.035 16.5-16.119c0-1.054-.108-2.195-.289-3.298z"
    />
    <path
      fill="#FF3D00"
      d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12.5 24 12.5c3.059 0 5.842 1.154 7.961 3.039l5.84-5.84C34.399 8.872 29.585 6.5 24 6.5C18.239 6.5 13.064 9.176 9.123 12.89L6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="m24 41.5c5.359 0 9.894-2.222 13.19-5.807l-5.88-4.558c-1.892 1.411-4.221 2.269-6.86 2.269c-5.223 0-9.651-3.343-11.303-8H6.5v.001c3.065 6.43 9.429 10.999 17.5 10.999z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303a12.031 12.031 0 0 1-1.921 4.793l5.88 4.558A16.505 16.505 0 0 0 42.1 27.917C43.204 25.437 43.611 22.563 43.611 20.083z"
    />
  </svg>
);

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function SignInForm() {
  const { toast } = useToast();
  const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSignUp, setIsSignUp] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleGoogleSignIn = async () => {
    setIsSigningInWithGoogle(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast({
        title: 'Sign-in failed',
        description: error.message || 'Could not sign you in with Google. Please try again.',
        variant: 'destructive',
      });
      setIsSigningInWithGoogle(false);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        if (isSignUp) {
          await createUserWithEmailAndPassword(auth, values.email, values.password);
          toast({
            title: 'Account Created',
            description: "You've successfully signed up.",
          });
        } else {
          await signInWithEmailAndPassword(auth, values.email, values.password);
          toast({
            title: 'Signed In',
            description: 'Welcome back!',
          });
        }
      } catch (error: any) {
        toast({
          title: `Error ${isSignUp ? 'Signing Up' : 'Signing In'}`,
          description: error.message || `Could not ${isSignUp ? 'sign you up' : 'sign you in'}. Please try again.`,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl text-primary">MoatAnalyzer</CardTitle>
          <CardDescription className="pt-2">
            {isSignUp ? 'Create an account to get started.' : 'Sign in to your account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isPending || isSigningInWithGoogle}
              className="w-full bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm"
            >
              {isSigningInWithGoogle ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              {isSigningInWithGoogle ? 'Redirecting...' : 'Sign in with Google'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <Button variant="link" onClick={() => setIsSignUp(!isSignUp)} className="px-1">
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
