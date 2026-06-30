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
  iconOnly?: boolean;
}

export default function AddMetricModal({
  module,
  iconOnly = false,
}: AddMetricModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [bundleSizeKb, setBundleSizeKb] = useState("");
  const [renderTimeMs, setRenderTimeMs] = useState("");
  const [lighthouseScore, setLighthouseScore] = useState("");
  const [clsScore, setClsScore] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!bundleSizeKb || !renderTimeMs || !lighthouseScore || !clsScore) {
      setError("All fields are required");
      return false;
    }
    if (parseFloat(bundleSizeKb) <= 0) {
      setError("Bundle size must be greater than 0");
      return false;
    }
    if (parseFloat(renderTimeMs) <= 0) {
      setError("Render time must be greater than 0");
      return false;
    }
    if (parseFloat(lighthouseScore) < 0 || parseFloat(lighthouseScore) > 100) {
      setError("Lighthouse score must be between 0 and 100");
      return false;
    }
    if (parseFloat(clsScore) < 0 || parseFloat(clsScore) > 1) {
      setError("CLS score must be between 0 and 1");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
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
        {iconOnly ? (
          <button className="w-6 h-6 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center text-sm font-medium">
            +
          </button>
        ) : (
          <Button variant="outline" size="sm" className="w-full mt-3">
            + Add Metric
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Metric — {module.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Bundle Size (kb) <span className="text-red-500">*</span>
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
                Render Time (ms) <span className="text-red-500">*</span>
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
                Lighthouse Score <span className="text-red-500">*</span>
                <span className="text-xs ml-1">(0–100)</span>
              </label>
              <Input
                type="number"
                placeholder="e.g. 92"
                min={0}
                max={100}
                value={lighthouseScore}
                onChange={(e) => setLighthouseScore(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                CLS Score <span className="text-red-500">*</span>
                <span className="text-xs ml-1">(0–1)</span>
              </label>
              <Input
                type="number"
                placeholder="e.g. 0.05"
                min={0}
                max={1}
                step={0.01}
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