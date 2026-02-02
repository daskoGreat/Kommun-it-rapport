'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [kommuner, setKommuner] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchKommuner() {
            try {
                const res = await fetch('/api/admin/kommuner');
                if (res.ok) {
                    const data = await res.json();
                    setKommuner(data);
                }
            } catch (error) {
                console.error("Failed to fetch kommuner:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchKommuner();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground py-16 px-6">
            <div className="max-w-5xl mx-auto space-y-12">
                <header className="text-center space-y-4">
                    <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
                        Adminportal
                    </span>
                    <h1 className="text-5xl font-extrabold tracking-tight">Strategisk Överblick</h1>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto font-light">
                        Välj en kommun för att generera en samlad IT-mognadsrapport baserad på alla inkomna svar.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kommuner.length > 0 ? (
                        kommuner.map((kommun) => (
                            <button
                                key={kommun}
                                onClick={() => router.push(`/admin/report/${encodeURIComponent(kommun)}`)}
                                className="group p-8 bg-surface rounded-3xl border border-border hover:border-accent/40 shadow-lg hover:shadow-accent/10 transition-all text-left space-y-4"
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-bold group-hover:text-accent transition-colors">{kommun}</h3>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-muted group-hover:text-accent transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                                <p className="text-sm text-text-muted uppercase tracking-widest font-bold">Visa samlad analys →</p>
                            </button>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-surface rounded-3xl border border-dashed border-border">
                            <p className="text-text-muted italic">Inga svar har inkommit ännu.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
