'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='flex flex-col justify-center text-center items-center h-[70vh]'>
      <h1 className='text-6xl font-bold mb-4'>404</h1>
      <h2 className='text-3xl font-semibold mb-4'>Page Not Found</h2>
      <p className='text-xl mb-8'>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <div className='flex flex-col sm:flex-row justify-center gap-4'>
        <Button asChild>
          <Link href='/'>
            <Home />
            Go to Home
          </Link>
        </Button>
        <Button asChild variant='outline' onClick={() => router.back()}>
          <div>
            <ArrowLeft />
            Go Back
          </div>
        </Button>
      </div>
    </div>
  );
}
