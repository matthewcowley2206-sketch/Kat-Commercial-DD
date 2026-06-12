import { NextResponse } from "next/server";
import { getRegulatoryStats } from "@/lib/education/stats";

export async function GET() {
  return NextResponse.json(getRegulatoryStats());
}
