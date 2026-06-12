import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getDashboardData } from "@/lib/dashboard/aggregator";
import { verifyAuditChain } from "@/lib/audit/logger";
import { ReportView } from "@/components/ReportView";

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ autoprint?: string }>;
}) {
  const { id } = await params;
  const { autoprint } = await searchParams;

  const dashboard = await getDashboardData(id);
  if (!dashboard) notFound();

  const [checklistItems, auditVerification] = await Promise.all([
    prisma.checklistItem.findMany({
      where: { projectId: id },
      orderBy: [{ priority: "desc" }, { category: "asc" }],
    }),
    verifyAuditChain(id),
  ]);

  return (
    <ReportView
      data={dashboard}
      checklistItems={checklistItems}
      auditVerification={auditVerification}
      autoPrint={autoprint === "1"}
    />
  );
}
