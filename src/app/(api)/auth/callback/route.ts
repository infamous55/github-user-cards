import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { env } from '~/env.mjs';

import type { NextRequest } from 'next/server';
import type { Database } from '~/lib/database.types';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectPath = requestUrl.searchParams.get('redirect');
  const redirect = `${env.NEXT_PUBLIC_APP_URL}/${redirectPath}`;

  try {
    if (code) {
      const supabase = createRouteHandlerClient<Database>({ cookies });
      await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(redirect ? redirect : requestUrl.origin);
  } catch {
    return NextResponse.json(
      { error: 'Token Exchange Failed' },
      { status: 500 }
    );
  }
}
