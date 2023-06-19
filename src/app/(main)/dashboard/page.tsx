import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { StackIcon } from '@radix-ui/react-icons';
import GithubPat from './GithubPat';
import RepoStats from './RepoStats';

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect('/home');

  const { data: repoStatsRows } = await supabase
    .from('repo_stats')
    .select('*')
    .eq('user_id', session.user.id);

  if (!repoStatsRows || !repoStatsRows.length) throw 'Something went wrong!';

  const options = {
    id: repoStatsRows[0].id as string,
    enabled: repoStatsRows[0].enabled as boolean,
  };

  const { data: githubPatRows } = await supabase
    .from('github_pat')
    .select('*')
    .eq('user_id', session.user.id);

  if (!githubPatRows || !githubPatRows.length) throw 'Something went wrong!';

  const pat = githubPatRows[0].token as string;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <StackIcon className="w-6 h-6 mr-2 select-none text-red-500" />
        Dashboard
      </h1>
      <GithubPat pat={pat} />
      <div className="h-4"></div>
      <RepoStats options={options} />
    </div>
  );
}
