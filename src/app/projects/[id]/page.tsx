import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getDashboardData } from "@/lib/dashboard/aggregator";
import { ProjectDashboard } from "@/components/ProjectDashboard";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dashboard = await getDashboardData(id);
  if (!dashboard) notFound();

  const checklistItems = await prisma.checklistItem.findMany({
    where: { projectId: id },
    orderBy: [{ priority: "desc" }, { category: "asc" }],
  });

  return (
    <ProjectDashboard
      initialData={dashboard}
      checklistItems={checklistItems}
    />
  );
}
