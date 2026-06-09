import { put, del } from '@vercel/blob';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { MAX_FILE_SIZE_BYTES, ACCEPTED_IMAGE_TYPES } from './constants';

export async function uploadFile(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('File exceeds the 5MB size limit.');
  }

  // Basic client-claimed mime-type check first
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type.');
  }

  // To truly validate bytes on edge/serverless without heavy dependencies, 
  // we do a simple magic number check for JPEG, PNG, WEBP, PDF
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer.slice(0, 4));

  const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
  const isWebp = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46; // RIFF
  const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46; // %PDF

  if (!isJpeg && !isPng && !isWebp && !isPdf) {
    throw new Error('Invalid file content. Must be a real image or PDF.');
  }

  const ext = file.name.split('.').pop() || 'bin';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN !== 'vercel_blob_rw_fake_token') {
    const blob = await put(filename, file, { access: 'public' });
    return blob.url;
  }

  // Local dev: save to public/uploads/ so the file is served by Next.js
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(arrayBuffer);
  await writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

export async function deleteFile(url: string): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN !== 'vercel_blob_rw_fake_token') {
    await del(url);
  }
}
