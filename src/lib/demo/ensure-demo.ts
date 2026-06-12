import { prisma } from "@/lib/db";
import { createAuditLog } from "@/lib/audit/logger";
import { hashString } from "@/lib/security/encryption";
import { runWorkflow } from "@/lib/workflow/pipeline";
import { DEMO_PROJECT_NAME } from "@/lib/demo/constants";
import type { DocumentType } from "@/types";

const DEMO_DOCUMENTS: { type: DocumentType; fileName: string; mimeType: string }[] = [
  {
    type: "financial_statement",
    fileName: "FY24_Rent_Roll_Outgoings.xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  {
    type: "lease_agreement",
    fileName: "Head_Lease_and_Tenancy_Schedule.pdf",
    mimeType: "application/pdf",
  },
  {
    type: "property_valuation",
    fileName: "Independent_Valuation_RICS_May2024.pdf",
    mimeType: "application/pdf",
  },
  {
    type: "environmental",
    fileName: "Phase1_ESA_and_Asbestos_Register.pdf",
    mimeType: "application/pdf",
  },
  {
    type: "legal_compliance",
    fileName: "Title_Search_FIRB_and_NCC_Certificates.pdf",
    mimeType: "application/pdf",
  },
];

function isDemoReady(project: {
  status: string;
  _count: { documents: number; checklistItems: number; workflowRuns: number };
}): boolean {
  return (
    project.status === "complete" &&
    project._count.documents >= DEMO_DOCUMENTS.length &&
    project._count.checklistItems >= 20 &&
    project._count.workflowRuns >= 5
  );
}

async function createDemoDocuments(projectId: string) {
  for (const doc of DEMO_DOCUMENTS) {
    const hash = hashString(`kat-demo-${doc.type}-${doc.fileName}`);
    await prisma.document.create({
      data: {
        projectId,
        type: doc.type,
        fileName: doc.fileName,
        filePath: `demo/${doc.type}/${doc.fileName}`,
        fileHash: hash,
        fileSize: 52_480,
        mimeType: doc.mimeType,
        status: "uploaded",
        processedAt: new Date(),
        metadata: JSON.stringify({
          demo: true,
          source: "seed",
          note: "Sample document for demonstration purposes",
        }),
      },
    });
  }
}

export async function ensureDemoProject(): Promise<string | null> {
  try {
    const existing = await prisma.project.findFirst({
      where: { name: DEMO_PROJECT_NAME },
      include: {
        _count: {
          select: { documents: true, checklistItems: true, workflowRuns: true },
        },
      },
    });

    if (existing && isDemoReady(existing)) {
      return existing.id;
    }

    if (existing) {
      await prisma.project.delete({ where: { id: existing.id } });
    }

    const project = await prisma.project.create({
      data: {
        name: DEMO_PROJECT_NAME,
        propertyAddress: "200 Collins Street, Melbourne VIC 3000",
        propertyType: "office",
        state: "VIC",
        purchasePrice: 45_000_000,
        status: "draft",
      },
    });

    await createDemoDocuments(project.id);

    await createAuditLog({
      projectId: project.id,
      action: "project_created",
      actor: "demo",
      details: { demo: true, name: DEMO_PROJECT_NAME },
    });

    await runWorkflow(project.id, "demo-seed");

    return project.id;
  } catch (error) {
    console.error("ensureDemoProject failed:", error);
    return null;
  }
}
