import { db } from "@/lib/db";
import { metrics } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newMetric = await db
      .insert(metrics)
      .values({
        moduleId: body.moduleId,
        bundleSizeKb: body.bundleSizeKb,
        renderTimeMs: body.renderTimeMs,
        lighthouseScore: body.lighthouseScore,
        clsScore: body.clsScore,
      })
      .returning();

    return NextResponse.json(newMetric[0], { status: 201 });
  } catch (error) {
    console.error("Failed to insert metric:", error);
    return NextResponse.json(
      { error: "Failed to insert metric" },
      { status: 500 }
    );
  }
}