import { db } from "@/lib/db";
import { alerts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export type Alert = {
  id: string;
  moduleId: string;
  moduleName: string;
  metric: string;
  threshold: number;
  createdAt: string;
};

export async function GET() {
  try {
    const allAlerts = await db.select().from(alerts);
    return NextResponse.json(allAlerts);
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.moduleId || !body.metric || !body.threshold) {
      return NextResponse.json(
        { error: "moduleId, metric and threshold are required" },
        { status: 400 }
      );
    }

    const newAlert = await db
      .insert(alerts)
      .values({
        moduleId: body.moduleId,
        moduleName: body.moduleName,
        metric: body.metric,
        threshold: body.threshold,
      })
      .returning();

    return NextResponse.json(newAlert[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create alert:", error);
    return NextResponse.json(
      { error: "Failed to create alert" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Alert id is required" },
        { status: 400 }
      );
    }

    await db.delete(alerts).where(eq(alerts.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete alert:", error);
    return NextResponse.json(
      { error: "Failed to delete alert" },
      { status: 500 }
    );
  }
}