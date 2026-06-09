'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { ActionResult } from '@/types';

export async function updateProfile(fullName: string, profileImageUrl?: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' } };
  }

  if (!fullName || fullName.trim().length < 2) {
    return { ok: false, error: { code: 'BAD_REQUEST', message: 'Full name must be at least 2 characters.' } };
  }

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        fullName: fullName.trim(),
        ...(profileImageUrl !== undefined ? { profileImageUrl } : {}),
      },
    });

    revalidatePath('/settings');
    revalidatePath('/profile');

    return { ok: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } };
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' } };
  }

  const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  });

  const validationResult = passwordSchema.safeParse({ currentPassword, newPassword });
  if (!validationResult.success) {
    return { ok: false, error: { code: 'BAD_REQUEST', message: 'New password must be at least 8 characters.' } };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { passwordHash: true },
    });

    if (!user) {
      return { ok: false, error: { code: 'NOT_FOUND', message: 'User not found.' } };
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'Current password is incorrect.' } };
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: session.userId },
      data: { passwordHash },
    });

    return { ok: true };
  } catch (error) {
    console.error('Change password error:', error);
    return { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } };
  }
}