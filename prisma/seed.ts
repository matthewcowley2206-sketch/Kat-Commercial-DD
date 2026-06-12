import { ensureDemoProject } from "../src/lib/demo/ensure-demo";
import { prisma } from "../src/lib/db";

async function main() {
  const id = await ensureDemoProject();
  if (id) {
    console.log(`Demo project ready: ${id}`);
  } else {
    console.error("Failed to create demo project");
    process.exitCode = 1;
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
