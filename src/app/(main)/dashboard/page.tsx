import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { StackIcon } from '@radix-ui/react-icons';
import GithubPat from './GithubPat';
import RepoStats from './RepoStats';

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: repoStatsRows } = await supabase
    .from('repo_stats')
    .select('*')
    .eq('user_id', session!.user.id); // Session always exists in a protected route

  const options = {
    id: repoStatsRows![0].id as string, // There is always one repo_stats record for each user
    enabled: repoStatsRows![0].enabled as boolean,
  };

  const { data: githubPatRows } = await supabase
    .from('github_pat')
    .select('*')
    .eq('user_id', session!.user.id);

  const pat = githubPatRows![0].token as string; // There is always one github_pat record for each user

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
