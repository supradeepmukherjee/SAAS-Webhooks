import { authMiddleware, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = ['/', '/api/webhook/register', '/register', '/login',]

export default authMiddleware({
    publicRoutes,
    async afterAuth(auth, req) {
        if (!auth.userId && !publicRoutes.includes(req.nextUrl.pathname)) return NextResponse.redirect(new URL('/login', req.url))
        if (auth.userId) {
            try {
                const user = await clerkClient.users.getUser(auth.userId)
                const role = user.publicMetadata.role as undefined | string
                if (role === 'admin' && req.nextUrl.pathname === '/dashboard') return NextResponse.redirect(new URL('/admin/dashboard', req.url))
                if (role !== 'admin' && req.nextUrl.pathname.startsWith('/admin')) return NextResponse.redirect(new URL('/dashboard', req.url))
                if (publicRoutes.includes(req.nextUrl.pathname)) return NextResponse.redirect(new URL(role === 'admin' ? '/admin/dashboard' : '/dashboard', req.url))
            } catch (err) {
                console.log(err)
                return NextResponse.redirect(new URL('/error', req.url))
            }
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};