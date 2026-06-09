'use client';

import React, { useState, useRef } from 'react';
import { MAX_FILE_SIZE_BYTES, ACCEPTED_IMAGE_TYPES } from '@/lib/constants';

interface FileUploadProps {
  entityType: 'daily_report' | 'issue';
  entityId?: string; // If provided, upload happens immediately. If not, we just hold the file for parent to handle or upload later.
  onFileSelect?: (file: File | null) => void;
  onUploadSuccess?: (url: string) => void;
  label?: string;
  disabled?: boolean;
}

export function FileUpload({ entityType, entityId, onFileSelect, onUploadSuccess, label = "Attach Photo", disabled }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      if (onFileSelect) onFileSelect(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setError('File exceeds the 5MB size limit.');
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type)) {
      setError('Please upload a valid image (JPEG, PNG, WEBP) or PDF.');
      return;
    }

    setFile(selectedFile);
    if (onFileSelect) onFileSelect(selectedFile);

    // Create preview
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    } else {
      setPreview(null); // No preview for PDF
    }

    // If entityId is provided, upload immediately
    if (entityId) {
      await uploadFile(selectedFile, entityId);
    }
  };

  const uploadFile = async (fileToUpload: File, id: string) => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('entityType', entityType);
    formData.append('entityId', id);

    try {
      const res = await fetch('/api/attachments', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (result.ok) {
        if (onUploadSuccess) onUploadSuccess(result.data.fileUrl);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ 
        fontFamily: 'var(--font-label-medium-font-family)', 
        fontSize: 'var(--font-label-medium-font-size)',
        color: 'var(--color-on-surface)' 
      }}>
        {label}
      </label>

      {!file && (
        <div 
          onClick={() => !disabled && fileInputRef.current?.click()}
          style={{ 
            border: '2px dashed var(--color-outline-variant)',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            backgroundColor: disabled ? 'var(--color-surface-variant)' : 'var(--color-surface)',
            color: 'var(--color-on-surface-variant)',
            transition: 'border-color 0.2s ease',
          }}
          onMouseEnter={(e) => !disabled && (e.currentTarget.style.borderColor = 'var(--color-primary)')}
          onMouseLeave={(e) => !disabled && (e.currentTarget.style.borderColor = 'var(--color-outline-variant)')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px auto' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <div>Tap to browse or take a photo</div>
          <div style={{ fontSize: 'var(--font-body-small-font-size)', marginTop: '4px' }}>Max 5MB (JPG, PNG, PDF)</div>
        </div>
      )}

      {file && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '12px', 
          border: '1px solid var(--color-outline-variant)', 
          borderRadius: '8px',
          backgroundColor: 'var(--color-surface)'
        }}>
          {preview ? (
            <img src={preview} alt="Preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
          ) : (
            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-surface-variant)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              PDF
            </div>
          )}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: 'var(--font-label-medium-font-size)' }}>
              {file.name}
            </div>
            <div style={{ fontSize: 'var(--font-body-small-font-size)', color: 'var(--color-on-surface-variant)' }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
          {!isUploading && !disabled && (
            <button 
              type="button" 
              onClick={handleClear}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--color-on-surface-variant)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          )}
          {isUploading && (
            <div style={{ padding: '8px' }}>
              <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid var(--color-outline-variant)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ color: 'var(--color-error)', fontSize: 'var(--font-body-small-font-size)' }}>
          {error}
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        style={{ display: 'none' }} 
        disabled={disabled || isUploading}
      />
    </div>
  );
}
