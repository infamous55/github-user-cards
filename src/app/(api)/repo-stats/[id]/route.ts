import { createClient } from '@supabase/supabase-js';
import { env } from '~/env.mjs';
import { generateRepoStats } from '~/lib/cards';

import { type NextRequest, NextResponse } from 'next/server';
import type { Database } from '~/lib/database.types';

// Supabase uses fetch calls under the hood
export const fetchCache = 'default-no-store';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const { data: repoStatsRows } = await supabase
      .from('repo_stats')
      .select()
      .eq('id', params.id);
    if (!repoStatsRows || !repoStatsRows.length)
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });

    const repoStats =
      repoStatsRows[0] as Database['public']['Tables']['repo_stats']['Row'];
    if (!repoStats.enabled)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data: githubPatRows } = await supabase
      .from('github_pat')
      .select()
      .eq('user_id', repoStats.user_id);
    if (!githubPatRows || !githubPatRows.length)
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );

    const githubPat =
      githubPatRows[0] as Database['public']['Tables']['github_pat']['Row'];
    if (!githubPat.token)
      return NextResponse.json(
        {
          error: 'Failed Dependency',
        },
        { status: 424 }
      );

    const body = await generateRepoStats(githubPat.token);
    return new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml' },
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
