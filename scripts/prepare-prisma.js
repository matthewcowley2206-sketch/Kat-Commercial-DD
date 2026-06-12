const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
const databaseUrl = process.env.DATABASE_URL ?? "";

const provider = databaseUrl.startsWith("file:")
  ? "sqlite"
  : "postgresql";

let schema = fs.readFileSync(schemaPath, "utf8");
schema = schema.replace(
  /provider\s*=\s*"(sqlite|postgresql)"/,
  `provider = "${provider}"`
);

fs.writeFileSync(schemaPath, schema);
console.log(`Prisma provider set to: ${provider}`);
