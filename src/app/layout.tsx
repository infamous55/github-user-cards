import './globals.css';

import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';

import Providers from './Providers';

export const metadata = {
  title: 'GitHub User Cards',
  description:
    'Create minimalistic GitHub user cards with repository statistics as images for your readme.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div>{children}</div>
        </Providers>
        <ToastContainer limit={3} />
      </body>
    </html>
  );
}
