import { db } from "@/lib/db";
import { modules } from "@/lib/schema";
import CompareClient from "./CompareClient";
import { Module } from "@/types/metrics";

export default async function ComparePage() {
  const allModules = await db.select().from(modules);

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <a
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
    
          ← Back to Dashboard
        </a>
        <h1 className="text-2xl font-semibold mt-2">Compare Modules</h1>
        <p className="text-muted-foreground mt-1">
          Select 2 modules to compare their metrics side by side
        </p>
      </div>
      <CompareClient modules={allModules as Module[]} />
    </main>
  );
}