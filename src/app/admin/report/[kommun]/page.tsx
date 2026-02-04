'use client';

import { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ReportRecommendation } from '@/types/survey';

export default function AdminReportPage() {
    const params = useParams();
    const router = useRouter();
    const kommun = decodeURIComponent(params.kommun as string);

    const [aiAnalysis, setAiAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAggregatedReport() {
            try {
                const res = await fetch(`/api/admin/responses/${encodeURIComponent(kommun)}`);
                if (!res.ok) throw new Error("Misslyckades att hämta data för kommunen.");

                const responses = await res.json();

                if (responses.length === 0) {
                    setError("Inga svar hittades för denna kommun.");
                    setIsLoading(false);
                    return;
                }

                const analyzeRes = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        aggregatedResponses: responses,
                        kommunName: kommun
                    }),
                });

                if (analyzeRes.ok) {
                    const reader = analyzeRes.body?.getReader();
                    const decoder = new TextDecoder();
                    let result = '';

                    if (reader) {
                        setAiAnalysis(""); // Clear previous state
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;
                            const text = decoder.decode(value, { stream: true });
                            result += text;
                            setAiAnalysis(result);
                        }
                    }
                } else {
                    const errorData = await analyzeRes.json().catch(() => ({}));
                    throw new Error(`Misslyckades att generera AI-analys: ${errorData.details || analyzeRes.statusText}`);
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAggregatedReport();
    }, [kommun]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center py-16 px-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent mb-8"></div>
                <p className="text-text-muted uppercase tracking-[0.4em] text-xs font-bold">Kvalificerad sammanställning pågår...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center py-16 px-6">
                <div className="max-w-md w-full p-10 bg-surface border border-red-500/20 rounded-3xl text-center space-y-6">
                    <h2 className="text-2xl font-bold text-red-400">Ett fel uppstod</h2>
                    <p className="text-text-muted">{error}</p>
                    <button onClick={() => router.push('/admin')} className="w-full py-4 bg-accent text-background rounded-xl font-bold uppercase tracking-widest text-xs">
                        Gå tillbaka
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground py-16 px-6 transition-colors duration-500">
            <div className="max-w-5xl mx-auto shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-surface p-16 rounded-[2.5rem] border border-border relative overflow-hidden print:shadow-none print:p-0 print:border-0 print:bg-white print:text-black">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none print:hidden"></div>

                <header className="text-center mb-24 relative z-10 print:mb-12">
                    <div className="mb-10">
                        <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase bg-accent/10 px-6 py-3 rounded-full border border-accent/20">
                            Samlad Kommunrapport
                        </span>
                    </div>
                    <h1 className="text-6xl font-extrabold mb-8 print:text-4xl text-foreground tracking-tight">{kommun}</h1>
                    <div className="h-1.5 w-40 bg-accent mx-auto mb-10 rounded-full shadow-[0_0_20px_rgba(186,170,93,0.4)]"></div>
                    <p className="text-2xl text-text-muted mb-12 font-light leading-relaxed max-w-3xl mx-auto">
                        Denna rapport presenterar en sammanvägd analys av IT-mognaden baserat på inkomna svar från olika roller inom verksamheten.
                    </p>
                </header>

                <div className="space-y-20 relative z-10">
                    {(() => {
                        const sections = aiAnalysis.split(/# (ÖVERSIKT|NULÄGESBESKRIVNING|MOTSÄGELSER)/);
                        const getSectionContent = (title: string) => {
                            const index = sections.findIndex(s => s === title);
                            return index !== -1 ? sections[index + 1].trim() : '';
                        };

                        const overview = getSectionContent('ÖVERSIKT');
                        const description = getSectionContent('NULÄGESBESKRIVNING');
                        const contradictions = getSectionContent('MOTSÄGELSER');
                        const hasContradictions = contradictions && !contradictions.includes('INGA_MOTSÄGELSER_HITTADE');

                        return (
                            <>
                                <section className="bg-accent shadow-[0_20px_40px_rgba(186,170,93,0.15)] p-12 rounded-[2rem] border-t-4 border-accent-hover print:bg-white print:border-2 print:border-black">
                                    <h2 className="text-xs font-black text-background mb-6 uppercase tracking-[0.3em] print:text-black">Executive Summary</h2>
                                    <div className="text-2xl text-background leading-relaxed font-bold print:text-black print:text-xl">
                                        {overview}
                                    </div>
                                </section>

                                <section className="pt-4 pr-4">
                                    <h2 className="text-xs font-black text-accent mb-10 uppercase tracking-[0.3em] border-b border-border pb-6">Strategisk Nulägesbeskrivning</h2>
                                    <div className="text-xl text-foreground/90 leading-[1.8] space-y-8 font-light text-justify print:text-black">
                                        {description.split('\n\n').map((para, i) => (
                                            <p key={i} className="first-letter:text-3xl first-letter:font-bold first-letter:mr-1">{para}</p>
                                        ))}
                                    </div>
                                </section>

                                {hasContradictions && (
                                    <section className="bg-red-500/5 p-12 rounded-[2rem] border-2 border-red-500/20 shadow-2xl print:bg-white print:border-red-600">
                                        <h2 className="text-xs font-black text-red-500 mb-8 uppercase tracking-[0.3em]">Strategiska Inkonsekvenser</h2>
                                        <div className="text-red-200/90 leading-relaxed space-y-6 print:text-red-700">
                                            {contradictions.split('\n').filter(line => line.trim()).map((line, i) => (
                                                <div key={i} className="flex gap-5 items-start">
                                                    <div className="w-2 h-2 rounded-full bg-red-500 mt-3 shrink-0"></div>
                                                    <p className="text-xl font-medium">{line.replace('🔴', '').trim()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        );
                    })()}
                </div>

                <div className="mt-24 text-center border-t border-border pt-12 print:mt-12">
                    <p className="text-accent font-black tracking-widest text-sm mb-3 uppercase">Powered by Great IT</p>
                    <p className="text-xs text-text-muted font-medium tracking-tight">© 2026 Sammanvägd Analys för IT-Mognad</p>
                </div>

                <div className="mt-16 text-center print:hidden flex gap-6 justify-center">
                    <button onClick={() => window.print()} className="px-10 py-5 bg-accent hover:bg-accent-hover text-background font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-xl hover:shadow-accent/20 transform hover:-translate-y-1 active:translate-y-0">
                        Skriv ut / Spara PDF
                    </button>
                    <button onClick={() => router.push('/admin')} className="px-10 py-5 bg-surface-hover hover:bg-surface text-foreground font-black uppercase tracking-widest text-xs rounded-xl transition-all border border-border hover:border-accent/40">
                        Gå tillbaka till översikt
                    </button>
                </div>
            </div>
        </main>
    );
}
