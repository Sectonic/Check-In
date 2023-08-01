import { NextResponse } from 'next/server';
import { getIronSession } from "iron-session/edge";

export async function middleware(req) {
    const res = NextResponse.next();
    const session = await getIronSession(req, res, {
        cookieName: "checkincookie",
        password: process.env.COOKIE_PASSWORD,
    });
    const { user } = session;
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
        if (!user) {
            return NextResponse.redirect(new URL('/register', req.url));
        } 
        // if (req.nextUrl.query.meet_slug && !user.meets.includes(req.nextUrl.query.meet_slug)) {
        //     return NextResponse.redirect(new URL('/dashboard', req.url));
        // }
    }

    return res;

}