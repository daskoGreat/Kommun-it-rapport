'use client';

import React, { useEffect, useState } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { recommendations } from '@/data/questions';
import { useRouter } from 'next/navigation';

export default function ReportPage() {
    const { responses } = useSurvey();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Calculate logic
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
                    const data = await res.json();
                    setAiAnalysis(data.analysis);
                } else {
                    console.error("Failed to fetch AI analysis");
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
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-medium text-slate-700 dark:text-slate-300">Genererar analys...</h2>
                </div>
            </div>
        );
    }

    // Fallback if no data (refresh on report page)
    if (Object.keys(responses).length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="mb-4">Ingen data hittades.</p>
                    <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">Gå till start</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold mb-4">Er Handlingsplan</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400">
                        Baserat på er nulägesanalys och visionen:
                    </p>
                    {vision && (
                        <div className="mt-6 p-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm max-w-2xl mx-auto italic text-lg border-l-4 border-blue-500">
                            "{vision}"
                        </div>
                    )}
                </div>

                <div className="grid gap-8">
                    {matchedRecommendations.length > 0 ? (
                        matchedRecommendations.map((rec) => (
                            <div key={rec.id} className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                                        !
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">{rec.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                        {rec.description}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-green-50 p-8 rounded-xl text-center border border-green-200">
                            <h3 className="text-2xl font-bold text-green-800 mb-2">Inga kritiska åtgärder identifierade</h3>
                            <p className="text-green-700">Det verkar som att ni har en stabil grund att stå på!</p>
                        </div>
                    )}
                </div>

                {/* AI Agent Analysis */}
                <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-12">
                    <h2 className="text-2xl font-bold mb-6 text-center">AI-Strategens Analys ({aiAnalysis ? 'gemma3:4b' : '...'})</h2>
                    <div className="bg-slate-900 text-slate-300 p-8 rounded-xl font-mono text-sm leading-7 shadow-inner whitespace-pre-wrap">
                        {aiAnalysis || "Laddar analys..."}
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center">
                <button
                    onClick={() => router.push('/')}
                    className="px-8 py-3 bg-slate-200 text-slate-800 font-medium rounded-lg hover:bg-slate-300 transition-colors"
                >
                    Gör om analysen
                </button>
            </div>
        </div>
    );
}
