'use client';

import { useState } from 'react';
import { useRecipes } from '@/app/hooks/useRecipes';
import { useUserStore } from '@/app/store/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MealType } from '@/model/models';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface AddMealDialogProps {
  day: string;
  mealType: MealType;
  assignMeal: (
    day: string,
    mealType: MealType,
    recipeId: string,
    recipeName: string,
    servings: number,
  ) => void;
}

export default function AddMealDialog({
  day,
  mealType,
  assignMeal,
}: AddMealDialogProps) {
  const { recipes } = useRecipes();
  const { properties } = useUserStore();
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [servings, setServings] = useState(properties.defaultServings || 1);

  const [isOpen, setIsOpen] = useState(false);
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecipe) {
      const recipe = recipes.find((r) => r.id === selectedRecipe);
      if (recipe) {
        assignMeal(day, mealType, recipe.id!, recipe.name, servings);
        setIsOpen(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='w-full'>
          <Plus /> Add Recipe
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Recipe
          </DialogTitle>
          <DialogDescription>
            Choose a recipe for {mealType} on {day}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <Label htmlFor='receipe'>Receipe</Label>
              {/* Combobox for receipe selection (from shadcn) */}
              <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id='receipe'
                    variant='outline'
                    role='combobox'
                    aria-expanded={isComboboxOpen}
                    className='w-full justify-between'
                  >
                    {selectedRecipe
                      ? recipes.find((recipe) => recipe.id === selectedRecipe)
                          ?.name
                      : 'Select a recipe...'}
                    <ChevronsUpDown className='opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[440px] p-0'>
                  <Command>
                    <CommandInput
                      placeholder='Search recipes...'
                      className='h-9'
                    />
                    <CommandList>
                      <CommandEmpty>No recipes found.</CommandEmpty>
                      <CommandGroup>
                        {recipes.map((recipe) => (
                          <CommandItem
                            key={recipe.id}
                            value={recipe.name}
                            onSelect={() => {
                              setSelectedRecipe(
                                recipe.id === selectedRecipe ? '' : recipe.id!,
                              );
                              setIsComboboxOpen(false);
                            }}
                          >
                            {recipe.name}
                            <Check
                              className={cn(
                                'ml-auto',
                                selectedRecipe === recipe.id
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex items-center space-x-2'>
              <Label htmlFor='servings'>Servings</Label>
              <Input
                id='servings'
                type='number'
                min='1'
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button className='mt-3' type='submit'>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
