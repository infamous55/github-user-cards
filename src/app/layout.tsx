import './globals.css';

import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';

import Providers from './Providers';

export const metadata = {
  title: 'GitHub User Cards',
  description:
    'Create minimalistic images with repository statistics for your profile readme.',
};

import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>
          <div>{children}</div>
        </Providers>
        <ToastContainer limit={3} />
        <Analytics />
      </body>
    </html>
  );
}
