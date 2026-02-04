import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    try {
        // Simple query to verify DB connection
        await prisma.$queryRaw`SELECT 1`;
        return NextResponse.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        console.error('Healthcheck failed:', error);

        // Debug info: Check which env vars are loaded (safe keys only)
        const envCheck = {
            hasDB_URL: !!process.env.DATABASE_URL,
            hasPOSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
            hasPOSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
            hasGITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
            NODE_ENV: process.env.NODE_ENV
        };
        console.log('Environment Debug:', envCheck);

        return NextResponse.json(
            {
                status: 'error',
                database: 'disconnected',
                details: (error as Error).message,
                debug: envCheck
            },
            { status: 503 }
        );
    }
}
