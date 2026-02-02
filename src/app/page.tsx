'use client';

import { SurveyWizard } from '@/components/survey/SurveyWizard';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <div className="container mx-auto px-6 py-12">
        <header className="text-center mb-20 pt-16">
          <div className="mb-6 flex justify-center">
            <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
              Strategisk Analys v2.0
            </span>
          </div>
          <h1 className="text-7xl font-extrabold tracking-tight mb-8 text-foreground">
            Indikativ analys för digital mognad
          </h1>
          <div className="h-1.5 w-32 bg-accent mx-auto mb-10 rounded-full shadow-[0_0_15px_rgba(186,170,93,0.3)]"></div>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Ett kvalificerat beslutsunderlag för att bedöma er digitala mognad och identifiera strategiska utvecklingsvägar.
          </p>
        </header>

        <section className="relative z-10">
          <SurveyWizard />
        </section>
      </div>
    </main>
  );
}
