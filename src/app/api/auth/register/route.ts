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
    
    const { fullName, email, password, role, inviteCode } = result.data;

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

    // 3. Validate invite code for supervisors
    let managerId: string | undefined;
    if (role === 'site_supervisor') {
      if (!inviteCode) {
        return NextResponse.json(
          { ok: false, error: { code: 'INVALID_INVITE_CODE', field: 'inviteCode', message: 'Invalid invite code — please check the code from your Project Manager.' } },
          { status: 400 }
        );
      }
      const pm = await prisma.user.findUnique({
        where: { inviteCode },
      });
      if (!pm || pm.role !== 'project_manager') {
        return NextResponse.json(
          { ok: false, error: { code: 'INVALID_INVITE_CODE', field: 'inviteCode', message: 'Invalid invite code — please check the code from your Project Manager.' } },
          { status: 400 }
        );
      }
      managerId = pm.id;
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Generate invite code for PMs
    let pmInviteCode: string | undefined;
    if (role === 'project_manager') {
      pmInviteCode = await generateInviteCode();
    }

    // 6. Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        email: email.toLowerCase(),
        passwordHash,
        role,
        isActive: true,
        inviteCode: pmInviteCode,
        managerId,
      },
    });

    // 7. Notify PM if supervisor signed up with invite code
    if (managerId) {
      await prisma.notification.create({
        data: {
          recipientId: managerId,
          type: 'supervisor_joined',
          message: `${fullName} has joined your team.`,
          relatedEntityId: user.id,
          relatedEntityType: 'project',
        }
      });
    }

    // 8. Create session
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
