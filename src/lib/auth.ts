import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { env } from './env';
import { Role } from '@prisma/client';

export type SessionPayload = {
  userId: string;
  role: Role;
  expiresAt: Date;
};

const encodedKey = new TextEncoder().encode(env.SESSION_SECRET);

export async function createSession(userId: string, role: Role) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const session = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(encodedKey);

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && env.NEXT_PUBLIC_APP_URL.startsWith('https://'),
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  if (!sessionCookie) return null;

  try {
    const { payload } = await jwtVerify(sessionCookie.value, encodedKey, {
      algorithms: ['HS256'],
    });
    return {
      userId: payload.userId as string,
      role: payload.role as Role,
      expiresAt: new Date((payload.exp as number) * 1000),
    };
  } catch (error) {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
