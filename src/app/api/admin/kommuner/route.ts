import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function GET() {
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const responses = await (prisma as any).response.findMany({
            select: { kommun: true },
            distinct: ['kommun'],
        });

        const kommuner = responses.map((r: any) => r.kommun).filter(Boolean);
        return NextResponse.json(kommuner);
    } catch (error) {
        console.error("Failed to fetch kommuner:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
