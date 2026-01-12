export type QuestionId = string;
export type SectionId = 'digitalmognad' | 'digitaltarv' | 'digitalformaga' | 'vision';

export interface Option {
    id: string;
    label: string;
    value: string | number | boolean;
}

export interface Question {
    id: QuestionId;
    text: string;
    description?: string;
    type: 'yes-no' | 'checkbox' | 'text';
    options?: Option[]; // For checkbox/radio
}

export interface Section {
    id: SectionId;
    title: string;
    description: string;
    questions: Question[];
}

export interface SurveyResponse {
    [questionId: string]: string | boolean | string[]; // boolean for yes-no, string[] for checkboxes, string for text
}

export interface ReportRecommendation {
    id: string;
    trigger: (response: SurveyResponse) => boolean;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
}
