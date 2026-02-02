'use client';

import { useActionState } from 'react';
import { registerUser } from '@/app/lib/actions';

export function RegisterForm() {
    const [state, formAction, isPending] = useActionState(registerUser, null);

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-surface rounded-xl shadow-lg border border-slate-100">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-primary">Registrera konto</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Skapa ett konto för att komma igång
                </p>
            </div>

            <form action={formAction} className="mt-8 space-y-6">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
                            E-postadress
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full px-5 py-4 bg-background/50 border border-border rounded-xl text-foreground placeholder-text-muted/30 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
                                placeholder="namn@organisation.se"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="kommun" className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
                            Arbetsplats
                        </label>
                        <div className="mt-1">
                            <input
                                id="kommun"
                                name="kommun"
                                type="text"
                                required
                                className="block w-full px-5 py-4 bg-background/50 border border-border rounded-xl text-foreground placeholder-text-muted/30 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
                                placeholder="Ange er arbetsplats"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="occupationalRole" className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
                            Yrkesroll
                        </label>
                        <div className="mt-1">
                            <input
                                id="occupationalRole"
                                name="occupationalRole"
                                type="text"
                                required
                                className="block w-full px-5 py-4 bg-background/50 border border-border rounded-xl text-foreground placeholder-text-muted/30 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
                                placeholder="t.ex. IT-Chef eller Verksamhetsutvecklare"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
                            Lösenord
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="block w-full px-5 py-4 bg-background/50 border border-border rounded-xl text-foreground placeholder-text-muted/30 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="hidden">
                        <label htmlFor="role" className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
                            Systemroll
                        </label>
                        <div className="mt-1">
                            <select
                                id="role"
                                name="role"
                                className="block w-full px-5 py-4 bg-background/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium appearance-none cursor-pointer"
                            >
                                <option value="USER" selected>Strategisk Användare</option>
                                <option value="ADMIN">Systemadministratör</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex justify-center py-5 px-6 rounded-xl shadow-xl text-xs font-black uppercase tracking-[0.2em] text-background bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isPending ? 'Bearbetar...' : 'Skapa Konto'}
                    </button>

                    <p className="text-center text-sm text-text-muted">
                        Har du redan ett konto?{' '}
                        <a href="/login" className="text-accent font-bold hover:underline">
                            Logga in här
                        </a>
                    </p>
                </div>

                {state?.message && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md" role="alert">
                        {state.message}
                    </div>
                )}
            </form>
        </div>
    );
}
