import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signupSchema } from '@/lib/validation';
import { createSession } from '@/lib/auth';
import { generateInviteCode } from '@/lib/inviteCode';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validate
    const result = signupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: { code: 'BAD_REQUEST', message: 'Please complete all required fields correctly.' } },
        { status: 400 }
      );
    }
    
    const { fullName, email, password, role } = result.data;

    // 2. Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: { code: 'CONFLICT', message: 'An account with this email already exists.' } },
        { status: 409 }
      );
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Generate invite code for PMs
    let inviteCode: string | undefined;
    if (role === 'project_manager') {
      inviteCode = await generateInviteCode();
    }

    // 5. Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        email: email.toLowerCase(),
        passwordHash,
        role,
        isActive: true,
        inviteCode,
      },
    });

    // 6. Create session
    await createSession(user.id, user.role);

    return NextResponse.json({ ok: true, data: { id: user.id, role: user.role } });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } },
      { status: 500 }
    );
  }
}
