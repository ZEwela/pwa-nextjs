import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // Initialize the response
  const response = NextResponse.next();

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Handle protected routes
  if (request.nextUrl.pathname.startsWith("/profile") && error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Redirect logged-in users accessing the homepage
  if (request.nextUrl.pathname === "/" && user) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // Return the updated response
  return response;
};
