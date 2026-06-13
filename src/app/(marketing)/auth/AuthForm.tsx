'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import styles from './AuthForm.module.css';

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'reset-password';

function getEmailError(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
  return null;
}

function getPasswordError(password: string): string | null {
  if (!password) return 'Password is required';
  return null;
}

const PASSWORD_RULES = [
  { test: (p: string) => /[A-Z]/.test(p), hint: 'Must contain an uppercase letter' },
  { test: (p: string) => /[a-z]/.test(p), hint: 'Must contain a lowercase letter' },
  { test: (p: string) => /\d/.test(p), hint: 'Must contain a number' },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), hint: 'Must contain a special character' },
  { test: (p: string) => p.length >= 8, hint: 'Must be at least 8 characters' },
];

function getCurrentPasswordHint(password: string): string | null {
  if (!password) return null;
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(password)) return rule.hint;
  }
  return null;
}

function getStrongPasswordError(password: string): string | null {
  if (!password) return 'Password is required';
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(password)) return rule.hint;
  }
  return null;
}

export function AuthForm({ defaultMode }: { defaultMode?: AuthMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(defaultMode === 'signup' ? 'signup' : 'login');
  const [signupStep, setSignupStep] = useState<'step1' | 'step2'>('step1');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [resetCode, setResetCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    clearMessages();
    setPassword('');
    setResetCode('');
    setShowPassword(false);
    setTouched({});
    setFieldErrors({});
    setSignupStep('step1');
    const params = new URLSearchParams(window.location.search);
    params.set('mode', newMode);
    window.history.replaceState(null, '', `/auth?${params.toString()}`);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let err: string | null = null;
    if (field === 'email') err = getEmailError(email);
    if (field === 'password') err = mode === 'login' ? getPasswordError(password) : getStrongPasswordError(password);
    setFieldErrors((prev) => ({ ...prev, [field]: err || '' }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      const err = getEmailError(value);
      setFieldErrors((prev) => ({ ...prev, email: err || '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      const err = mode === 'login' ? getPasswordError(value) : getStrongPasswordError(value);
      setFieldErrors((prev) => ({ ...prev, password: err || '' }));
    }
    if (!value) setShowPassword(false);
  };

  const handleContinueToStep2 = () => {
    clearMessages();
    const nameErr = !fullName.trim() ? 'Name is required' : null;
    const roleErr = !role ? 'Please select a role' : null;
    setTouched({ fullName: true, role: true });
    setFieldErrors({ fullName: nameErr || '', role: roleErr || '' });
    if (!nameErr && !roleErr) {
      setSignupStep('step2');
      setTouched({});
      setFieldErrors({});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (mode === 'login') {
      const emailErr = getEmailError(email);
      const passwordErr = getPasswordError(password);
      setTouched({ email: true, password: true });
      setFieldErrors({ email: emailErr || '', password: passwordErr || '' });
      if (emailErr || passwordErr) return;

      setIsLoading(true);
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
      const emailErr = getEmailError(email);
      const passwordErr = getStrongPasswordError(password);
      setTouched({ email: true, password: true });
      setFieldErrors({ email: emailErr || '', password: passwordErr || '' });
      if (emailErr || passwordErr) return;

      setIsLoading(true);
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
          router.push('/onboarding');
        })
        .catch(() => {
          setError('Something went wrong. Please try again later.');
          setIsLoading(false);
        });
    } else if (mode === 'forgot-password') {
      setIsLoading(true);
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
      const passwordErr = getStrongPasswordError(password);
      if (passwordErr) {
        setError(passwordErr);
        return;
      }
      setIsLoading(true);
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

  const renderSubmitButton = (label: string, showArrow = false) => (
    <button type="submit" className={styles.submitButton} disabled={isLoading}>
      {isLoading && <Loader2 size={20} className={styles.spinner} />}
      {!isLoading && showArrow && <ArrowRight size={20} />}
      {isLoading ? `${label}...` : label}
    </button>
  );

  const renderLoginPasswordField = () => {
    const hasError = touched.password && fieldErrors.password;
    return (
      <div className={styles.passwordWrapper}>
        <div className={styles.labelRow}>
          <span className={styles.fieldLabel}>Password</span>
          <button
            type="button"
            className={styles.forgotLink}
            onClick={() => switchMode('forgot-password')}
          >
            Forgot password
          </button>
        </div>
        <div className={styles.passwordInputWrapper}>
          <input
            id="login-password"
            className={`${styles.passwordField} ${hasError ? styles.passwordFieldError : ''}`}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => handleBlur('password')}
            required
            disabled={isLoading}
            placeholder=" "
            aria-invalid={!!hasError}
            aria-describedby={hasError ? 'login-password-error' : undefined}
          />
          {password.length > 0 && (
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          )}
        </div>
        {hasError && (
          <p id="login-password-error" className={styles.fieldError} role="alert">
            {fieldErrors.password}
          </p>
        )}
      </div>
    );
  };

  const renderSignupPasswordField = () => {
    const hasError = touched.password && fieldErrors.password;
    return (
      <div className={styles.passwordWrapper}>
        <span className={styles.fieldLabel}>Password</span>
        <div className={styles.passwordInputWrapper}>
          <input
            id="signup-password"
            className={`${styles.passwordField} ${hasError ? styles.passwordFieldError : ''}`}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => handleBlur('password')}
            required
            disabled={isLoading}
            placeholder=" "
            aria-invalid={!!hasError}
            aria-describedby={hasError ? 'signup-password-error' : undefined}
          />
          {password.length > 0 && (
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          )}
        </div>
        {hasError && (
          <p id="signup-password-error" className={styles.fieldError} role="alert">
            {fieldErrors.password}
          </p>
        )}
        {password.length > 0 && (() => {
          const hint = getCurrentPasswordHint(password);
          return hint ? (
            <span key={hint} className={styles.passwordHint}>{hint}</span>
          ) : null;
        })()}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/logo/sitelog_wordmark_color.svg"
            alt="SiteLog"
            width={0}
            height={0}
            className={styles.logoImage}
            priority
          />
        </Link>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.header}>
          {(mode === 'forgot-password' || mode === 'reset-password') && (
            <h1 className={styles.title}>
              {mode === 'forgot-password' && 'Reset your password'}
              {mode === 'reset-password' && 'Enter reset code'}
            </h1>
          )}
          <p className={styles.subtitle}>
            {mode === 'login' && 'Welcome back!'}
            {mode === 'signup' && 'Create your account!'}
            {mode === 'forgot-password' &&
              'Enter your email to receive a 6-digit code.'}
            {mode === 'reset-password' &&
              'Check your email for the 6-digit code.'}
          </p>
        </div>

        {error && (
          <div className={styles.serverError} role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className={styles.successBanner} role="status">
            {success}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {mode === 'signup' && signupStep === 'step1' && (
            <>
              <Input
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={
                  touched.fullName && fieldErrors.fullName
                    ? fieldErrors.fullName
                    : undefined
                }
                required
                disabled={isLoading}
                placeholder=" "
                autoFocus
              />
              <div>
                <span className={styles.fieldLabel}>Role</span>
                <div className={styles.roleCards} style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    className={`${styles.roleCard} ${role === 'project_manager' ? styles.roleCardActive : ''}`}
                    onClick={() => setRole('project_manager')}
                  >
                    Project Manager
                  </button>
                  <button
                    type="button"
                    className={`${styles.roleCard} ${role === 'site_supervisor' ? styles.roleCardActive : ''}`}
                    onClick={() => setRole('site_supervisor')}
                  >
                    Site Supervisor
                  </button>
                </div>
                {touched.role && fieldErrors.role && (
                  <p className={styles.fieldError} style={{ marginTop: 4 }}>
                    {fieldErrors.role}
                  </p>
                )}
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.submitButton}
                  onClick={handleContinueToStep2}
                >
                  Continue <ArrowRight size={20} />
                </button>
                <button
                  type="button"
                  className={styles.link}
                  onClick={() => switchMode('login')}
                >
                  Already have an account? Log in
                </button>
              </div>
            </>
          )}

          {mode === 'signup' && signupStep === 'step2' && (
            <>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur('email')}
                error={
                  touched.email && fieldErrors.email
                    ? fieldErrors.email
                    : undefined
                }
                required
                disabled={isLoading}
                placeholder=" "
                autoFocus
              />
              {renderSignupPasswordField()}
              <div className={styles.actions}>
                {renderSubmitButton('Create account')}
                <button
                  type="button"
                  className={styles.backLink}
                  onClick={() => {
                    setSignupStep('step1');
                    setTouched({});
                    setFieldErrors({});
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  className={styles.link}
                  onClick={() => switchMode('login')}
                >
                  Already have an account? Log in
                </button>
              </div>
            </>
          )}

          {(mode === 'login' ||
            mode === 'forgot-password' ||
            mode === 'reset-password') && (
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={
                mode === 'login'
                  ? handleEmailChange
                  : (e) => setEmail(e.target.value)
              }
              onBlur={mode === 'login' ? () => handleBlur('email') : undefined}
              error={
                mode === 'login' && touched.email ? fieldErrors.email : undefined
              }
              required
              disabled={isLoading || mode === 'reset-password'}
              placeholder=" "
              autoFocus
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
              placeholder=" "
            />
          )}

          {mode === 'login' && renderLoginPasswordField()}

          {mode === 'reset-password' && (
            <div className={styles.passwordWrapper}>
              <span className={styles.fieldLabel}>New Password</span>
              <div className={styles.passwordInputWrapper}>
                <input
                  id="reset-password"
                  className={`${styles.passwordField} ${touched.password && fieldErrors.password ? styles.passwordFieldError : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!e.target.value) setShowPassword(false);
                  }}
                  onBlur={() => handleBlur('password')}
                  required
                  disabled={isLoading}
                  placeholder=" "
                  aria-invalid={!!(touched.password && fieldErrors.password)}
                />
                {password.length > 0 && (
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                )}
              </div>
              {touched.password && fieldErrors.password && (
                <p className={styles.fieldError} role="alert">
                  {fieldErrors.password}
                </p>
              )}
              {password.length > 0 && (() => {
                const hint = getCurrentPasswordHint(password);
                return hint ? (
                  <span key={hint} className={styles.passwordHint}>{hint}</span>
                ) : null;
              })()}
            </div>
          )}

          {(mode === 'login' ||
            mode === 'forgot-password' ||
            mode === 'reset-password') && (
            <div className={styles.actions}>
              {mode === 'login' && renderSubmitButton('Sign in')}
              {mode === 'forgot-password' && renderSubmitButton('Send Code')}
              {mode === 'reset-password' &&
                renderSubmitButton('Reset Password')}

              {mode === 'login' && (
                <button
                  type="button"
                  className={styles.link}
                  onClick={() => switchMode('signup')}
                >
                  Don&apos;t have an account? Sign up
                </button>
              )}

              {(mode === 'forgot-password' || mode === 'reset-password') && (
                <button
                  type="button"
                  className={styles.link}
                  onClick={() => switchMode('login')}
                >
                  Back to log in
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
