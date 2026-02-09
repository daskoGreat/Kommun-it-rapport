'use server';

import { signIn, auth } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['USER', 'ADMIN']).default('USER'),
    kommun: z.string().min(2),
    occupationalRole: z.string().min(2),
});

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return 'E-post och lösenord är obligatoriska.';
    }

    try {
        await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        // Fetch user to check role for redirection
        const user = await (prisma as any).user.findUnique({ where: { email } });
        if (user?.role === 'ADMIN') {
            redirect('/admin');
        }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Felaktiga inloggningsuppgifter.';
                default:
                    return 'Något gick fel.';
            }
        }
        throw error;
    }
    // After login, redirect to home page where the survey is
    redirect('/');
}

export async function registerUser(_prevState: any, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
        kommun: formData.get('kommun'),
        occupationalRole: formData.get('occupationalRole'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Misslyckades att registrera användare. Kontrollera fälten.',
        };
    }

    const { email, password, role, kommun, occupationalRole } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await (prisma as any).user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                kommun,
                occupationalRole,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        return {
            message: 'Databasfel: Kunde inte skapa användare (e-posten kanske redan används).',
        };
    }

    redirect('/login');
}


export async function saveSurveyResponse(data: any) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const { email, id, role, kommun, occupationalRole } = session.user as any;

    try {
        // Find if user already has a response
        const existingResponse = await (prisma as any).response.findFirst({
            where: { userId: id }
        });

        if (existingResponse) {
            await (prisma as any).response.update({
                where: { id: existingResponse.id },
                data: {
                    data: JSON.stringify(data),
                    kommun: kommun || 'Okänd',
                    occupationalRole: occupationalRole || 'Okänd',
                }
            });
        } else {
            await (prisma as any).response.create({
                data: {
                    data: JSON.stringify(data),
                    kommun: kommun || 'Okänd',
                    occupationalRole: occupationalRole || 'Okänd',
                    userId: id,
                }
            });
        }
    } catch (error) {
        console.error("Failed to save response:", error);
        throw new Error("Failed to save response.");
    }
}

export async function logoutAction() {
    const { signOut } = await import('@/auth');
    await signOut({ redirectTo: '/login' });
}

export async function getInitialRole() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const email = session.user.email;
    console.log(`[getInitialRole] Checking role for ${email}`);

    try {
        // 1. Check user profile first
        const user = await (prisma as any).user.findUnique({
            where: { email },
            select: { occupationalRole: true, id: true }
        });

        console.log(`[getInitialRole] Profile role: ${user?.occupationalRole}`);
        if (user?.occupationalRole && user.occupationalRole !== 'Okänd') return user.occupationalRole;

        // 2. Fallback to latest response associated with this user's email
        // We can use the relation to User to find responses by email
        const lastResponse = await (prisma as any).response.findFirst({
            where: {
                user: { email: email }
            },
            orderBy: { createdAt: 'desc' },
            select: { occupationalRole: true }
        });

        console.log(`[getInitialRole] Latest response role: ${lastResponse?.occupationalRole}`);

        // Avoid returning 'Okänd' as a pre-fill value if possible
        if (lastResponse?.occupationalRole && lastResponse.occupationalRole !== 'Okänd') {
            return lastResponse.occupationalRole;
        }

        return null;
    } catch (error) {
        console.error("Failed to fetch initial role:", error);
        return null;
    }
}
