import { seed } from "../seed";
import { db } from "../db";
import * as schema from "../../shared/schema";

async function reseed() {
  console.log("⚠️  WARNING: This will clear ALL data and reseed from JSON files!");
  console.log("Clearing database...");
  
  // Drop all tables in reverse dependency order
  await db.delete(schema.courtVisibilityLogs);
  await db.delete(schema.matchStats);
  await db.delete(schema.matches);
  await db.delete(schema.players);
  await db.delete(schema.teams);
  await db.delete(schema.tournaments);
  await db.delete(schema.orders);
  await db.delete(schema.products);
  await db.delete(schema.brandAssets);
  await db.delete(schema.inquiries);
  await db.delete(schema.media);
  await db.delete(schema.courts);
  await db.delete(schema.users);
  
  console.log("✓ Database cleared");
  console.log("Re-seeding from JSON files...");
  
  await seed();
  
  console.log("✅ Re-seeding complete!");
  process.exit(0);
}

reseed().catch((error) => {
  console.error("❌ Re-seeding failed:", error);
  process.exit(1);
});
