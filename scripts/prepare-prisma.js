const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
const isVercel = process.env.VERCEL === "1";

const postgresUrl =
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL ??
  (process.env.DATABASE_URL?.startsWith("postgres") ? process.env.DATABASE_URL : null);

const sqliteUrl =
  !isVercel && process.env.DATABASE_URL?.startsWith("file:")
    ? process.env.DATABASE_URL
    : null;

const databaseUrl = isVercel ? (postgresUrl ?? "") : (sqliteUrl ?? postgresUrl ?? "");
const provider = databaseUrl.startsWith("file:") ? "sqlite" : "postgresql";

let schema = fs.readFileSync(schemaPath, "utf8");
schema = schema.replace(
  /provider\s*=\s*"(sqlite|postgresql)"/,
  `provider = "${provider}"`
);

fs.writeFileSync(schemaPath, schema);
console.log(`Prisma provider set to: ${provider}`);

if (isVercel) {
  if (postgresUrl) {
    console.log("Vercel: Postgres URL detected.");
  } else {
    console.warn(
      "Vercel: No Postgres URL found. Add Vercel Postgres under Storage → Connect to project."
    );
    console.warn(
      "Do NOT set DATABASE_URL to file:./dev.db on Vercel — that only works locally."
    );
  }
} else if (databaseUrl) {
  console.log(`Database URL detected (${databaseUrl.slice(0, 14)}...)`);
}
