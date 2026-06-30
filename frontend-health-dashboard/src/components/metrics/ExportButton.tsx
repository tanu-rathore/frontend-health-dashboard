"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ExportButtonProps {
  moduleId: string;
  moduleName: string;
}

export default function ExportButton({
  moduleId,
  moduleName,
}: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/metrics/${moduleId}/export`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${moduleName}-metrics.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
      {exporting ? "Exporting..." : "Export CSV"}
    </Button>
  );
}