const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  const cols = await p.\("SELECT column_name FROM information_schema.columns WHERE table_name = \ ORDER BY ordinal_position", 'users');
  console.log(JSON.stringify(cols));
  await p.\();
}
main().catch(e => { console.error(e); p.\(); });
