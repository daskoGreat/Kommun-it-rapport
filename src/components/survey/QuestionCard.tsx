import React from 'react';
import { Question, Option, LikertRow, LikertColumn } from '@/types/survey';

interface QuestionCardProps {
    question: Question;
    value: any;
    onChange: (val: any) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, value, onChange }) => {
    if (question.id === 'role') {
        console.log("[QuestionCard] Role value received:", value);
    }
    // ----------------------------------------------------------------------
    // TEXT Input
    // ----------------------------------------------------------------------
    if (question.type === 'text') {
        const val = (value as string) || '';
        return (
            <div className="bg-surface p-8 rounded-2xl shadow-2xl border border-border hover:border-accent/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-foreground mb-2">{question.text}</h3>
                {question.description && <p className="text-text-muted mb-6 font-light">{question.description}</p>}

                <div className="relative">
                    <input
                        type="text"
                        className="w-full h-14 px-5 rounded-xl bg-background/50 border border-border focus:border-accent focus:ring-1 focus:ring-accent/50 outline-none transition-all text-foreground placeholder-text-muted/30 font-medium"
                        placeholder="Skriv din roll här..."
                        value={val}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            </div>
        );
    }

    // ----------------------------------------------------------------------
    // MULTIPLE CHOICE (Radio)
    // ----------------------------------------------------------------------
    if (question.type === 'multiple-choice' && question.options) {
        const currentVal = value as string;

        return (
            <div className="bg-surface p-8 rounded-2xl shadow-2xl border border-border hover:border-accent/30 transition-all duration-300 relative">
                <h3 className="text-xl font-bold text-foreground mb-6">{question.text}</h3>

                <div className="space-y-3">
                    {question.options.map((opt: Option) => {
                        const isSelected = currentVal === opt.value;
                        const inputId = `${question.id}_${opt.value}`;
                        return (
                            <label
                                key={opt.value}
                                htmlFor={inputId}
                                className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${isSelected
                                    ? 'bg-[#1c2e2e] border-accent shadow-[inset_0_0_15px_rgba(186,170,93,0.1)]' // Safe dark background
                                    : 'bg-background/30 border-border hover:bg-surface-hover hover:border-accent/40'
                                    }`}
                            >
                                <div className={`relative flex items-center justify-center w-5 h-5 rounded-full border-2 mr-4 transition-colors ${isSelected ? 'border-accent' : 'border-text-muted group-hover:border-accent/60'
                                    }`}>
                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />}
                                    <input
                                        id={inputId}
                                        type="radio"
                                        name={question.id}
                                        value={opt.value}
                                        checked={isSelected}
                                        onChange={() => onChange(opt.value)}
                                        className="sr-only"
                                    />
                                </div>
                                <span className={`text-base font-medium transition-colors ${isSelected ? 'text-foreground' : 'text-text-muted group-hover:text-foreground'}`}>
                                    {opt.label}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ----------------------------------------------------------------------
    // LIKERT MATRIX
    // ----------------------------------------------------------------------
    if (question.type === 'likert' && question.rows && question.columns) {
        const currentValues = (value as Record<string, string>) || {};

        const handleRowChange = (rowId: string, colValue: string | number) => {
            onChange({
                ...currentValues,
                [rowId]: colValue
            });
        };

        return (
            <div className="bg-surface p-8 rounded-2xl shadow-2xl border border-border overflow-hidden relative">
                <h3 className="text-xl font-bold text-foreground mb-2">{question.text}</h3>
                {question.description && <p className="text-text-muted mb-8 font-light">{question.description}</p>}

                {/* Desktop Table View */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 w-2/5"></th>
                                {question.columns.map((col) => (
                                    <th key={col.value} className="p-4 text-center text-xs font-bold text-text-muted uppercase tracking-widest">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {question.rows.map((row, idx) => (
                                <tr key={row.id} className={`transition-colors border-b border-border/50 hover:bg-white/5 ${idx % 2 === 0 ? 'bg-background/30' : 'bg-transparent'}`}>
                                    <td className="p-4 text-foreground/90 font-medium text-sm leading-relaxed">
                                        {row.text}
                                    </td>
                                    {question.columns?.map((col) => {
                                        const isSelected = currentValues[row.id] == col.value; // Loose equality
                                        const inputId = `${question.id}_${row.id}_${col.value}`;
                                        return (
                                            <td key={col.value} className="p-4 text-center">
                                                <div className="flex justify-center">
                                                    <label
                                                        htmlFor={inputId}
                                                        className={`cursor-pointer p-3 rounded-full transition-colors group ${isSelected ? 'bg-[#2A2A2A]' : 'hover:bg-white/5'}`}
                                                    >
                                                        <input
                                                            id={inputId}
                                                            type="radio"
                                                            name={`${question.id}_${row.id}`}
                                                            value={col.value}
                                                            checked={isSelected}
                                                            onChange={() => handleRowChange(row.id, col.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected
                                                            ? 'border-accent bg-accent shadow-[0_0_10px_rgba(186,170,93,0.4)]'
                                                            : 'border-text-muted group-hover:border-accent/60'
                                                            }`}>
                                                        </div>
                                                    </label>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return null;
};
