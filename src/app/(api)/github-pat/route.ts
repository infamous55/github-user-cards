import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { type NextRequest, NextResponse } from 'next/server';

// export async function GET(_request: NextRequest) {
//   const supabase = createRouteHandlerClient({ cookies });

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();
//   if (!session)
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//   const { data } = await supabase
//     .from('github_pat')
//     .select()
//     .eq('user_id', session.user.id);
//   if (!data || !data.length)
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );

//   return NextResponse.json({ ...data[0] });
// }

export async function PUT(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const schema = z.object({
    token: z.string(),
  });

  const requestBody = await request.json();
  const result = schema.safeParse(requestBody);
  if (!result.success)
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

  const { error } = await supabase
    .from('github_pat')
    .update({ token: result.data.token })
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
