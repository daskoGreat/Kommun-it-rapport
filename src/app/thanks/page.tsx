'use client';

import Link from 'next/link';

export default function ThanksPage() {
    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center py-16 px-6 transition-colors duration-500">
            <div className="max-w-2xl w-full text-center space-y-10 p-16 bg-surface rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -mr-16 -mt-16"></div>

                <div className="space-y-6 relative z-10">
                    <div className="inline-block p-4 bg-accent/10 rounded-full border border-accent/20 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight">Tack för ditt svar</h1>
                    <div className="h-1 w-24 bg-accent mx-auto rounded-full"></div>
                    <p className="text-2xl text-text-muted font-light leading-relaxed">
                        Din analys har registrerats och kommer att användas som underlag för er verksamhets IT-strategi.
                    </p>
                </div>

                <div className="pt-8 relative z-10">
                    <Link
                        href="/"
                        className="inline-block px-10 py-5 bg-surface-hover hover:bg-surface text-foreground font-black uppercase tracking-widest text-xs rounded-xl transition-all border border-border hover:border-accent/40"
                    >
                        Gå tillbaka till startsidan
                    </Link>
                </div>
            </div>

            <footer className="mt-12 text-xs tracking-[0.2em] font-bold text-text-muted/40 uppercase">
                Powered by Great IT
            </footer>
        </main>
    );
}
