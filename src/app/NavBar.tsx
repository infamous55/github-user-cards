'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';

import type { Database } from '~/lib/database.types';
import type { Session } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function NavBar() {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          scopes: 'repo',
        },
      });

      if (error) throw error;

      router.refresh();
    } catch {
      toast.error('Login failed!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <nav className="mx-auto flex w-full max-w-7xl items-center justify-between p-6 lg:px-8">
      <span className="font-bold text-xl">Logo</span>
      {session ? (
        <button onClick={handleSignOut}>Sign out</button>
      ) : (
        <button
          className="px-4 py-2 font-semibold text-white rounded-md shadow-sm bg-red-600 hover:bg-red-500 focus-visible:outline focus-visible:outline-none focus-visible:bg-red-500"
          onClick={handleSignIn}
        >
          Sign in
        </button>
      )}
    </nav>
  );
}
