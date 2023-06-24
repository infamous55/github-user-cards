import { LockClosedIcon } from '@radix-ui/react-icons';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DeleteAcc from './DeleteAcc';

export default async function Settings() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;

  if (!session) redirect('/home');

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <LockClosedIcon className="w-6 h-6 mr-2 select-none text-red-500" />
        Settings
      </h1>
      <DeleteAcc />
    </div>
  );
}
