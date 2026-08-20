import { prisma } from "../lib/prisma";
import { ensureSeeded } from "../lib/cms/store";

async function main() {
  await ensureSeeded();
  const [projects, articles, services, team] = await Promise.all([
    prisma.project.count(),
    prisma.article.count(),
    prisma.service.count(),
    prisma.teamMember.count(),
  ]);
  console.log(`PostgreSQL prêt : ${projects} projets, ${articles} articles, ${services} services, ${team} membres.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
