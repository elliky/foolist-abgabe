import type { Metadata } from 'next';
import './globals.css';
import Header from './header';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'FooList',
  description:
    'An MVP app for managing lunch and dinner plan and to shop ingredients for it once a week.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      {/* w-screen and overflow-x-hidden is against layout shift with scroll-bar (scrollbar-gutter: stable lead to layout shift for popups from shadcn)  */}
      <body className='antialiased flex flex-col min-h-screen w-screen overflow-x-hidden items-center'>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {/* on a very small width on browser it seems uneven with px-4 because the scrollbar uses up padding-right, but on mobile it's correct, that's why we keep it that way */}
          <div className='container mx-auto md:px-8 mb-8'>
            <Header></Header>
            <main className='pt-8 px-4 md:px-0'>{children}</main>
          </div>
          <Toaster />

          {/* used for vercel speed insights */}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
