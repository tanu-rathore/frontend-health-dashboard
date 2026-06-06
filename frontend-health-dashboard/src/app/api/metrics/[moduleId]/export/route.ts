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
    const headers = [
      "Date",
      "Bundle Size (kb)",
      "Render Time (ms)",
      "Lighthouse Score",
      "CLS Score",
    ];

    const rows = moduleMetrics.map((m) => [
      new Date(m.recordedAt).toLocaleDateString(),
      m.bundleSizeKb,
      m.renderTimeMs,
      m.lighthouseScore,
      m.clsScore,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="metrics-${moduleId}.csv"`,
      },
    });
  } catch (error) {
    console.error("Failed to export metrics:", error);
    return NextResponse.json(
      { error: "Failed to export metrics" },
      { status: 500 }
    );
  }
}