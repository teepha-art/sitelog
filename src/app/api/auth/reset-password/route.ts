import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resetPasswordSchema } from '@/lib/validation';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validate
    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: { code: 'BAD_REQUEST', message: 'Please complete all required fields correctly.' } },
        { status: 400 }
      );
    }
    
    const { email, code, newPassword } = result.data;

    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't leak that the email doesn't exist, just say invalid code
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_CODE', message: 'That code is incorrect. Please check and try again.' } },
        { status: 400 }
      );
    }

    // 3. Verify code and expiry
    if (user.resetCode !== code) {
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_CODE', message: 'That code is incorrect. Please check and try again.' } },
        { status: 400 }
      );
    }

    if (!user.resetCodeExpiresAt || user.resetCodeExpiresAt < new Date()) {
      return NextResponse.json(
        { ok: false, error: { code: 'EXPIRED_CODE', message: 'That code has expired. Please request a new one.' } },
        { status: 400 }
      );
    }

    // 4. Hash new password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // 5. Update user and clear reset code
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetCode: null,
        resetCodeExpiresAt: null,
      },
    });

    return NextResponse.json({ ok: true, message: 'Your password has been reset. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } },
      { status: 500 }
    );
  }
}
