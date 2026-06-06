import { NextResponse } from "next/server";

export type Alert = {
  id: string;
  moduleId: string;
  moduleName: string;
  metric: string;
  threshold: number;
  createdAt: string;
};

let alerts: Alert[] = [];

export async function GET() {
  return NextResponse.json(alerts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newAlert: Alert = {
    id: crypto.randomUUID(),
    moduleId: body.moduleId,
    moduleName: body.moduleName,
    metric: body.metric,
    threshold: body.threshold,
    createdAt: new Date().toISOString(),
  };
  alerts.push(newAlert);
  return NextResponse.json(newAlert, { status: 201 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  alerts = alerts.filter((a) => a.id !== id);
  return NextResponse.json({ success: true });
}