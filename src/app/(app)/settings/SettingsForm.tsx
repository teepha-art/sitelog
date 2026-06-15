'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Card } from '@/components/ui/Card';
import { updateProfile, changePassword } from '@/lib/actions/profile';
import { MAX_FILE_SIZE_BYTES, ACCEPTED_IMAGE_TYPES } from '@/lib/constants';

const ROLE_LABELS: Record<string, string> = {
  project_manager: 'Project Manager',
  site_supervisor: 'Site Supervisor',
};

export function SettingsForm({ user }: { user: { fullName: string; email: string; role: string; createdAt: Date; profileImageUrl: string | null } }) {
  const [fullName, setFullName] = useState(user.fullName);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(false);

    const result = await updateProfile(fullName, profileImageUrl ?? undefined);
    if (result.ok) {
      setProfileSuccess(true);
    } else {
      setProfileError(result.error.message);
    }
    setIsProfileLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    const result = await changePassword(currentPassword, newPassword);
    if (result.ok) {
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setPasswordError(result.error.message);
    }
    setIsPasswordLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card padding="lg">
        {profileSuccess && (
          <div style={{ padding: '12px', backgroundColor: 'var(--color-success-container)', color: 'var(--color-on-success-container)', borderRadius: '8px', marginBottom: '24px' }}>
            Profile updated successfully.
          </div>
        )}
        {profileError && (
          <div style={{ padding: '12px', backgroundColor: 'var(--color-error-container)', color: 'var(--color-on-error-container)', borderRadius: '8px', marginBottom: '24px' }}>
            {profileError}
          </div>
        )}
        {uploadError && (
          <div style={{ padding: '12px', backgroundColor: 'var(--color-error-container)', color: 'var(--color-on-error-container)', borderRadius: '8px', marginBottom: '24px' }}>
            {uploadError}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

          <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={isProfileLoading} />
          <div>
            <div style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-label-small-font-size)', textTransform: 'uppercase', marginBottom: '4px' }}>Email</div>
            <div style={{ fontSize: 'var(--font-title-medium-font-size)' }}>{user.email}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-label-small-font-size)', textTransform: 'uppercase', marginBottom: '4px' }}>Role</div>
            <div style={{ fontSize: 'var(--font-title-medium-font-size)' }}>{ROLE_LABELS[user.role]}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-label-small-font-size)', textTransform: 'uppercase', marginBottom: '4px' }}>Account Created</div>
            <div style={{ fontSize: 'var(--font-title-medium-font-size)' }}>{user.createdAt.toLocaleDateString()}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" loading={isProfileLoading}>Save Changes</Button>
          </div>
        </form>
      </Card>

      <Card padding="lg">
        <h2 style={{ fontFamily: 'var(--font-title-large-font-family)', marginBottom: '24px' }}>Change Password</h2>
        
        {passwordSuccess && (
          <div style={{ padding: '12px', backgroundColor: 'var(--color-success-container)', color: 'var(--color-on-success-container)', borderRadius: '8px', marginBottom: '24px' }}>
            Password changed successfully.
          </div>
        )}
        {passwordError && (
          <div style={{ padding: '12px', backgroundColor: 'var(--color-error-container)', color: 'var(--color-on-error-container)', borderRadius: '8px', marginBottom: '24px' }}>
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <PasswordInput label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required disabled={isPasswordLoading} autoComplete="current-password" />
          <PasswordInput label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={isPasswordLoading} autoComplete="new-password" />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" loading={isPasswordLoading}>Change Password</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}