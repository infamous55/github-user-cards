import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { StackIcon } from '@radix-ui/react-icons';
import RepoStats from './RepoStats';

import type { Database } from '~/lib/database.types';

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect('/home');

  const { data } = await supabase
    .from('repo_stats')
    .select('*')
    .eq('user_id', session.user.id);

  if (!data) throw 'Something went wrong!';

  const options = data[0] as Database['public']['Tables']['repo_stats']['Row'];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <StackIcon className="w-6 h-6 mr-2 select-none text-red-500" />
        Dashboard
      </h1>
      <RepoStats options={options} />
    </div>
  );
}
