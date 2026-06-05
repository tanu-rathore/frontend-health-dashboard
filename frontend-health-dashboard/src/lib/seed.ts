import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { modules, metrics } from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const MODULE_DATA = [
  { name: "Catalog",      description: "Product catalog browsing",     team: "Commerce"  },
  { name: "Checkout",     description: "Cart and payment flow",         team: "Commerce"  },
  { name: "Auth",         description: "Login and registration",        team: "Platform"  },
  { name: "Dashboard",    description: "Admin analytics dashboard",     team: "Platform"  },
  { name: "Search",       description: "Global search experience",      team: "Discovery" },
  { name: "Recommend",    description: "Product recommendations",       team: "Discovery" },
  { name: "Profile",      description: "User profile management",       team: "Growth"    },
  { name: "Notifications",description: "Push and in-app notifications", team: "Growth"    },
  { name: "Reports",      description: "Business reporting module",     team: "Analytics" },
  { name: "Settings",     description: "App configuration panel",      team: "Platform"  },
  { name: "Engineering",  description: "Internal tooling dashboard",    team: "DevEx"     },
  { name: "Onboarding",   description: "New user onboarding flow",      team: "Growth"    },
];

function randomBetween(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

async function seed() {
  console.log("Seeding modules...");

  const insertedModules = await db.insert(modules).values(MODULE_DATA).returning();

  console.log(`Inserted ${insertedModules.length} modules`);
  console.log("Seeding metrics (30 days per module)...");

  const metricsData = [];

  for (const mod of insertedModules) {
    for (let day = 29; day >= 0; day--) {
      const date = new Date();
      date.setDate(date.getDate() - day);

      metricsData.push({
        moduleId: mod.id,
        bundleSizeKb: randomBetween(150, 600),
        renderTimeMs: randomBetween(80, 600),
        lighthouseScore: randomBetween(55, 99),
        clsScore: randomBetween(0.01, 0.35),
        recordedAt: date,
      });
    }
  }

  await db.insert(metrics).values(metricsData);
  console.log(`Inserted ${metricsData.length} metric records`);
  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});