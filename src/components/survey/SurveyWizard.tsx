'use client';

import React, { useState } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { surveySections } from '@/data/questions';
import { QuestionCard } from './QuestionCard';
import { useRouter } from 'next/navigation';


export const SurveyWizard = () => {
    const { responses, setResponse } = useSurvey();
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const currentSection = surveySections[currentSectionIndex];
    const isLastSection = currentSectionIndex === surveySections.length - 1;

    const handleNext = async () => {
        if (isLastSection) {
            setIsSubmitting(true);
            try {
                const { saveSurveyResponse } = await import('@/app/lib/actions');
                await saveSurveyResponse(responses);
                router.push('/thanks');
            } catch (error) {
                console.error("Error saving response:", error);
                alert("Kunde inte spara dina svar. Försök igen.");
            } finally {
                setIsSubmitting(false);
            }
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

    // Calculate total questions (counting each Likert row as 1 question unit)
    const totalQuestions = surveySections.reduce((total, section) => {
        return total + section.questions.reduce((qTotal, q) => {
            if (q.type === 'likert' && q.rows) {
                return qTotal + q.rows.length;
            }
            return qTotal + 1;
        }, 0);
    }, 0);

    // Calculate answered questions
    const answeredQuestions = surveySections.reduce((total, section) => {
        return total + section.questions.reduce((qTotal, q) => {
            const answer = responses[q.id];
            if (q.type === 'likert') {
                // For likert, answer is Record<string, string>, count keys
                return qTotal + (answer && typeof answer === 'object' ? Object.keys(answer).length : 0);
            }
            // For others, check if truthy (non-empty string)
            return qTotal + (answer && answer !== '' ? 1 : 0);
        }, 0);
    }, 0);

    const progress = Math.min(100, Math.round((answeredQuestions / totalQuestions) * 100));

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 relative">


            {/* Progress Bar */}
            <div className="mb-12">
                <div className="flex justify-between text-xs font-bold text-text-muted mb-4 uppercase tracking-widest">
                    <span>Del {currentSectionIndex + 1} av {surveySections.length}</span>
                    <span>{progress}% slutfört</span>
                </div>
                <div className="h-1.5 bg-surface rounded-full overflow-hidden border border-border">
                    <div
                        className="h-full bg-accent transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(186,170,93,0.4)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Header */}
            <div className="mb-14 text-center">
                <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight">{currentSection.title}</h2>
                <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed font-light">{currentSection.description}</p>
            </div>

            {/* Questions */}
            <div className="space-y-10 mb-16">
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
            <div className="flex justify-between items-center pt-10 border-t border-border">
                <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentSectionIndex === 0}
                    className={`px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${currentSectionIndex === 0
                        ? 'text-text-muted opacity-30 cursor-not-allowed'
                        : 'text-foreground hover:bg-surface border border-transparent hover:border-border'
                        }`}
                >
                    ← Föregående
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="bg-accent hover:bg-accent-hover text-background px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-accent/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                >
                    {isSubmitting ? 'Sparar...' : (isLastSection ? 'Skicka in svar' : 'Nästa Sida →')}
                </button>
            </div>
        </div>
    );
};
