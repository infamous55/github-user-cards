import { createClient } from '@supabase/supabase-js';
import { env } from '~/env.mjs';
import { generateTopLangs } from '~/lib/cards';

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

    const { data: topLangsRows } = await supabase
      .from('top_langs')
      .select()
      .eq('id', params.id);
    if (!topLangsRows || !topLangsRows.length)
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });

    const topLangs =
      topLangsRows[0] as Database['public']['Tables']['top_langs']['Row'];
    if (!topLangs.enabled)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data: githubPatRows } = await supabase
      .from('github_pat')
      .select()
      .eq('user_id', topLangs.user_id);
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

    const body = await generateTopLangs(githubPat.token);
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
