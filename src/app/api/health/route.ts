import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        // Simple query to verify DB connection
        await prisma.$queryRaw`SELECT 1`;
        return NextResponse.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        console.error('Healthcheck failed:', error);
        return NextResponse.json(
            { status: 'error', database: 'disconnected', details: (error as Error).message },
            { status: 503 }
        );
    }
}
