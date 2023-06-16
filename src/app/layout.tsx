import './globals.css';
import { Inter } from 'next/font/google';

import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GitHub User Cards',
  description: 'Website description.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>{children}</div>
        <ToastContainer />
      </body>
    </html>
  );
}
