const { execSync } = require("child_process");

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit", env: process.env });
}

const dbUrl =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL;

run("node scripts/prepare-prisma.js");
run("npx prisma generate");

if (dbUrl) {
  try {
    run("npx prisma db push --skip-generate --accept-data-loss");
    console.log("Database schema synced successfully.");
    try {
      run("npx tsx prisma/seed.ts");
      console.log("Demo project seeded successfully.");
    } catch (seedError) {
      console.warn("Warning: demo seed failed during build. Will retry at runtime.");
      console.warn(seedError.message ?? seedError);
    }
  } catch (error) {
    console.warn("Warning: prisma db push failed during build. Will retry at runtime.");
    console.warn(error.message ?? error);
  }
} else {
  console.warn(
    "No DATABASE_URL or POSTGRES_PRISMA_URL found. Skipping db push.\n" +
      "Add Vercel Postgres under Storage, then redeploy."
  );
}

run("npx next build");
