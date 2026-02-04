export type QuestionId = string;
export type SectionId = 'intro' | 'digitalt_arv' | 'digital_formaga';

export interface Option {
    label: string;
    value: string | number;
}

export interface LikertRow {
    id: string;
    text: string;
}

export interface LikertColumn {
    value: string | number;
    label: string;
}

export interface Question {
    id: QuestionId;
    text: string;
    description?: string;
    type: 'text' | 'yes-no' | 'multiple-choice' | 'likert';
    options?: Option[]; // For multiple-choice
    rows?: LikertRow[]; // For likert
    columns?: LikertColumn[]; // For likert
}

export interface Section {
    id: SectionId;
    title: string;
    description: string;
    questions: Question[];
}

export interface SurveyResponse {
    [questionId: string]: string | boolean | string[] | Record<string, string>;
    // boolean: yes-no
    // string: text, multiple-choice
    // Record<string, string>: likert (rowId -> value)
}

export interface ReportRecommendation {
    id: string;
    trigger: (response: SurveyResponse) => boolean;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
}
