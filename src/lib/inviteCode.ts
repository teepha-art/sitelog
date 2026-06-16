import { prisma } from '@/lib/prisma';

const CODE_LENGTH = 6;
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateRandomSegment(): string {
  let result = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}

export async function generateInviteCode(): Promise<string> {
  for (let attempt = 0; attempt < 100; attempt++) {
    const code = `SL-${generateRandomSegment()}`;
    const existing = await prisma.user.findUnique({ where: { inviteCode: code } });
    if (!existing) return code;
  }
  throw new Error('Failed to generate a unique invite code after 100 attempts');
}
