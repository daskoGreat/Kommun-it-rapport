import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ kommun: string }> }
) {
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { kommun } = await params;
    const decodedKommun = decodeURIComponent(kommun);

    try {
        const responseCount = await (prisma as any).response.count({
            where: { kommun: decodedKommun },
        });

        const userCount = await (prisma as any).user.count({
            where: {
                kommun: decodedKommun,
                role: 'USER' // Only count regular users
            },
        });

        return NextResponse.json({
            kommun: decodedKommun,
            responseCount,
            userCount
        });
    } catch (error) {
        console.error("Failed to fetch impact:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ kommun: string }> }
) {
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { kommun } = await params;
    const decodedKommun = decodeURIComponent(kommun);

    try {
        // Use a transaction to ensure all or nothing
        await (prisma as any).$transaction([
            // 1. Delete all responses for this municipality
            (prisma as any).response.deleteMany({
                where: { kommun: decodedKommun },
            }),
            // 2. Delete all regular users for this municipality
            (prisma as any).user.deleteMany({
                where: {
                    kommun: decodedKommun,
                    role: 'USER'
                },
            }),
        ]);

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Failed to delete municipality:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
