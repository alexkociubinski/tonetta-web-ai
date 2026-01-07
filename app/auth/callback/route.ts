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
        // Array to hold cookies that need to be set on the response
        let cookiesToSetOnResponse: { name: string, value: string, options: any }[] = []

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        // 1. Set on the request store (for immediate visibility if needed)
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch { }

                        // 2. Capture for the response
                        cookiesToSetOnResponse = cookiesToSet
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
                // Even if no user found immediately, we should still set the cookies in case it's just a timing/consistency issue
                // but redirecting with error is safer.
                return NextResponse.redirect(`${origin}/?auth_error=No%20User%20Found`, { status: 302 })
            }

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'
            let finalUrl = `${origin}${next}`
            if (!isLocalEnv && forwardedHost) {
                finalUrl = `https://${forwardedHost}${next}`
            }

            // Append success param
            const separator = finalUrl.includes('?') ? '&' : '?'
            const redirectUrl = `${finalUrl}${separator}auth_success=true`

            const response = NextResponse.redirect(redirectUrl, { status: 302 })

            // CRITICAL: Apply captured cookies to the actual response object
            cookiesToSetOnResponse.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options)
            })

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
