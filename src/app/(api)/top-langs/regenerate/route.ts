import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { v4 } from 'uuid';

import { type NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { error } = await supabase
      .from('top_langs')
      .update({ id: v4() })
      .eq('user_id', session.user.id);
    if (error)
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );

    return NextResponse.json(
      { message: 'Updated Successfully' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
