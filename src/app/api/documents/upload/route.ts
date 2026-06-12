import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { createAuditLog } from "@/lib/audit/logger";
import { emitEvent } from "@/lib/events/bus";
import {
  ALLOWED_MIME_TYPES,
  hashFileContent,
  MAX_FILE_SIZE,
  sanitizeFileName,
} from "@/lib/security/encryption";
import type { DocumentType } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("projectId") as string | null;
    const documentType = formData.get("type") as DocumentType | null;

    if (!file || !projectId || !documentType) {
      return NextResponse.json(
        { error: "file, projectId, and type are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    const allowedMimes = ALLOWED_MIME_TYPES[documentType];
    if (!allowedMimes?.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type for ${documentType}. Allowed: ${allowedMimes?.join(", ")}` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileHash = hashFileContent(buffer);
    const safeName = sanitizeFileName(file.name);
    const uniqueName = `${Date.now()}_${safeName}`;

    const uploadDir = path.join(process.cwd(), "uploads", projectId);
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const document = await prisma.document.create({
      data: {
        projectId,
        type: documentType,
        fileName: file.name,
        filePath: path.relative(process.cwd(), filePath),
        fileHash,
        fileSize: file.size,
        mimeType: file.type,
        status: "uploaded",
        metadata: JSON.stringify({
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        }),
      },
    });

    await createAuditLog({
      projectId,
      documentId: document.id,
      action: "document_uploaded",
      actor: "user",
      details: {
        type: documentType,
        fileName: file.name,
        fileHash,
        fileSize: file.size,
      },
      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
    });

    emitEvent("document_upload", projectId, {
      documentId: document.id,
      type: documentType,
      fileName: file.name,
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
