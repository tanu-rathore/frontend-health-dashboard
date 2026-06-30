import { db } from "@/lib/db";
import { metrics } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { moduleId } = await params;

    const moduleMetrics = await db
      .select()
      .from(metrics)
      .where(eq(metrics.moduleId, moduleId))
      .orderBy(desc(metrics.recordedAt));

    return NextResponse.json(moduleMetrics);
  } catch (error) {
    console.error("Failed to fetch metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}