import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runWorkflow } from "@/lib/workflow/pipeline";

const schema = z.object({
  projectId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId } = schema.parse(body);

    const result = await runWorkflow(projectId, "user");
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Workflow failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
