import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationButtonProps {
  href: string;
  label: string;
  className?: string;
  onClick: () => void;
}

{
  /* we need a button to use on click (to close the mobile menu) but for accessebility we wrap it in a Link element */
}
export function NavigationButton({
  href,
  label,
  className = '',
  onClick,
}: NavigationButtonProps) {
  return (
    <Link href={href} className='w-full' passHref>
      <Button
        variant='ghost'
        className={cn('justify-start w-full', className)}
        onClick={onClick}
      >
        {label}
      </Button>
    </Link>
  );
}
