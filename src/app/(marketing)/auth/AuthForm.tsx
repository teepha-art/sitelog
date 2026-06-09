'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import styles from './AuthForm.module.css';

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'reset-password';

export function AuthForm({ defaultMode }: { defaultMode?: AuthMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(defaultMode === 'signup' ? 'signup' : 'login');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [resetCode, setResetCode] = useState('');
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    clearMessages();
    setPassword('');
    setResetCode('');
    const params = new URLSearchParams(window.location.search);
    params.set('mode', newMode);
    window.history.replaceState(null, '', `/auth?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);

    if (mode === 'login') {
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.ok) {
            setError(data.error?.message || 'Something went wrong. Please try again later.');
            setIsLoading(false);
            return;
          }
          router.push(data.data.role === 'project_manager' ? '/dashboard' : '/projects');
        })
        .catch(() => {
          setError('Something went wrong. Please try again later.');
          setIsLoading(false);
        });
    } else if (mode === 'signup') {
      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, role }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.ok) {
            setError(data.error?.message || 'Something went wrong. Please try again later.');
            setIsLoading(false);
            return;
          }
          router.push(data.data.role === 'project_manager' ? '/dashboard' : '/projects');
        })
        .catch(() => {
          setError('Something went wrong. Please try again later.');
          setIsLoading(false);
        });
    } else if (mode === 'forgot-password') {
      fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.ok) {
            setError(data.error?.message || 'Something went wrong. Please try again later.');
            setIsLoading(false);
            return;
          }
          setSuccess('We\'ve sent a 6-digit code to your email. Enter it below.');
          setMode('reset-password');
          setIsLoading(false);
        })
        .catch(() => {
          setError('Something went wrong. Please try again later.');
          setIsLoading(false);
        });
    } else if (mode === 'reset-password') {
      fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: resetCode, newPassword: password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.ok) {
            setError(data.error?.message || 'Something went wrong. Please try again later.');
            setIsLoading(false);
            return;
          }
          setSuccess('Your password has been reset. You can now log in.');
          setMode('login');
          setPassword('');
          setIsLoading(false);
        })
        .catch(() => {
          setError('Something went wrong. Please try again later.');
          setIsLoading(false);
        });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <a href="/" className={styles.logoLink}>
          <Image src="/logo/sitelog_wordmark_color.svg" alt="SiteLog" width={0} height={0} className={styles.logoImage} priority />
        </a>
      </div>

      <Card padding="lg" className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {mode === 'login' && 'Log in to SiteLog'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'forgot-password' && 'Reset your password'}
            {mode === 'reset-password' && 'Enter reset code'}
          </h1>
          <p className={styles.subtitle}>
            {mode === 'login' && 'Welcome back! Please enter your details.'}
            {mode === 'signup' && 'Sign up to start managing your projects.'}
            {mode === 'forgot-password' && 'Enter your email to receive a 6-digit code.'}
            {mode === 'reset-password' && 'Check your email for the 6-digit code.'}
          </p>
        </div>

        {error && <div className={`${styles.alert} ${styles.error}`}>{error}</div>}
        {success && <div className={`${styles.alert} ${styles.success}`}>{success}</div>}

        <form 
          className={styles.form} 
          onSubmit={handleSubmit}
          noValidate
        >
          {mode === 'signup' && (
            <>
              <Input
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
              <Select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                disabled={isLoading}
                options={[
                  { value: 'project_manager', label: 'Project Manager' },
                  { value: 'site_supervisor', label: 'Site Supervisor' },
                ]}
              />
            </>
          )}

          {(mode === 'login' || mode === 'signup' || mode === 'forgot-password' || mode === 'reset-password') && (
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || mode === 'reset-password'}
            />
          )}

          {mode === 'reset-password' && (
            <Input
              label="6-Digit Reset Code"
              type="text"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
              disabled={isLoading}
              maxLength={6}
            />
          )}

          {(mode === 'login' || mode === 'signup' || mode === 'reset-password') && (
            <Input
              label={mode === 'reset-password' ? 'New Password' : 'Password'}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          )}

          <div className={styles.actions}>
            <Button type="submit" fullWidth loading={isLoading}>
              {mode === 'login' && 'Log In'}
              {mode === 'signup' && 'Sign Up'}
              {mode === 'forgot-password' && 'Send Code'}
              {mode === 'reset-password' && 'Reset Password'}
            </Button>

            {mode === 'login' && (
              <>
                <button type="button" className={styles.link} onClick={() => switchMode('forgot-password')}>
                  Forgot your password?
                </button>
                <button type="button" className={styles.link} onClick={() => switchMode('signup')}>
                  Don't have an account? Sign up
                </button>
              </>
            )}

            {mode === 'signup' && (
              <button type="button" className={styles.link} onClick={() => switchMode('login')}>
                Already have an account? Log in
              </button>
            )}

            {(mode === 'forgot-password' || mode === 'reset-password') && (
              <button type="button" className={styles.link} onClick={() => switchMode('login')}>
                Back to log in
              </button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
