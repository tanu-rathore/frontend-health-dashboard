"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Module } from "@/types/metrics";

interface AddMetricModalProps {
  module: Module;
}

export default function AddMetricModal({ module }: AddMetricModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [bundleSizeKb, setBundleSizeKb] = useState("");
  const [renderTimeMs, setRenderTimeMs] = useState("");
  const [lighthouseScore, setLighthouseScore] = useState("");
  const [clsScore, setClsScore] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!bundleSizeKb || !renderTimeMs || !lighthouseScore || !clsScore) {
      setError("All fields are required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: module.id,
          bundleSizeKb: parseFloat(bundleSizeKb),
          renderTimeMs: parseFloat(renderTimeMs),
          lighthouseScore: parseFloat(lighthouseScore),
          clsScore: parseFloat(clsScore),
        }),
      });

      if (!res.ok) throw new Error("Failed to add metric");

      setOpen(false);
      setBundleSizeKb("");
      setRenderTimeMs("");
      setLighthouseScore("");
      setClsScore("");
      router.refresh();
      window.location.reload();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mt-3">
          + Add Metric
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Metric — {module.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Bundle Size (kb)
              </label>
              <Input
                type="number"
                placeholder="e.g. 245"
                value={bundleSizeKb}
                onChange={(e) => setBundleSizeKb(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Render Time (ms)
              </label>
              <Input
                type="number"
                placeholder="e.g. 120"
                value={renderTimeMs}
                onChange={(e) => setRenderTimeMs(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Lighthouse Score
              </label>
              <Input
                type="number"
                placeholder="e.g. 92"
                value={lighthouseScore}
                onChange={(e) => setLighthouseScore(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                CLS Score
              </label>
              <Input
                type="number"
                placeholder="e.g. 0.05"
                value={clsScore}
                onChange={(e) => setClsScore(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Save Metric"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}