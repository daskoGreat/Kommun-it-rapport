'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SurveyResponse } from '@/types/survey';
import { useSession } from 'next-auth/react';
import { getInitialRole } from '@/app/lib/actions';

interface SurveyContextType {
    responses: SurveyResponse;
    setResponse: (questionId: string, value: string | boolean | string[] | Record<string, string> | any) => void;
    resetSurvey: () => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
    const [responses, setResponses] = useState<SurveyResponse>({});
    const [hasAttemptedPreFill, setHasAttemptedPreFill] = useState(false);

    // Pre-fill role when session is available
    useEffect(() => {
        if (status === 'loading' || hasAttemptedPreFill || responses.role) return;

        const initRole = async () => {
            setHasAttemptedPreFill(true);

            // Try session data first
            const sessionRole = (session?.user as any)?.occupationalRole;

            if (sessionRole && sessionRole !== 'Okänd') {
                setResponses(prev => ({ ...prev, role: sessionRole }));
                return;
            }

            // Fallback to database check
            if (session?.user?.email) {
                try {
                    const dbRole = await getInitialRole();

                    if (dbRole && dbRole !== 'Okänd') {
                        setResponses(prev => ({ ...prev, role: dbRole }));
                    }
                } catch (error) {
                    console.error("[SurveyProvider] Error during DB pre-fill:", error);
                }
            }
        };

        if (status === 'authenticated') {
            initRole();
        }
    }, [session, status, hasAttemptedPreFill, responses.role]);

    const setResponse = (questionId: string, value: string | boolean | string[]) => {
        setResponses((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const resetSurvey = () => {
        setResponses({});
    };

    return (
        <SurveyContext.Provider value={{ responses, setResponse, resetSurvey }}>
            {children}
        </SurveyContext.Provider>
    );
};

export const useSurvey = () => {
    const context = useContext(SurveyContext);
    if (!context) {
        throw new Error('useSurvey must be used within a SurveyProvider');
    }
    return context;
};
