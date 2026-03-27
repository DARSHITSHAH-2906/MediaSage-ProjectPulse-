import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProjectPulse — Project Management',
  description: 'A premium project management system to track projects, tasks, and team productivity.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `.material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; flex-shrink: 0; direction: ltr; -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased; }` }} />
      </head>
      <body>
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#1b1a26',
              color: '#e3e0f1',
              border: '1px solid rgba(70, 69, 84, 0.4)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#8083ff', secondary: '#1b1a26' },
            },
            error: {
              iconTheme: { primary: '#ffb4ab', secondary: '#1b1a26' },
            },
          }} 
        />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
