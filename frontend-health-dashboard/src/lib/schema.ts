import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";

export const modules = pgTable("modules", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  team: text("team").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const metrics = pgTable("metrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  moduleId: uuid("module_id").references(() => modules.id).notNull(),
  bundleSizeKb: real("bundle_size_kb").notNull(),
  renderTimeMs: real("render_time_ms").notNull(),
  lighthouseScore: real("lighthouse_score").notNull(),
  clsScore: real("cls_score").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});