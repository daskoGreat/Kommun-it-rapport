'use client';

import React, { useState } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { surveySections } from '@/data/questions';
import { QuestionCard } from './QuestionCard';
import { useRouter } from 'next/navigation';

export const SurveyWizard = () => {
    const { responses, setResponse } = useSurvey();
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const router = useRouter();

    const currentSection = surveySections[currentSectionIndex];
    const isLastSection = currentSectionIndex === surveySections.length - 1;

    const handleNext = () => {
        if (isLastSection) {
            router.push('/report');
        } else {
            window.scrollTo(0, 0);
            setCurrentSectionIndex((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentSectionIndex > 0) {
            window.scrollTo(0, 0);
            setCurrentSectionIndex((prev) => prev - 1);
        }
    };

    const progress = ((currentSectionIndex + 1) / surveySections.length) * 100;

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                    <span>Del {currentSectionIndex + 1} av {surveySections.length}</span>
                    <span>{Math.round(progress)}% klart</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Header */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{currentSection.title}</h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">{currentSection.description}</p>
            </div>

            {/* Questions */}
            <div className="space-y-6 mb-10">
                {currentSection.questions.map((question) => (
                    <QuestionCard
                        key={question.id}
                        question={question}
                        value={responses[question.id]}
                        onChange={(val) => setResponse(question.id, val)}
                    />
                ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-700">
                <button
                    onClick={handleBack}
                    disabled={currentSectionIndex === 0}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${currentSectionIndex === 0
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                >
                    Tillbaka
                </button>
                <button
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                >
                    {isLastSection ? 'Skapa Rapport' : 'Nästa steg'}
                </button>
            </div>
        </div>
    );
};
