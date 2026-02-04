'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SurveyResponse } from '@/types/survey';

interface SurveyContextType {
    responses: SurveyResponse;
    setResponse: (questionId: string, value: string | boolean | string[] | Record<string, string> | any) => void;
    resetSurvey: () => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider = ({ children }: { children: ReactNode }) => {
    const [responses, setResponses] = useState<SurveyResponse>({});

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
