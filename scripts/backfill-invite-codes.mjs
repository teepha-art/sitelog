import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CODE_LENGTH = 6;
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function randomSegment() {
  let result = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}

async function generateCode() {
  for (let attempt = 0; attempt < 100; attempt++) {
    const code = `SL-${randomSegment()}`;
    const existing = await prisma.user.findUnique({ where: { inviteCode: code } });
    if (!existing) return code;
  }
  throw new Error('Failed to generate unique invite code');
}

async function main() {
  const pmWithoutCodes = await prisma.user.findMany({
    where: {
      role: 'project_manager',
      inviteCode: null,
    },
  });

  if (pmWithoutCodes.length === 0) {
    console.log('All existing PMs already have invite codes.');
    return;
  }

  console.log(`Found ${pmWithoutCodes.length} PM(s) without invite codes.`);

  for (const pm of pmWithoutCodes) {
    const code = await generateCode();
    await prisma.user.update({
      where: { id: pm.id },
      data: { inviteCode: code },
    });
    console.log(`  ${pm.email} -> ${code}`);
  }

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
