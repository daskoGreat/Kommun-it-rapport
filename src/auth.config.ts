import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnAdmin = nextUrl.pathname.startsWith('/admin')
            const isOnAuth = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register')
            const isHomePage = nextUrl.pathname === '/'

            if (isOnAdmin) {
                if (isLoggedIn && (auth.user as any).role === 'ADMIN') return true
                return false // Redirect to login
            }

            if (isHomePage) {
                if (isLoggedIn) return true
                return false // Redirect to login
            }

            if (isOnAuth && isLoggedIn) {
                return Response.redirect(new URL('/', nextUrl))
            }

            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role
                token.kommun = (user as any).kommun
                token.occupationalRole = (user as any).occupationalRole
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.sub;
                (session.user as any).role = token.role;
                (session.user as any).kommun = token.kommun;
                (session.user as any).occupationalRole = token.occupationalRole;
            }
            return session
        },
    },
    providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig
