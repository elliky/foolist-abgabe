'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { signInAnonymouslyWithFirebase } from '@/lib/firebaseConfig';
import { useUserStore } from '@/app/store/userStore';
import { EmailPasswordForm } from './email-password-form';
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, setUser, fetchSettings } = useUserStore();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleAnonymousLogin = async () => {
    setLoading(true);
    try {
      const result = await signInAnonymouslyWithFirebase();
      setUser(result.user);
      fetchSettings();
      router.push('/');
    } catch (error) {
      console.error('Error signing in anonymously:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className='w-[350px] mx-auto'>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            {user
              ? 'You are logged in.'
              : 'Please log in or continue anonymously.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!user && !showLoginForm && (
            <div className='space-y-4'>
              <Button onClick={() => setShowLoginForm(true)} className='w-full'>
                <LogIn />
                Log In / Sign Up
              </Button>
              <Button
                onClick={handleAnonymousLogin}
                disabled={loading}
                variant='outline'
                className='w-full'
              >
                {!loading && <LogIn />}
                {loading ? 'Loading...' : 'Use Anonymously'}
              </Button>
            </div>
          )}
          {!user && showLoginForm && (
            <EmailPasswordForm
              onClose={() => {
                setShowLoginForm(false);
                router.push('/');
              }}
            />
          )}
          {user && (
            <div className='text-center'>
              <p>
                Welcome, {user.isAnonymous ? 'Anonymous User' : user.email}!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
