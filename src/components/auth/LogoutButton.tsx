'use client';

import { logoutAction } from '@/app/lib/actions';

export const LogoutButton = () => {
    return (
        <form action={logoutAction} className="inline-block">
            <button
                type="submit"
                className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors disabled:opacity-50"
            >
                Logga ut
            </button>
        </form>
    );
};
