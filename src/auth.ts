import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        return user
    } catch (error) {
        console.error("Failed to fetch user:", error)
        throw new Error("Failed to fetch user.")
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data
                    const user = await getUser(email)
                    if (!user) return null

                    if (!user.password) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password)
                    if (passwordsMatch) return user
                }

                console.log("Invalid credentials")
                return null
            },
        }),
    ],
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
                (session.user as any).role = token.role;
                (session.user as any).kommun = token.kommun;
                (session.user as any).occupationalRole = token.occupationalRole;
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
})
