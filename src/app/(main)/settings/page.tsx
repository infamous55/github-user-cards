import { LockClosedIcon } from '@radix-ui/react-icons';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { deleteAccount } from './actions';

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
      <div className="w-full p-6 rounded-md shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Delete Your Account</h3>
        <p className="mb-4">
          Deleting your account removes all associated data. This action cannot
          be undone.
        </p>
        <form action={deleteAccount}>
          <button
            className="px-4 py-2 min-w-[9rem] font-semibold text-white rounded-md shadow-sm bg-red-600 hover:bg-red-500 focus-visible:outline-none focus-visible:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-500"
            type="submit"
          >
            Delete Account
          </button>
        </form>
      </div>
    </div>
  );
}
