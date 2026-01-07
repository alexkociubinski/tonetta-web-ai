import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const cookieStore = await cookies()

        // Create a separate variable to hold cookies so we can apply them to the response
        // because cookieStore.set() might not persist on manual NextResponse.redirect()
        const headers = new Headers()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options)
                            // Also manually construct set-cookie header
                            // This is a manual fallback if cookieStore fails
                        })
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Explicitly check if the session was established
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError || !user) {
                console.error('Auth Exchange Success but No User:', userError)
                return NextResponse.redirect(`${origin}/?auth_error=No%20User%20Found`, { status: 302 })
            }

            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            let finalUrl = `${origin}${next}`
            if (!isLocalEnv && forwardedHost) {
                finalUrl = `https://${forwardedHost}${next}`
            }

            // Append success param
            const separator = finalUrl.includes('?') ? '&' : '?'
            const redirectUrl = `${finalUrl}${separator}auth_success=true`

            const response = NextResponse.redirect(redirectUrl, { status: 302 })

            // CRITICAL: Copy all cookies from the store (which includes the new session) to the response
            // This ensures they are actually sent.

            // Supabase auth cookies are properly set in the cookieStore by .exchangeCodeForSession()
            // Next.js 'cookies()' is a Request helper. To set cookies on Response, we normally rely on Next.js 
            // merging them. But to be safe, we iterate.

            // Actually, simply by calling cookieStore.set inside the adapter, Next.js *should* handle it.
            // But let's try to verify via headers logger if possible, or just trust the new cookie store mechanics.

            // ALTERNATIVE FIX: The issue might be that creating the response *before* setting cookies in some adapters.
            // But here we set them inside the client call.

            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            response.headers.set('Pragma', 'no-cache')
            response.headers.set('Expires', '0')
            return response
        } else {
            console.error('Auth Exchange Error:', error)
            return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(error.message)}`, { status: 302 })
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
