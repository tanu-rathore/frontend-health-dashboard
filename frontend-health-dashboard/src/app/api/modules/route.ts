import { db } from "@/lib/db";
import { modules } from "@/lib/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allModules = await db.select().from(modules);
    return NextResponse.json(allModules);
  } catch (error) {
    console.error("Failed to fetch modules:", error);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.team || !body.description) {
      return NextResponse.json(
        { error: "name, team and description are required" },
        { status: 400 },
      );
    }

    const newModule = await db
      .insert(modules)
      .values({
        name: body.name,
        team: body.team,
        description: body.description,
      })
      .returning();

    return NextResponse.json(newModule[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create module:", error);
    return NextResponse.json(
      { error: "Failed to create module" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Module id is required" },
        { status: 400 },
      );
    }

    await db.delete(modules).where(eq(modules.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete module:", error);
    return NextResponse.json(
      { error: "Failed to delete module" },
      { status: 500 },
    );
  }
}

