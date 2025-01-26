'use client';

import { Button } from '@/components/ui/button';
import {
  Calendar,
  Heart,
  ShoppingCart,
  Utensils,
  LogIn,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import FeatureCard from './components/feature-card';
import { useUserStore } from './store/userStore';

export default function Home() {
  const { user } = useUserStore();

  return (
    <>
      <h1 className='text-4xl font-bold mb-8 text-center'>
        FooList - Your Meal Planner
      </h1>

      {user && (
        <h2 className='text-2xl font-semibold mb-6 text-center'>
          {user.email ? `Welcome back, ${user.email}!` : 'Hi Anonymous User!'}
        </h2>
      )}

      {!!user && (
        <div className='grid md:grid-cols-2 gap-6'>
          <FeatureCard
            title='Create and Edit Recipes'
            description='Create and edit your own receipes or browse what other users have saves so far.'
            icon={<Utensils />}
            link='/routes/recipe'
            buttonText='Create and edit recipes'
          />
          <FeatureCard
            title='Bookmark and Favorite'
            description='Bookmark receipes for your next meal plan or favorite your move liked ones.'
            icon={<Heart />}
            link='/routes/recipe'
            buttonText='Choose your favorites'
          />
          <FeatureCard
            title='Plan Your Week'
            description='Schedule your meals for the week, choosing recipes and adjusting servings to fit your needs.'
            icon={<Calendar />}
            link='/routes/planning'
            buttonText='Start planning'
          />
          <FeatureCard
            title='Smart Shopping List'
            description='Generate a categorized shopping list based on your meal plan.'
            icon={<ShoppingCart />}
            link='/routes/shopping-list'
            buttonText='Get your shopping list'
          />
          <FeatureCard
            title='Settings'
            description='Set if you want to manage lunch and or dinner and your default serving size'
            icon={<Settings />}
            link='/routes/user/settings'
            buttonText='Customize settings'
          />
        </div>
      )}
      {!user && (
        <div className='text-center'>
          <p className='mb-8 text-lg'>
            Sign in to create, plan, and organize your meals with ease.
          </p>
          <ul className='list-none mb-8'>
            <li className='mb-4 flex items-center justify-center gap-2'>
              <Utensils />
              <span>
                Create and edit your own recipes and see what other users have
                created
              </span>
            </li>
            <li className='mb-4 flex items-center justify-center gap-2'>
              <Heart />
              <span>
                Bookmark receipes for planning the next week and favorite your
                most liked receipes
              </span>
            </li>
            <li className='mb-4 flex items-center justify-center gap-2'>
              <Calendar />
              <span>Plan your weekly meals for lunch and or dinner.</span>
            </li>
            <li className='mb-4 flex items-center justify-center gap-2'>
              <ShoppingCart />
              <span>Generate your shopping lists for grocery shopping</span>
            </li>
            <li className='mb-4 flex items-center justify-center gap-2'>
              <Settings />
              <span>
                Set if you want to manage lunch and or dinner and your default
                serving size
              </span>
            </li>
          </ul>
          <Button asChild size='lg'>
            <Link href='/routes/auth'>
              <LogIn className='h-5 w-5 mr-2' />
              Sign in to get started
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}
