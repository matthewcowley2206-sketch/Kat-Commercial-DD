import { NextResponse } from "next/server";
import { getRegulationsConfig } from "@/lib/regulations/engine";

export async function GET() {
  return NextResponse.json(getRegulationsConfig());
}
