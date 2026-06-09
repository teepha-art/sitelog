import { Metadata } from 'next';
import { AuthForm } from './AuthForm';

export const metadata: Metadata = {
  title: 'Log In / Sign Up — SiteLog',
};

export default async function AuthPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams;
  return <AuthForm defaultMode={mode as 'login' | 'signup' | undefined} />;
}
