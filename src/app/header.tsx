import UserMenu from './user-menu';
import ReactiveMenu from './reactive-menu';
import { ThemeToggle } from './theme-toggle';

export default function Header() {
  return (
    <header className='sticky top-0 z-10 bg-green-700 text-white md:rounded-b-lg'>
      <div className='px-4 py-2 flex justify-between items-center'>
        <ReactiveMenu></ReactiveMenu>

        <div className='flex flex-row'>
          <ThemeToggle></ThemeToggle>
          <UserMenu></UserMenu>
        </div>
      </div>
    </header>
  );
}
