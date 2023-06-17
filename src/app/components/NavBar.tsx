'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { env } from '~/env.mjs';
import toast from '~/lib/toast';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  LockClosedIcon,
  StackIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';
import * as Avatar from '@radix-ui/react-avatar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import type { Database } from '~/lib/database.types';
import type { Session } from '@supabase/auth-helpers-nextjs';

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
          queryParams: {
            prompt: 'consent',
          },
          redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?redirect=dashboard`,
        },
      });

      if (error) throw error;
    } catch {
      toast.error('Could not login!');
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      router.refresh();
    } catch {
      toast.error('Could not logout!');
    }
  };

  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <nav className="mx-auto flex w-full max-w-7xl items-center justify-between p-6 lg:px-8">
      <Link className="font-bold text-xl" href="/home">
        Logo
      </Link>
      {session ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="focus-visible:outline-none"
          >
            <div className="flex items-center">
              <ChevronDownIcon
                className={`mx-2 h-5 w-5 ${
                  isFocused ? 'text-red-500' : 'text-gray-900'
                }`}
              />
              <Avatar.Root className="h-10 w-10">
                <Avatar.Image
                  className="h-full w-full rounded-full"
                  src={session.user.user_metadata!.avatar_url}
                  alt={session.user.user_metadata!.user_name}
                />
                <Avatar.Fallback
                  className="h-full w-full rounded-full border-2 border-gray-200 flex items-center justify-center"
                  delayMs={600}
                >
                  <span className="font-semibold">
                    {(
                      session.user.user_metadata!.user_name as string
                    )[0].toUpperCase()}
                  </span>
                </Avatar.Fallback>
              </Avatar.Root>
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="rounded-md mt-2 w-40 shadow-sm bg-white border-2 border-gray-200">
              <DropdownMenu.Item className="hover:outline-none focus-visible:outline-none hover:bg-gray-100 focus-visible:bg-gray-100">
                <Link
                  href="/dashboard"
                  className="w-full h-full flex items-center p-2"
                >
                  <StackIcon className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="hover:outline-none focus-visible:outline-none hover:bg-gray-100 focus-visible:bg-gray-100">
                <Link
                  href="/settings"
                  className="w-full h-full flex items-center p-2"
                >
                  <LockClosedIcon className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="hover:outline-none focus-visible:outline-none hover:bg-gray-100 focus-visible:bg-gray-100">
                <button
                  onClick={handleSignOut}
                  className="w-full h-full flex items-center p-2 text-start"
                >
                  <ArrowRightIcon className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
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
