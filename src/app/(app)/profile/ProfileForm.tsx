'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { updateProfile } from '@/lib/actions/profile';
import { MAX_FILE_SIZE_BYTES, ACCEPTED_IMAGE_TYPES } from '@/lib/constants';

const ROLE_LABELS: Record<string, string> = {
  project_manager: 'Project Manager',
  site_supervisor: 'Site Supervisor',
};

export function ProfileForm({ user }: { user: { fullName: string; email: string; role: string; createdAt: Date; profileImageUrl: string | null } }) {
  const [fullName, setFullName] = useState(user.fullName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(user.profileImageUrl);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError('File exceeds the 5MB size limit.');
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setUploadError('Please upload a valid image (JPEG, PNG, WEBP).');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/profile/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (result.ok) {
        setProfileImageUrl(result.data.fileUrl);
      } else {
        setUploadError(result.error || 'Upload failed.');
      }
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const result = await updateProfile(fullName, profileImageUrl ?? undefined);
    if (result.ok) {
      setSuccess(true);
    } else {
      setError(result.error.message);
    }
    setIsLoading(false);
  };

  return (
    <Card padding="lg">
      {success && (
        <div style={{ padding: '12px', backgroundColor: 'var(--color-success-container)', color: 'var(--color-on-success-container)', borderRadius: '8px', marginBottom: '24px' }}>
          Profile updated successfully.
        </div>
      )}
      {error && (
        <div style={{ padding: '12px', backgroundColor: 'var(--color-error-container)', color: 'var(--color-on-error-container)', borderRadius: '8px', marginBottom: '24px' }}>
          {error}
        </div>
      )}
      {uploadError && (
        <div style={{ padding: '12px', backgroundColor: 'var(--color-error-container)', color: 'var(--color-on-error-container)', borderRadius: '8px', marginBottom: '24px' }}>
          {uploadError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Profile Image */}
        <div>
          <div style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-label-small-font-size)', textTransform: 'uppercase', marginBottom: '8px' }}>Profile Photo</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              backgroundColor: 'var(--color-primary-container)',
              color: 'var(--color-on-primary-container)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-title-medium-font-family)',
              fontSize: 'var(--font-title-medium-font-size)',
              overflow: 'hidden', flexShrink: 0,
            }}>
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user.fullName.substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfileImageChange}
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                style={{ display: 'none' }}
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                loading={isUploading}
              >
                {profileImageUrl ? 'Change Photo' : 'Upload Photo'}
              </Button>
            </div>
          </div>
        </div>

        <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={isLoading} />
        <div>
          <div style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-label-small-font-size)', textTransform: 'uppercase', marginBottom: '4px' }}>Email</div>
          <div style={{ fontSize: 'var(--font-title-medium-font-size)' }}>{user.email}</div>
        </div>
        <div>
          <div style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-label-small-font-size)', textTransform: 'uppercase', marginBottom: '4px' }}>Role</div>
          <div style={{ fontSize: 'var(--font-title-medium-font-size)' }}>
            {ROLE_LABELS[user.role]}
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-label-small-font-size)', textTransform: 'uppercase', marginBottom: '4px' }}>Account Created</div>
          <div style={{ fontSize: 'var(--font-title-medium-font-size)' }}>{user.createdAt.toLocaleDateString()}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" loading={isLoading}>Save Changes</Button>
        </div>
      </form>
    </Card>
  );
}