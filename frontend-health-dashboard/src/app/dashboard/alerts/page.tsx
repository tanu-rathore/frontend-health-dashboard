import { db } from "@/lib/db";
import { modules } from "@/lib/schema";
import { Module } from "@/types/metrics";
import AlertsClient from "./AlertsClient";

export default async function AlertsPage() {
  const allModules = await db.select().from(modules);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <a
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
          ← Back to Dashboard
        </a>
        <h1 className="text-2xl font-semibold mt-2">Alerts Configuration</h1>
        <p className="text-muted-foreground mt-1">
          Set thresholds for each module — get notified when metrics exceed limits
        </p>
      </div>
      <AlertsClient modules={allModules as Module[]} />
    </main>
  );
}