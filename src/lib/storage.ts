import { mkdir, writeFile } from "fs/promises";
import path from "path";

const IS_VERCEL = process.env.VERCEL === "1";

export function shouldStoreInDatabase(): boolean {
  return IS_VERCEL || process.env.STORE_FILES_IN_DB === "true";
}

export async function persistFile(
  projectId: string,
  fileName: string,
  buffer: Buffer
): Promise<{ filePath: string; fileData: Buffer | null }> {
  if (shouldStoreInDatabase()) {
    return {
      filePath: `db://${projectId}/${fileName}`,
      fileData: buffer,
    };
  }

  const uploadDir = path.join(process.cwd(), "uploads", projectId);
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return {
    filePath: path.relative(process.cwd(), filePath),
    fileData: null,
  };
}
