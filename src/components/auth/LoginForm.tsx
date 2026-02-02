'use client';

import { useActionState } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authenticate } from '@/app/lib/actions';
// We will create this action file next

export function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined
    );

    return (
        <div className="w-full max-w-md p-10 space-y-10 bg-surface rounded-3xl shadow-2xl border border-border transition-all duration-300">
            <div className="text-center">
                <h2 className="text-4xl font-extrabold text-foreground tracking-tight italic">Logga in</h2>
                <p className="mt-4 text-text-muted font-light leading-relaxed">
                    Identifiera dig för att hantera strategiska rapporter
                </p>
                <div className="mt-6 h-1 w-16 bg-accent mx-auto rounded-full"></div>
            </div>

            <form action={formAction} className="mt-10 space-y-8">
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
                        <label htmlFor="password" className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
                            Lösenord
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full px-5 py-4 bg-background/50 border border-border rounded-xl text-foreground placeholder-text-muted/30 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-5 w-5 bg-background border-border rounded text-accent focus:ring-accent/20"
                        />
                        <label htmlFor="remember-me" className="ml-3 block text-sm text-text-muted font-medium">
                            Kom ihåg mig
                        </label>
                    </div>

                    <div className="text-sm font-bold uppercase tracking-widest">
                        <a href="#" className="text-accent hover:text-accent-hover transition-colors">
                            Glömt?
                        </a>
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex justify-center py-5 px-6 rounded-xl shadow-xl text-xs font-black uppercase tracking-[0.2em] text-background bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isPending ? 'Verifierar...' : 'Logga in'}
                    </button>

                    <p className="text-center text-sm text-text-muted">
                        Inget konto än?{' '}
                        <a href="/register" className="text-accent font-bold hover:underline">
                            Registrera dig här
                        </a>
                    </p>
                </div>

                {errorMessage && (
                    <div className="p-4 text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake" role="alert">
                        {errorMessage}
                    </div>
                )}
            </form>
        </div>
    );
}
