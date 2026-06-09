import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validation';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validate
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: { code: 'BAD_REQUEST', message: 'Please complete all required fields correctly.' } },
        { status: 400 }
      );
    }
    
    const { email, password } = result.data;

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: { code: 'UNAUTHORIZED', message: 'Incorrect email or password. Please try again.' } },
        { status: 401 }
      );
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { ok: false, error: { code: 'UNAUTHORIZED', message: 'Incorrect email or password. Please try again.' } },
        { status: 401 }
      );
    }

    // 4. Check active status
    if (!user.isActive) {
      return NextResponse.json(
        { ok: false, error: { code: 'FORBIDDEN', message: 'Your account is not active. Please contact your project manager.' } },
        { status: 403 }
      );
    }

    // 5. Create session & update last login
    await createSession(user.id, user.role);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return NextResponse.json({ ok: true, data: { id: user.id, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } },
      { status: 500 }
    );
  }
}
