import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { type NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data } = await supabase
      .from('top_langs')
      .select()
      .eq('user_id', session.user.id);
    if (!data || !data.length)
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );

    return NextResponse.json({ ...data[0] });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const schema = z.object({
      enabled: z.boolean(),
    });
    const requestBody = await request.json();
    const result = schema.safeParse(requestBody);
    if (!result.success)
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

    const { error } = await supabase
      .from('top_langs')
      .update({ enabled: result.data.enabled })
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
