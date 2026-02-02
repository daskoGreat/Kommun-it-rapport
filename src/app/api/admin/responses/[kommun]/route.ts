import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: { kommun: string } }
) {
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const kommun = decodeURIComponent(params.kommun);

    try {
        const responses = await (prisma as any).response.findMany({
            where: { kommun },
            include: {
                user: {
                    select: {
                        email: true,
                        name: true,
                    }
                }
            }
        });

        // Map responses to include role and data
        const formattedResponses = responses.map(r => ({
            role: r.occupationalRole,
            answers: JSON.parse(r.data),
            user: r.user.email
        }));

        return NextResponse.json(formattedResponses);
    } catch (error) {
        console.error("Failed to fetch responses:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
