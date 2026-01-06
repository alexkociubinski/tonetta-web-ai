import Link from 'next/link'

export default function AuthCodeError() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-12 text-center border border-brand-navy/5">
                <h1 className="text-3xl font-black text-brand-navy mb-4">Authentication Error</h1>
                <p className="text-brand-navy/60 mb-8">
                    There was an error during the sign-in process. This could be due to an expired link or a configuration issue.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-brand-navy text-white px-8 py-4 rounded-full font-bold hover:bg-brand-navy/90 transition-all active:scale-95"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    )
}
