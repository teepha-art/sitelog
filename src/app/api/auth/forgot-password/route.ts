import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { forgotPasswordSchema } from '@/lib/validation';
import { sendPasswordResetEmail } from '@/lib/email';
import { RESET_CODE_EXPIRY_MINUTES } from '@/lib/constants';

// Rate limiting (simple in-memory for MVP)
const rateLimits = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    // Simple rate limiting: max 3 requests per 15 minutes per IP
    const limit = rateLimits.get(ip);
    if (limit && limit.resetTime > now) {
      if (limit.count >= 3) {
        return NextResponse.json(
          { ok: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests. Please try again later.' } },
          { status: 429 }
        );
      }
      limit.count++;
    } else {
      rateLimits.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 });
    }

    const body = await request.json();
    
    // 1. Validate
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: { code: 'BAD_REQUEST', message: 'Please provide a valid email address.' } },
        { status: 400 }
      );
    }
    
    const { email } = result.data;

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // We always return the same response whether the user exists or not
    // to prevent email enumeration.
    if (user && user.isActive) {
      // 3. Generate 6 digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + RESET_CODE_EXPIRY_MINUTES * 60 * 1000);

      // 4. Save code to user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetCode: code,
          resetCodeExpiresAt: expiresAt,
        },
      });

      // 5. Send email
      await sendPasswordResetEmail(user.email, code).catch((err) => {
        console.error('Failed to send email:', err);
        // Continue anyway to not expose that email sending failed/succeeded based on account existence
      });
    }

    return NextResponse.json({ ok: true, message: 'If an account exists for that email, a reset code has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } },
      { status: 500 }
    );
  }
}
