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
            select: {
                kommun: true,
                userId: true,
            },
        });

        const countsByKommun: Record<string, Set<string>> = {};
        responses.forEach((r: any) => {
            if (!r.kommun) return;
            if (!countsByKommun[r.kommun]) {
                countsByKommun[r.kommun] = new Set();
            }
            countsByKommun[r.kommun].add(r.userId);
        });

        const result = Object.entries(countsByKommun).map(([name, userSet]) => ({
            name,
            userCount: userSet.size,
        })).sort((a, b) => a.name.localeCompare(b.name));

        return NextResponse.json(result);
    } catch (error) {
        console.error("Failed to fetch kommuner:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
