import React from 'react';
import { Question, Option } from '@/types/survey';

interface QuestionCardProps {
    question: Question;
    value: any;
    onChange: (val: any) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, value, onChange }) => {
    if (question.type === 'yes-no') {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">{question.text}</h3>
                {question.description && <p className="text-slate-500 text-sm mb-4">{question.description}</p>}
                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => onChange(true)}
                        className={`flex-1 py-3 px-4 rounded-lg border font-medium transition-all ${value === true
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300'
                            }`}
                    >
                        Ja
                    </button>
                    <button
                        onClick={() => onChange(false)}
                        className={`flex-1 py-3 px-4 rounded-lg border font-medium transition-all ${value === false
                                ? 'bg-slate-600 border-slate-600 text-white shadow-md'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300'
                            }`}
                    >
                        Nej
                    </button>
                </div>
            </div>
        );
    }

    if (question.type === 'checkbox' && question.options) {
        const currentValues = (value as string[]) || [];

        const toggleOption = (val: string) => {
            if (currentValues.includes(val)) {
                onChange(currentValues.filter((v) => v !== val));
            } else {
                onChange([...currentValues, val]);
            }
        };

        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">{question.text}</h3>
                <div className="space-y-3">
                    {question.options.map((opt: Option) => (
                        <label
                            key={opt.id}
                            className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${currentValues.includes(opt.value.toString())
                                    ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-500'
                                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700'
                                }`}
                        >
                            <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                checked={currentValues.includes(opt.value.toString())}
                                onChange={() => toggleOption(opt.value.toString())}
                            />
                            <span className="ml-3 text-slate-700 dark:text-slate-200">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        );
    }

    if (question.type === 'text') {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                <label className="block text-lg font-medium text-slate-900 dark:text-white mb-2">
                    {question.text}
                </label>
                <textarea
                    className="w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-900 dark:border-slate-600 dark:text-white min-h-[150px]"
                    placeholder="Skriv din vision här..."
                    value={(value as string) || ''}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        );
    }

    return null;
};
