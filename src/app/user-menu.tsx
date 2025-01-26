'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogIn, LogOut, Settings, User } from 'lucide-react';
import { useUserStore } from '@/app/store/userStore';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebaseConfig';

export default function UserMenu() {
  const router = useRouter();

  const { logout, user } = useUserStore();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className=''>
          <User className='h-6 w-6' />
          <span className='sr-only'>Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {user != null ? (
          <>
            <DropdownMenuLabel>
              {user.email || 'Anonymous User'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push('/routes/user/settings')}
            >
              <Settings className='mr-2 h-4 w-4' />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout()}>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => router.push('/routes/auth')}>
            <LogIn className='mr-2 h-4 w-4' />
            <span>Log in</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
