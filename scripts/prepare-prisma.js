const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");

const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL ??
  "";

const provider = databaseUrl.startsWith("file:") ? "sqlite" : "postgresql";

let schema = fs.readFileSync(schemaPath, "utf8");
schema = schema.replace(
  /provider\s*=\s*"(sqlite|postgresql)"/,
  `provider = "${provider}"`
);

fs.writeFileSync(schemaPath, schema);
console.log(`Prisma provider set to: ${provider}`);
if (databaseUrl) {
  console.log(`Database URL detected (${databaseUrl.slice(0, 12)}...)`);
} else {
  console.warn("Warning: No DATABASE_URL or POSTGRES_PRISMA_URL found.");
}
