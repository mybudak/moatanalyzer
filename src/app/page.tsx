'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import SignInForm from '@/components/auth/sign-in-form';
import { getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      router.push('/analyzer');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        await getRedirectResult(auth);
      } catch (error: any) {
        console.error('Error during sign-in redirect:', error);
        toast({
          title: 'Sign-in failed',
          description: error.message || 'Could not sign you in with Google. Please try again.',
          variant: 'destructive',
        });
      }
    };

    if (!loading && !user) {
      checkRedirectResult();
    }
  }, [loading, user, router, toast]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <SignInForm />;
}
