import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const scriptUrl = process.env.WAITLIST_GOOGLE_SCRIPT_URL;

        if (!scriptUrl) {
            console.error('WAITLIST_GOOGLE_SCRIPT_URL is not set');
            return NextResponse.json({ result: 'error', error: 'Server configuration error' }, { status: 500 });
        }

        const response = await fetch(scriptUrl, {
            method: 'POST',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            return NextResponse.json(result);
        } else {
            const text = await response.text();
            console.error('Waitlist API received non-JSON response from Google:', text.substring(0, 500));
            return NextResponse.json({
                result: 'error',
                error: 'Google Script did not return JSON. Please ensure "Who has access" is set to "Anyone".'
            }, { status: 502 });
        }
    } catch (error) {
        console.error('Waitlist API error:', error);
        return NextResponse.json({ result: 'error', error: 'Internal server error' }, { status: 500 });
    }
}
