import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { StackIcon } from '@radix-ui/react-icons';
import GithubPat from './GithubPat';
import ControlCard from './ControlCard';

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: repoStatsRows } = await supabase
    .from('repo_stats')
    .select('*')
    .eq('user_id', session!.user.id); // Session always exists in a protected route

  if (!repoStatsRows || !repoStatsRows.length)
    throw new Error("Couldn't fetch repo_stats record");

  const repoOptions = {
    id: repoStatsRows[0].id as string,
    enabled: repoStatsRows[0].enabled as boolean,
  };

  const { data: topLangsRows } = await supabase
    .from('top_langs')
    .select('*')
    .eq('user_id', session!.user.id);

  if (!topLangsRows || !topLangsRows.length)
    throw new Error("Couldn't fetch top_langs record");

  const langsOptions = {
    id: topLangsRows[0].id as string,
    enabled: topLangsRows[0].enabled as boolean,
  };

  const { data: githubPatRows } = await supabase
    .from('github_pat')
    .select('*')
    .eq('user_id', session!.user.id);

  if (!githubPatRows || !githubPatRows.length)
    throw new Error("Couldn't fetch github_pat record");

  const pat = githubPatRows[0].token as string;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <StackIcon className="w-6 h-6 mr-2 select-none text-red-500" />
        Dashboard
      </h1>
      <GithubPat pat={pat} />
      <div className="h-4"></div>
      <ControlCard options={repoOptions} type="repo-stats" />
      <div className="h-4"></div>
      <ControlCard options={langsOptions} type="top-langs" />
    </div>
  );
}
