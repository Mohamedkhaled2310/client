import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Realtime Task Manager',
  description: 'Collaborate with your team in realtime',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-800`}>
        <div className="min-h-screen flex flex-col">
          <header className="h-14 shadow-sm flex items-center px-6 bg-white">
            <h1 className="text-lg font-semibold text-gray-900">
              Realtime Task Manager
            </h1>
          </header>
          <main className="flex-1">{children}</main>
        </div>

        {/* 🔔 Toast notifications */}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
