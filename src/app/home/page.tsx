'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { env } from '~/env.mjs';
import toast from '~/lib/toast';
import NavBar from '~/app/components/NavBar';

import type { Database } from '~/lib/database.types';

export default function Home() {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleCallToAction = async () => {
    let session;
    try {
      const { data } = await supabase.auth.getSession();
      session = data.session;
    } catch {
      toast.error('Could not login!');
    }

    if (session) router.push('/dashboard');
    else {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            scopes: 'repo',
            queryParams: {
              prompt: 'consent',
            },
            redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?redirect=dashboard`,
          },
        });

        if (error) throw error;

        router.refresh();
      } catch {
        toast.error('Could not login!');
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between">
      <header className="flex w-full items-center justify-center border-b border-gray-200">
        <NavBar />
      </header>
      <main className="relative mx-auto w-11/12 sm:w-4/5 md:w-3/5 lg:w-2/5 flex items-center justify-center">
        {/* TODO: Dynamically generate multiple blobs to fill the length of main */}
        <div className="absolute -z-10 left-0 w-2/5 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        <div className="absolute -z-10 w-2/5 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        <div className="absolute -z-10 right-0 w-2/5 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        <div className="w-full h-full border border-gray-200 rounded-sm shadow-sm bg-white backdrop-blur-sm bg-opacity-40 p-6 flex flex-col items-center justify-center text-center">
          <h1 className="font-bold text-4xl mb-4">GitHub User Cards</h1>
          <p className="mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque sint
            harum consequatur vel. Ipsum, unde voluptates sit aliquid, eum
            dolorum quasi quae pariatur facilis.
          </p>
          <div className="flex gap-x-4">
            <button
              className="px-4 py-2 min-w-[9rem] font-semibold text-white rounded-md shadow-sm bg-red-600 hover:bg-red-500 focus-visible:outline-none focus-visible:bg-red-500"
              onClick={handleCallToAction}
            >
              Get Started
            </button>
            <a
              className="px-4 py-2 min-w-[9rem] font-semibold rounded-md shadow-sm border-2 bg-white border-gray-200 focus-visible:outline-none focus-visible:border-red-200"
              href="https://github.com/infamous55/github-user-cards"
              target="_blank"
            >
              Source Code
            </a>
          </div>
        </div>
      </main>
      <footer className="bg-black text-white  w-full">
        <div className="mx-auto flex p-6 lg:px-8 w-full justify-between max-w-7xl">
          <p>
            Made by{' '}
            <a
              className="text-gray-200 font-semibold focus-visible:text-red-200 focus-visible:outline-none"
              href="https://infamous55.com"
              target="_blank"
            >
              infamous55
            </a>
            .
          </p>
          <p>
            Powered by{' '}
            <a
              className="text-gray-200 font-semibold focus-visible:text-red-200 focus-visible:outline-none"
              href="https://nextjs.org/"
              target="_blank"
            >
              Next.js
            </a>{' '}
            and{' '}
            <a
              className="text-gray-200 font-semibold focus-visible:text-red-200 focus-visible:outline-none"
              href="https://supabase.com/"
              target="_blank"
            >
              Supabase
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
