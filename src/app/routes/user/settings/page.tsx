'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserStore } from '@/app/store/userStore';
import { Minus, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CheckedState } from '@radix-ui/react-checkbox';

const settingsSchema = z
  .object({
    manageLunch: z.boolean(),
    manageDinner: z.boolean(),
    defaultServings: z.number().min(1, 'Minimum value is 1'),
  })
  .refine((data) => data.manageLunch || data.manageDinner, {
    message: 'Please select at least one meal to manage.',
    path: ['manageLunch'], // Attach error message to manageLunch
  });

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function UserSettingsPage() {
  const { user, properties, isLoading, fetchSettings, updateSettings } =
    useUserStore();
  const { toast } = useToast();

  const [formState, setFormState] = useState<SettingsFormData>({
    manageLunch: properties.manageLunch,
    manageDinner: properties.manageDinner,
    defaultServings: properties.defaultServings,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.uid) {
      fetchSettings();
    }
  }, [user, fetchSettings]);

  useEffect(() => {
    setFormState({
      manageLunch: properties.manageLunch,
      manageDinner: properties.manageDinner,
      defaultServings: properties.defaultServings,
    });
  }, [properties]);

  const handleChange = (
    field: keyof SettingsFormData,
    value: number | CheckedState | undefined,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: '', // Clear the error for the updated field
    }));
  };

  const validateForm = (): boolean => {
    try {
      settingsSchema.parse(formState);
      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        e.errors.forEach((error) => {
          if (error.path.length) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await updateSettings(formState);
        toast({
          title: 'Settings Saved',
          description: 'Your settings have been successfully updated.',
        });
      } catch {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to save settings. Please try again.',
        });
      }
    }
  };

  if (!user) {
    return (
      <div className='mx-auto text-lg text-center'>
        Please log in to view settings.
      </div>
    );
  }

  return (
    <>
      <Card className='w-full max-w-lg mx-auto'>
        <CardHeader className='pb-4'>
          <CardTitle className='text-2xl font-bold'>User Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='text-center py-8'>Loading settings...</div>
          ) : (
            <form onSubmit={onSubmit} className='space-y-8'>
              <div className='space-y-6'>
                {/* Meal Management */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold'>Meal Management</h3>
                  <div className='flex flex-col space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='manageLunch'
                        checked={formState.manageLunch}
                        onCheckedChange={(checked) =>
                          handleChange('manageLunch', checked)
                        }
                      />
                      <Label htmlFor='manageLunch'>Manage Lunch</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='manageDinner'
                        checked={formState.manageDinner}
                        onCheckedChange={(checked) =>
                          handleChange('manageDinner', checked)
                        }
                      />
                      <Label htmlFor='manageDinner'>Manage Dinner</Label>
                    </div>
                  </div>
                  {errors.manageLunch && (
                    <div className='text-red-500 text-sm' role='alert'>
                      {errors.manageLunch}
                    </div>
                  )}
                </div>

                {/* Default Servings */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold'>Default Servings</h3>
                  <div className='flex items-center space-x-2'>
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      onClick={() =>
                        handleChange(
                          'defaultServings',
                          Math.max(1, formState.defaultServings - 1),
                        )
                      }
                      disabled={formState.defaultServings <= 1}
                    >
                      <Minus />
                    </Button>
                    <Input
                      type='number'
                      value={formState.defaultServings}
                      onChange={(e) =>
                        handleChange(
                          'defaultServings',
                          parseInt(e.target.value) || 1,
                        )
                      }
                      className='w-20 text-center'
                      min={1}
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      onClick={() =>
                        handleChange(
                          'defaultServings',
                          formState.defaultServings + 1,
                        )
                      }
                    >
                      <Plus />
                    </Button>
                  </div>
                  {errors.defaultServings && (
                    <div className='text-red-500 text-sm' role='alert'>
                      {errors.defaultServings}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type='submit'
                className='w-full py-2 text-lg font-semibold'
              >
                Save Settings
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </>
  );
}
