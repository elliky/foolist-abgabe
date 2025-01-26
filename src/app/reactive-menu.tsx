'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/app/store/userStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavigationButton } from './components/navigation-button';

export default function ReactiveMenu() {
  const { user } = useUserStore();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant='ghost' size='icon' className='md:hidden'>
            <Menu />
            <span className='sr-only'>Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left'>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Navigate through the Foo(d)List App
            </SheetDescription>
          </SheetHeader>
          <nav className='mt-6 flex flex-col space-y-2'>
            {/* we need a button to close the menu on click (handleNavigiatgion) but for accessebility we wrap it in a Link element */}
            <NavigationButton
              href='/'
              label='Home'
              onClick={() => handleNavigation('/')}
            />
            {user != null && (
              <>
                <NavigationButton
                  href='/routes/planning'
                  label='Week Planning'
                  onClick={() => handleNavigation('/routes/planning')}
                />
                <NavigationButton
                  href='/routes/recipe'
                  label='Recipes'
                  onClick={() => handleNavigation('/routes/recipe')}
                />
                <NavigationButton
                  href='/routes/shopping-list'
                  label='Shopping List'
                  onClick={() => handleNavigation('/routes/shopping-list')}
                />
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>

      <nav className='hidden md:flex space-x-4'>
        <Link href='/' passHref>
          <Button variant='ghost' asChild>
            <span>Home</span>
          </Button>
        </Link>
        {user != null && (
          <>
            <Link href='/routes/planning' passHref>
              <Button variant='ghost' asChild>
                <span>Week Planning</span>
              </Button>
            </Link>
            <Link href='/routes/recipe' passHref>
              <Button variant='ghost' asChild>
                <span>Recipes</span>
              </Button>
            </Link>
            <Link href='/routes/shopping-list' passHref>
              <Button variant='ghost' asChild>
                <span>Shopping List</span>
              </Button>
            </Link>
          </>
        )}
      </nav>
    </>
  );
}
