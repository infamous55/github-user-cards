import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { v4 } from 'uuid';

import { type NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextResponse) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabase
    .from('repo_stats')
    .select()
    .eq('user_id', session.user.id);
  if (!data || !data.length)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );

  return NextResponse.json({ ...data[0] });
}

export async function PUT(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const schema = z
    .object({
      enabled: z.boolean(),
      regenerate: z.boolean(),
    })
    .partial();
  const requestBody = await request.json();
  const result = schema.safeParse(requestBody);
  if (
    !result.success ||
    (result.data.enabled == undefined && result.data.regenerate == undefined)
  )
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

  let data: any = {};
  if (result.data.enabled != undefined) data.enabled = result.data.enabled;
  if (result.data.regenerate) data.id = v4();

  const { error } = await supabase
    .from('repo_stats')
    .update(data)
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
}
