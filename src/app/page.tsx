'use client';

import { SurveyWizard } from '@/components/survey/SurveyWizard';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Kommun IT-Mognadsanalys
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Svara på frågorna för att analysera er digitala mognad och få skräddarsydda rekommendationer för nästa steg.
          </p>
        </header>

        <SurveyWizard />

        <footer className="mt-20 text-center text-slate-400 text-sm pb-8">
          <p>© 2025 IT-Mognadsanalys. Ett verktyg för strategisk digitalisering.</p>
        </footer>
      </div>
    </main>
  );  
}
