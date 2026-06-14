'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hand, LayoutDashboard, Smartphone, CircleCheck, Check, ArrowRight, Loader2 } from 'lucide-react';
import { Role } from '@prisma/client';
import styles from './OnboardingFlow.module.css';

interface OnboardingFlowProps {
  fullName: string;
  role: Role;
}

export function OnboardingFlow({ fullName, role }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const isPM = role === 'project_manager';
  const firstName = fullName.split(' ')[0] || fullName;

  const steps = [
    {
      icon: Hand,
      heading: `Welcome, ${firstName} 😊`,
    },
    {
      icon: isPM ? LayoutDashboard : Smartphone,
      heading: isPM ? 'Oversee every site' : 'Report from the field',
      body: isPM
        ? 'Track every site in real time.'
        : 'Report, log, and request — from your phone.',
    },
    {
      icon: CircleCheck,
      heading: isPM ? "You're all set 🎉" : "You're ready 🎉",
      body: isPM
        ? 'Start your first project.'
        : 'Submit your first report.',
    },
  ];

  const completeOnboarding = async () => {
    setIsCompleting(true);
    try {
      await fetch('/api/onboarding/complete', { method: 'POST' });
    } catch {
      // Proceed even if the request fails
    }
  };

  const enterApp = async () => {
    await completeOnboarding();
    router.push(isPM ? '/dashboard' : '/projects');
  };

  const handleContinue = async () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      await enterApp();
    }
  };

  const handleSkip = async () => {
    if (step === steps.length - 1) {
      await enterApp();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const currentStep = steps[step];
  const StepIcon = currentStep.icon;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Step indicator */}
        <div className={styles.stepIndicator}>
          {steps.map((_, i) => (
            <div key={i} className={styles.stepDotGroup}>
              <div
                className={`${styles.stepDot} ${
                  i < step ? styles.completed : i === step ? styles.active : styles.upcoming
                }`}
                aria-current={i === step ? 'step' : undefined}
              >
                {i < step ? (
                  <Check size={16} strokeWidth={3} />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`${styles.stepLine} ${
                    i < step ? styles.lineCompleted : ''
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div key={step} className={styles.content}>
          <div className={styles.iconCircle}>
            <StepIcon size={32} />
          </div>
          <h1 className={styles.heading}>{currentStep.heading}</h1>
          {currentStep.body && <p className={styles.body}>{currentStep.body}</p>}
        </div>

        {/* Buttons */}
        <div className={styles.buttons}>
          <button
            className={styles.primaryButton}
            onClick={handleContinue}
            disabled={isCompleting}
          >
            {isCompleting
              ? (<><Loader2 size={20} className={styles.spinner} /> Please wait...</>)
              : (
                <>
                  {step < steps.length - 1 ? 'Continue' : isPM ? 'Go to dashboard' : 'View my projects'}
                  {step < steps.length - 1 && <ArrowRight size={20} />}
                </>
              )}
          </button>

          {step > 0 && (
            <div className={styles.secondaryRow}>
              <button
                type="button"
                className={styles.backLink}
                onClick={handleBack}
                disabled={isCompleting}
              >
                Back
              </button>
              <button
                type="button"
                className={styles.skipLink}
                onClick={handleSkip}
                disabled={isCompleting}
              >
                Skip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
