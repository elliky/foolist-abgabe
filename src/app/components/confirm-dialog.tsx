'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ReactNode, useState } from 'react';

interface ConfirmDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  children: ReactNode;
  requireConfirmation?: boolean;
}

export default function ConfirmDialog({
  title,
  description,
  onConfirm,
  children,
  requireConfirmation = true,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = () => {
    if (requireConfirmation) {
      setIsOpen(true);
    } else {
      onConfirm();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {/* this div was initially a AlertDialogTrigger (original component build from shadcn) and was changed to be able to controll if a confirmation is needed or not */}
      {/* but this isn't a really nice solution because the div can lead to design issues, that's why we use */}
      <div onClick={handleAction} className='flex w-full'>
        {children}
      </div>
      {/* by using AlertDialogTrigger the dialog would open up after the action (with confirmationNeeded = false) */}
      {/* <AlertDialogTrigger onClick={handleAction} asChild>{children}</AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
