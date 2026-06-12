import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { uploadFile } from '@/lib/storage';
import { MAX_FILE_SIZE_BYTES, ACCEPTED_IMAGE_TYPES } from '@/lib/constants';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const entityType = formData.get('entityType') as string;
    const entityId = formData.get('entityId') as string;

    if (!file || !entityType || !entityId) {
      return NextResponse.json({ ok: false, error: 'Missing file or entity details' }, { status: 400 });
    }

    if (entityType !== 'daily_report' && entityType !== 'issue') {
      return NextResponse.json({ ok: false, error: 'Invalid entity type' }, { status: 400 });
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ ok: false, error: 'Only image files are allowed.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ ok: false, error: 'File must be 5MB or smaller.' }, { status: 400 });
    }

    // Check authorization to the entity
    if (entityType === 'daily_report') {
      const report = await prisma.dailyReport.findUnique({ where: { id: entityId } });
      if (!report || (session.role === 'site_supervisor' && report.submittedBy !== session.userId)) {
        return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
      }
    } else if (entityType === 'issue') {
      const issue = await prisma.issue.findUnique({ where: { id: entityId }, include: { project: true } });
      if (!issue) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
      if (session.role === 'site_supervisor') {
        const isMember = await prisma.projectMembership.findUnique({
          where: { projectId_userId: { projectId: issue.projectId, userId: session.userId } }
        });
        if (!isMember) return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
      } else if (session.role === 'project_manager') {
        if (issue.project.assignedProjectManager !== session.userId) return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
      }
    }

    // Upload to Vercel Blob
    const fileUrl = await uploadFile(file);

    // Save to DB — set the correct FK column based on entityType
    const attachment = await prisma.attachment.create({
      data: {
        entityType: entityType as any,
        entityId: entityId,
        reportId: entityType === 'daily_report' ? entityId : null,
        issueId: entityType === 'issue' ? entityId : null,
        fileUrl: fileUrl,
        fileName: file.name,
        fileSizeBytes: file.size,
        mimeType: file.type,
        uploadedBy: session.userId,
      }
    });

    return NextResponse.json({ ok: true, data: attachment });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ ok: false, error: error.message || 'Upload failed' }, { status: 500 });
  }
}
