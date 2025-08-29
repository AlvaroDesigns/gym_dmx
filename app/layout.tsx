'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IKContext } from 'imagekitio-react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Geist, Geist_Mono } from 'next/font/google';
import { useState } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const urlEndpoint =
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ??
    process.env.IMAGEKIT_URL_ENDPOINT ??
    '';
  const publicKey =
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ?? process.env.IMAGEKIT_PUBLIC_KEY ?? '';
  const authenticationEndpoint = '/api/imagekit/auth';
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <IKContext
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            transformationPosition="path"
            authenticationEndpoint={authenticationEndpoint}
          >
            <Providers>
              {' '}
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Providers>{children}</Providers>
              </ThemeProvider>
            </Providers>
          </IKContext>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
