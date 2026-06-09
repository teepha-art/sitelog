import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { uploadFile } from '@/lib/storage';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file provided' }, { status: 400 });
    }

    const fileUrl = await uploadFile(file);

    return NextResponse.json({ ok: true, data: { fileUrl } });
  } catch (error) {
    console.error('Profile image upload error:', error);
    return NextResponse.json({ ok: false, error: 'Upload failed' }, { status: 500 });
  }
}
