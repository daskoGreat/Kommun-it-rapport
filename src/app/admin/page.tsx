'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [kommuner, setKommuner] = useState<{ name: string; userCount: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchKommuner = async () => {
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
    };

    useEffect(() => {
        fetchKommuner();
    }, []);

    const handleDelete = async (e: React.MouseEvent, kommunName: string) => {
        e.stopPropagation(); // Prevent navigation to the report

        // First fetch the impact
        try {
            const res = await fetch(`/api/admin/kommuner/${encodeURIComponent(kommunName)}`);
            if (res.ok) {
                const impact = await res.json();
                const confirmed = window.confirm(
                    `Är du säker på att du vill ta bort "${kommunName}"?\n\nDetta kommer att radera:\n- ${impact.responseCount} svar\n- ${impact.userCount} användare\n\nDenna åtgärd kan inte ångras.`
                );

                if (confirmed) {
                    setIsLoading(true);
                    const deleteRes = await fetch(`/api/admin/kommuner/${encodeURIComponent(kommunName)}`, {
                        method: 'DELETE',
                    });

                    if (deleteRes.ok) {
                        await fetchKommuner();
                    } else {
                        alert("Kunde inte ta bort kommunen. Försök igen.");
                        setIsLoading(false);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to delete kommun:", error);
            alert("Ett fel uppstod vid borttagning.");
        }
    };

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
                            <div
                                key={kommun.name}
                                onClick={() => router.push(`/admin/report/${encodeURIComponent(kommun.name)}`)}
                                className="group relative p-8 bg-surface rounded-3xl border border-border hover:border-accent/40 shadow-lg hover:shadow-accent/10 transition-all text-left space-y-4 cursor-pointer"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold group-hover:text-accent transition-colors">{kommun.name}</h3>
                                        <p className="text-sm text-text-muted">
                                            {kommun.userCount} {kommun.userCount === 1 ? 'person har' : 'personer har'} svarat
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(e, kommun.name)}
                                        className="p-2 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                                        title="Ta bort kommun"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex items-center text-sm text-text-muted uppercase tracking-widest font-bold pt-2">
                                    <span>Visa samlad analys</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
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
