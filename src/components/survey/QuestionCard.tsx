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
            <div className="bg-surface p-10 rounded-2xl border border-border shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-foreground mb-4 leading-snug tracking-tight">{question.text}</h3>
                {question.description && <p className="text-text-muted text-lg mb-8 font-light leading-relaxed">{question.description}</p>}
                <div className="flex gap-6 mt-6">
                    <button
                        onClick={() => onChange(true)}
                        className={`flex-1 py-5 px-8 rounded-xl border-2 font-bold uppercase tracking-widest text-xs transition-all transform ${value === true
                            ? 'bg-accent border-accent text-background shadow-[0_5px_15px_rgba(186,170,93,0.3)] scale-[1.02]'
                            : 'bg-transparent border-border text-foreground hover:border-accent/40 hover:bg-surface-hover'
                            }`}
                    >
                        Ja
                    </button>
                    <button
                        onClick={() => onChange(false)}
                        className={`flex-1 py-5 px-8 rounded-xl border-2 font-bold uppercase tracking-widest text-xs transition-all transform ${value === false
                            ? 'bg-accent border-accent text-background shadow-[0_5px_15px_rgba(186,170,93,0.3)] scale-[1.02]'
                            : 'bg-transparent border-border text-foreground hover:border-accent/40 hover:bg-surface-hover'
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
            <div className="bg-surface p-10 rounded-2xl border border-border shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-foreground mb-8 leading-snug tracking-tight">{question.text}</h3>
                <div className="space-y-4">
                    {question.options.map((opt: Option) => (
                        <label
                            key={opt.id}
                            className={`flex items-start p-5 rounded-xl border-2 cursor-pointer transition-all ${currentValues.includes(opt.value.toString())
                                ? 'bg-accent/5 border-accent shadow-[inset_0_0_10px_rgba(186,170,93,0.1)]'
                                : 'border-border hover:border-accent/40 bg-background/30 hover:bg-surface-hover'
                                }`}
                        >
                            <div className="relative flex items-center mt-1">
                                <input
                                    type="checkbox"
                                    className="peer h-6 w-6 opacity-0 absolute cursor-pointer"
                                    checked={currentValues.includes(opt.value.toString())}
                                    onChange={() => toggleOption(opt.value.toString())}
                                />
                                <div className={`h-6 w-6 border-2 rounded transition-all ${currentValues.includes(opt.value.toString())
                                    ? 'bg-accent border-accent text-background'
                                    : 'bg-transparent border-border peer-hover:border-accent/40'}`}>
                                    {currentValues.includes(opt.value.toString()) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <span className={`ml-4 text-lg font-medium transition-colors ${currentValues.includes(opt.value.toString()) ? 'text-foreground' : 'text-text-muted'}`}>
                                {opt.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        );
    }

    if (question.type === 'text') {
        return (
            <div className="bg-surface p-10 rounded-2xl border border-border shadow-2xl transition-all duration-300">
                <label className="block text-2xl font-bold text-foreground mb-6 leading-snug tracking-tight">
                    {question.text}
                </label>
                <textarea
                    className="w-full p-6 rounded-xl bg-background/50 border-2 border-border focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all placeholder:text-text-muted/50 text-foreground text-lg min-h-[220px] font-light italic leading-relaxed"
                    placeholder="Formulera er strategiska vision här..."
                    value={(value as string) || ''}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        );
    }

    return null;
};
