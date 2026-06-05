import { db } from "@/lib/db";
import { modules } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allModules = await db.select().from(modules);
    return NextResponse.json(allModules);
  } catch (error) {
    console.error("Failed to fetch modules:", error);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}