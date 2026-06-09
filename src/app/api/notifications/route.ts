import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { recipientId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const unreadCount = notifications.filter(n => !n.readStatus).length;

    return NextResponse.json({ ok: true, data: { notifications, unreadCount } });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function POST() {
  // Mark all as read
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    await prisma.notification.updateMany({
      where: { recipientId: session.userId, readStatus: false },
      data: { readStatus: true },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
