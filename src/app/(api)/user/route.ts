import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { env } from '~/env.mjs';

export const fetchCache = 'force-no-store';

export async function DELETE(_request: NextRequest) {
  try {
    const helper = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await helper.auth.getSession();
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

    await supabase.auth.admin.deleteUser(session.user.id);
    return NextResponse.json({ message: 'Deleted Successfully' });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
