import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createUserWithEmailAndPasswordWithFirebase,
  signInWithEmailAndPasswordWithFirebase,
} from '@/lib/firebaseConfig';
import { useUserStore } from '@/app/store/userStore';

export function EmailPasswordForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const { setUser, fetchSettings } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPasswordWithFirebase(
          email,
          password,
        );
      } else {
        userCredential = await signInWithEmailAndPasswordWithFirebase(
          email,
          password,
        );
      }
      setUser(userCredential.user);
      fetchSettings();
      onClose();
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className='text-red-500'>{error}</p>}
      <Button type='submit' className='w-full'>
        {isSignUp ? 'Sign Up' : 'Log In'}
      </Button>
      <Button
        type='button'
        variant='link'
        onClick={() => setIsSignUp(!isSignUp)}
        className='w-full'
      >
        {isSignUp
          ? 'Already have an account? Log In'
          : 'Need an account? Sign Up'}
      </Button>
    </form>
  );
}
