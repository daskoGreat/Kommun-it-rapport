import { LoginForm } from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Logga in | Indikativ analys för digital mognad',
};

export default function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background py-16 px-6 sm:px-12 transition-colors duration-500">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </main>
    );
}
