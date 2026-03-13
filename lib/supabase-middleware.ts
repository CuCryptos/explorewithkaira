import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

type SessionAuthClient = {
  getSession?: () => Promise<{ data: { session: { user: unknown } | null } }>;
  getUser: () => Promise<{ data: { user: unknown | null } }>;
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const authClient = supabase.auth as SessionAuthClient;
  const user = authClient.getSession
    ? (await authClient.getSession()).data.session?.user ?? null
    : (await authClient.getUser()).data.user ?? null;

  if (
    !user &&
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
