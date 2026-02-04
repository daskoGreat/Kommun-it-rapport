'use client';

import React, { useEffect, useState } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { recommendations } from '@/data/questions';
import { useRouter } from 'next/navigation';

export default function ReportPage() {
    const { responses } = useSurvey();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const matchedRecommendations = recommendations.filter((rec) => rec.trigger(responses));
    const vision = responses['vision_text'] as string;
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAnalysis() {
            if (Object.keys(responses).length === 0) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        responses,
                        vision: responses['vision_text']
                    }),
                });

                if (res.ok) {
                    const reader = res.body?.getReader();
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
                    const errorData = await res.json().catch(() => ({}));
                    console.error("Failed to fetch AI analysis", errorData);
                    setAiAnalysis("Kunde inte generera AI-analys. Kontrollera att Ollama är igång.");
                }
            } catch (error) {
                console.error("Error fetching analysis", error);
                setAiAnalysis("Ett fel uppstod vid kontakt med AI-tjänsten.");
            } finally {
                setLoading(false);
            }
        }

        fetchAnalysis();
    }, [responses]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <h2 className="text-xl font-medium text-gray-700">Genererar analys...</h2>
                </div>
            </div>
        );
    }

    if (Object.keys(responses).length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="mb-4">Ingen data hittades.</p>
                    <button onClick={() => router.push('/')} className="text-primary hover:underline">Gå till start</button>
                </div>
            </div>
        );
    }

    return (
        <>
            <style jsx global>{`
                @media print {
                    @page {
                        margin: 2cm;
                        size: A4;
                    }
                    
                    body {
                        background: white !important;
                    }
                    
                    .print\\:hidden {
                        display: none !important;
                    }
                    
                    .print-footer {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        text-align: center;
                        font-size: 10px;
                        color: #666;
                        padding: 10px;
                        border-top: 1px solid #ddd;
                    }
                    
                    .page-break {
                        page-break-before: always;
                    }
                }
            `}</style>

            <div className="min-h-screen bg-background text-foreground py-16 px-6 transition-colors duration-500">
                <div className="max-w-5xl mx-auto shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-surface p-16 rounded-[2.5rem] border border-border relative overflow-hidden print:shadow-none print:p-0 print:border-0 print:bg-white print:text-black">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none print:hidden"></div>

                    {/* Header Section */}
                    <div className="text-center mb-24 relative z-10 print:mb-12">
                        <div className="mb-10">
                            <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase bg-accent/10 px-6 py-3 rounded-full border border-accent/20">
                                Konfidentiell Strategisk Rapport
                            </span>
                        </div>
                        <h1 className="text-6xl font-extrabold mb-8 print:text-4xl text-foreground tracking-tight">Indikativ analys för digital mognad</h1>
                        <div className="h-1.5 w-40 bg-accent mx-auto mb-10 rounded-full shadow-[0_0_20px_rgba(186,170,93,0.4)]"></div>
                        <p className="text-2xl text-text-muted mb-12 font-light leading-relaxed max-w-3xl mx-auto">
                            Ett beslutsstöd för verksamhetens fortsatta digitala transformation och strategiska vägval.
                        </p>

                        {vision && (
                            <div className="mt-12 p-12 bg-background/40 rounded-[2rem] border border-border italic text-2xl text-foreground/90 relative shadow-inner print:bg-slate-50 print:border-slate-200">
                                <span className="absolute -top-6 left-12 text-8xl text-accent/20 font-serif">"</span>
                                <p className="relative z-10 leading-relaxed">{vision}</p>
                                <span className="absolute -bottom-14 right-12 text-8xl text-accent/20 font-serif">"</span>
                            </div>
                        )}
                    </div>

                    {/* AI Analysis Section */}
                    <div className="space-y-20 relative z-10">
                        {aiAnalysis ? (
                            (() => {
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
                                        {/* Overview Section */}
                                        <section className="bg-accent shadow-[0_20px_40px_rgba(186,170,93,0.15)] p-12 rounded-[2rem] border-t-4 border-accent-hover print:bg-white print:border-2 print:border-black print:shadow-none">
                                            <h2 className="text-xs font-black text-background mb-6 uppercase tracking-[0.3em] print:text-black">Executive Summary</h2>
                                            <div className="text-2xl text-background leading-relaxed font-bold print:text-black print:text-xl">
                                                {overview}
                                            </div>
                                        </section>

                                        {/* Current State Section */}
                                        <section className="pt-4 pr-4">
                                            <h2 className="text-xs font-black text-accent mb-10 uppercase tracking-[0.3em] border-b border-border pb-6">Strategisk Nulägesbeskrivning</h2>
                                            <div className="text-xl text-foreground/90 leading-[1.8] space-y-8 font-light text-justify print:text-black print:text-lg">
                                                {description.split('\n\n').map((para, i) => (
                                                    <p key={i} className="first-letter:text-3xl first-letter:font-bold first-letter:mr-1">{para}</p>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Contradictions Section */}
                                        {hasContradictions && (
                                            <section className="bg-red-500/5 p-12 rounded-[2rem] border-2 border-red-500/20 shadow-2xl print:bg-white print:border-red-600 print:border-2">
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
                            })()
                        ) : (
                            <div className="text-center py-32">
                                <div className="inline-block relative">
                                    <div className="w-24 h-24 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 bg-accent/10 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                <p className="mt-12 text-text-muted uppercase tracking-[0.4em] text-xs font-bold">Kvalificerad analys pågår...</p>
                            </div>
                        )}
                    </div>

                    {/* Branding */}
                    <div className="mt-24 text-center border-t border-border pt-12 print:mt-12">
                        <p className="text-accent font-black tracking-widest text-sm mb-3 uppercase">Powered by Great IT</p>
                        <p className="text-xs text-text-muted font-medium tracking-tight">© 2026 Strategiskt Analysverktyg för digital mognad</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-16 text-center print:hidden flex gap-6 justify-center">
                        <button
                            onClick={() => window.print()}
                            className="px-10 py-5 bg-accent hover:bg-accent-hover text-background font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-xl hover:shadow-accent/20 transform hover:-translate-y-1 active:translate-y-0"
                        >
                            Arkivera som PDF / Skriv ut
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="px-10 py-5 bg-surface-hover hover:bg-surface text-foreground font-black uppercase tracking-widest text-xs rounded-xl transition-all border border-border hover:border-accent/40"
                        >
                            Initiera Ny Analys
                        </button>
                    </div>
                </div>

                {/* Print Footer */}
                <div className="print-footer hidden print:block pt-8 text-slate-400">
                    Konfidentiell analys för digital mognad | Powered by Great IT | {new Date().toLocaleDateString()}
                </div>
            </div>

        </>
    );
}
