import { db } from "@/lib/db";
import { modules } from "@/lib/schema";
import CompareClient from "./CompareClient";
import { Module } from "@/types/metrics";

export default async function ComparePage() {
  const allModules = await db.select().from(modules);

  return (
    <main className="max-w-7xl mx-auto px-6 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Compare Modules</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Select 2 modules to compare their metrics side by side
        </p>
      </div>
      <CompareClient modules={allModules as Module[]} />
    </main>
  );
}