"use client";

import { useState, useEffect } from "react";
import { Module } from "@/types/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/app/api/alerts/route";

const METRICS = [
  { label: "Bundle Size (kb)", value: "bundleSizeKb" },
  { label: "Render Time (ms)", value: "renderTimeMs" },
  { label: "Lighthouse Score", value: "lighthouseScore" },
  { label: "CLS Score", value: "clsScore" },
];

interface AlertsClientProps {
  modules: Module[];
}

export default function AlertsClient({ modules }: AlertsClientProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [moduleId, setModuleId] = useState("");
  const [metric, setMetric] = useState("");
  const [threshold, setThreshold] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/alerts")
      .then((r) => r.json())
      .then(setAlerts);
  }, []);

  const handleAdd = async () => {
    if (!moduleId || !metric || !threshold) return;
    setSaving(true);
    const mod = modules.find((m) => m.id === moduleId);
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        moduleId,
        moduleName: mod?.name,
        metric,
        threshold: parseFloat(threshold),
      }),
    });
    const newAlert = await res.json();
    setAlerts((prev) => [...prev, newAlert]);
    setModuleId("");
    setMetric("");
    setThreshold("");
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/alerts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add New Alert</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={moduleId} onValueChange={setModuleId}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Select module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {METRICS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Threshold value"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="sm:w-40"
            />

            <Button onClick={handleAdd} disabled={saving}>
              {saving ? "Saving..." : "Add Alert"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">CI Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Push metrics from your CI pipeline using the API endpoint:
          </p>
          <div className="bg-muted rounded-lg p-3 text-xs font-mono">
            <p className="text-muted-foreground mb-1">POST /api/metrics</p>
            <p>{`Headers: { "x-api-key": "your-api-key" }`}</p>
            <p className="mt-2">{`Body: {`}</p>
            <p className="pl-4">{`"moduleId": "uuid",`}</p>
            <p className="pl-4">{`"bundleSizeKb": 245,`}</p>
            <p className="pl-4">{`"renderTimeMs": 120,`}</p>
            <p className="pl-4">{`"lighthouseScore": 92,`}</p>
            <p className="pl-4">{`"clsScore": 0.05`}</p>
            <p>{`}`}</p>
          </div>
        </CardContent>
      </Card>

      {/* Active alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Active Alerts
            <Badge className="ml-2 text-xs">{alerts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No alerts configured yet.
            </p>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <span className="text-sm font-medium">{alert.moduleName}</span>
                    <span className="text-muted-foreground text-sm mx-2">·</span>
                    <span className="text-sm text-muted-foreground">
                      {METRICS.find((m) => m.value === alert.metric)?.label}
                    </span>
                    <span className="text-muted-foreground text-sm mx-2">·</span>
                    <span className="text-sm">threshold: {alert.threshold}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(alert.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}