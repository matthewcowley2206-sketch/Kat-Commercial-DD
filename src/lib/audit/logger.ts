import { prisma } from "@/lib/db";
import { generateAuditHash } from "@/lib/security/encryption";

export interface AuditEntry {
  projectId?: string;
  documentId?: string;
  action: string;
  actor?: string;
  details: Record<string, unknown>;
  ipAddress?: string;
}

export async function createAuditLog(entry: AuditEntry) {
  const lastLog = await prisma.auditLog.findFirst({
    where: entry.projectId ? { projectId: entry.projectId } : undefined,
    orderBy: { createdAt: "desc" },
  });

  const timestamp = new Date().toISOString();
  const detailsStr = JSON.stringify(entry.details);
  const hash = generateAuditHash(
    entry.action,
    detailsStr,
    lastLog?.hash ?? null,
    timestamp
  );

  return prisma.auditLog.create({
    data: {
      projectId: entry.projectId,
      documentId: entry.documentId,
      action: entry.action,
      actor: entry.actor ?? "system",
      details: detailsStr,
      hash,
      prevHash: lastLog?.hash ?? null,
      ipAddress: entry.ipAddress,
    },
  });
}

export async function verifyAuditChain(projectId: string): Promise<{
  valid: boolean;
  totalEntries: number;
  brokenAt?: string;
}> {
  const logs = await prisma.auditLog.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });

  if (logs.length === 0) {
    return { valid: true, totalEntries: 0 };
  }

  let prevHash: string | null = null;

  for (const log of logs) {
    const expectedHash = generateAuditHash(
      log.action,
      log.details,
      prevHash,
      log.createdAt.toISOString()
    );

    if (log.hash !== expectedHash) {
      return { valid: false, totalEntries: logs.length, brokenAt: log.id };
    }

    prevHash = log.hash;
  }

  return { valid: true, totalEntries: logs.length };
}
