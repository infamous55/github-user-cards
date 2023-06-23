import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { env } from '~/env.mjs';
import { cookies } from 'next/headers';

export async function deleteAccount() {
  'use server';

  const helper = createServerActionClient({ cookies });
  const {
    data: { session },
  } = await helper.auth.getSession();
  if (!session) throw new Error('Cannot delete unauthenticated user');
  await helper.auth.signOut();
  // cookies().set()

  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  await supabase.auth.admin.deleteUser(session.user.id);

  return redirect('/home');
}
