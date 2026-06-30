"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TEAMS = ["All Teams", "Commerce", "Platform", "Discovery", "Growth", "Analytics", "DevEx"];
const STATUSES = ["All", "healthy", "warning", "critical"];

export default function DashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "All" || value === "All Teams" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/dashboard?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <Input
        placeholder="Search modules..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => updateFilter("search", e.target.value)}
        className="sm:w-64"
      />
      <Select
        defaultValue={searchParams.get("team") ?? "All Teams"}
        onValueChange={(v) => updateFilter("team", v)}
      >
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Filter by team" />
        </SelectTrigger>
        <SelectContent>
          {TEAMS.map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("status") ?? "All"}
        onValueChange={(v) => updateFilter("status", v)}
      >
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}