import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { env } from './env.mjs';

import type { NextRequest } from 'next/server';
import type { Database } from '~/lib/database.types';

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();

    const supabase = createMiddlewareClient<Database>({ req, res });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const protectedRoutes = ['/dashboard', '/settings'];
    if (protectedRoutes.includes(req.nextUrl.pathname) && !session)
      return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/home`);

    return res;
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
